const { Router } = require("express");
const Order = require('./../models/order')
const router = Router()

router.get('/orders', async (req, res)=>{
    try {
        const orders = await Order.find({
            'user.userId': req.user._id
        }).populate('user.userId')

        res.render('orders', {
            isOrders: true,
            title: 'Ваши заказы',
            orders: orders.map(i =>{
                return {
                    ...i._doc,
                    price: i.courses.reduce((total, c) => {
                        return total += c.count * c.course.price
                    }, 0)
                }
            })
        })
    } catch (error) {
        console.log(error);
    }
})

router.post('/orders', async (req, res)=>{
    try {
        const user = await req.user.populate('cart.items.courseId').execPopulate();

        const courses = user.cart.items.map((item)=>{
            return {
                count: item.count,
                course: {...item.courseId._doc}
            }
        })

        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user._id,
            },
            courses
        })

        await order.save();
        await req.user.clearCart();

        res.redirect('/orders')
    } catch (error) {
        console.log(error);
    }
})

module.exports = router
