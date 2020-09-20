const fs = require('fs')
const path = require('path')

class Cart {

    static async add(course){
        const cart = await Cart.getCart();

        const index = cart.courses.findIndex((item)=>(
            item.id === course.id
        ))

        if (cart.courses[index]) {
            // курс уже есть
            cart.courses[index].count ++;
            
        } else {
            // курса ещё нет 
            course.count = 1;
            cart.courses.push(course);
        }

        cart.price += +course.price;

        console.log(cart)

        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'cart.json'),
                JSON.stringify(cart), 
                err => {
              if (err) {
                reject(err)
              } else {
                resolve()
              }
            })
          })

    }

    static async getCart(){

        return new Promise((resolve, reject)=>{
            fs.readFile(
                path.join(__dirname, '..', 'data', 'cart.json'),
                'utf-8',
                (err, content)=>{
                    if (err) {
                        reject(err)
                    } else {
                        resolve(JSON.parse(content))
                    }
                }
            )

        })
    }

    static async remove(id){

        const cart = await Cart.getCart();

        const index = cart.courses.findIndex((item) => item.id === id )
        const course = cart.courses[index];

        if (!cart.courses[index]) {
            return
        }

        if (course && course.count === 1) {
            // нужно удалить курс
            cart.courses = cart.courses.filter(item => item.id !== id)
        } else {
            // изменяем количество
            cart.courses[index].count--;
        }

        cart.price -= course.price;

        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'cart.json'),
                JSON.stringify(cart), 
                err => {
              if (err) {
                reject(err)
              } else {
                resolve()
              }
            })
        })
    }

    static async deleteAll(){

        const empty = {
            courses: [],
            price: 0
        }

        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'cart.json'),
                JSON.stringify(empty), 
                err => {
              if (err) {
                reject(err)
              } else {
                resolve()
              }
            })
        })

    }


    
}

module.exports = Cart