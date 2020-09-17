const {Router} = require('express')
const Cart = require('./../models/cart')
const Course = require('./../models/course')
const router = Router()

router.post('/cart/add', async (req, res)=>{
   /*  console.log(req.body); */
    const course = await Course.getByID(req.body.id);

    await Cart.add(course)                 
    res.redirect('/cart');
    
})


router.get('/cart', async (req, res)=>{

    const cart = await Cart.getCart();

    res.render('cart',{
        title : 'Корзина'
    })
    
}) 

module.exports = router