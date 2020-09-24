const {Schema, model} = require('mongoose')


const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    cart: {
        items: [{
            count: {
                type: Number,
                required: true,
                default: 1,
            },
            courseId: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'Course',
            }
        }]
    }
})

userSchema.methods.addToCart = function(course){
    const clonedItems = [...this.cart.items];
    const index = clonedItems.findIndex((item)=>{
        return item.courseId.toString() === course._id.toString()
    })

    if (index >= 0) {
        clonedItems[index].count++
    } else {
        clonedItems.push({
            courseId: course._id,
            count: 1,
        })
    }

    this.cart = {items: clonedItems};

    return this.save()
}

userSchema.methods.removeFromCart = function(id) {
    let clonedItems = [...this.cart.items];
    const index = clonedItems.findIndex((item)=>{
        return item.courseId.toString() === id.toString()
    })

    if (clonedItems[index].count === 1) {
        clonedItems = clonedItems.filter((i)=>{
            return i.courseId.toString() != id.toString()
        })
    } else {
        clonedItems[index].count--
    }

    this.cart = {items: clonedItems};

    return this.save()
}

userSchema.methods.deleteAll = function(){
    let cart = {
        items: [],
    }
    this.cart = cart;
    return this.save()
}

module.exports = model('User', userSchema)