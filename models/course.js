const fs = require('fs')
const path = require('path')

const {
    v4: uuid
} = require('uuid');

class Course {
    constructor(title, price, img, description) {
        this.title = title;
        this.price = price;
        this.img = img;
        this.description = description;
        this.id = uuid();
    }

    async save() {
        const allCourses = await Course.getAll(); // получили все курсы в allCourses
        /* console.log('Все старые курсы:', allCourses); */
        allCourses.push({
            title: this.title,
            price: this.price,
            img: this.img,
            description: this.description,
            id: this.id,
        }) // добавили новый курс в массив всех курсов
        /* console.log('Все новые курсы курсы:', allCourses); */

        return new Promise((resolve, reject) => {  // сохраняем новые курсы в файле
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                JSON.stringify(allCourses),
                (err) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                }
            )
        })
    }

    static getAll() { // возвращает все содержимое файла courses.json

        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                'utf-8',
                (err, content) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(JSON.parse(content))
                    }
                }
            )
        })
    }

    static async getByID(id) { // поиск курса по его id
        const AllCourses = await Course.getAll();
        const current = AllCourses.find((item)=>{
           return item.id == id;
        })
        return current;
    }
}

module.exports = Course
