const {Router} = require('express')
/* const { count } = require('./../models/course') */
const Course = require('./../models/course')
const authRequired = require('../middleware/auth')
const router = Router()

function mapCartItems(cart){
    return cart.items.map((item)=>{
          return  {
                ...item.courseId._doc,
                count: item.count
            }
    })
}

function computePrice(courses){
    let price = 0;
    courses.forEach(element => {
        price += element.price * element.count;
    });
    return price
}

router.post('/cart/add', authRequired, async (req, res)=>{
   /*  console.log(req.body); */
    const course = await Course.findById(req.body.id);

    await req.user.addToCart(course);              
    res.redirect('/cart');
})


router.get('/cart', authRequired, async (req, res)=>{

    const user = await req.user.populate('cart.items.courseId').execPopulate();

    const courses = mapCartItems(user.cart);
    const price = computePrice(courses);
    res.render('cart',{
        title : 'Корзина',
        courses: courses,
        price,
    })
}) 

router.delete('/cart/remove/:id', authRequired, async (req, res)=>{
   /*  req.params.id */
   await req.user.removeFromCart(req.params.id);

    const user = await req.user.populate('cart.items.courseId').execPopulate();
    const courses = mapCartItems(user.cart);
    const price = computePrice(courses);
    const cart = {
        courses,
        price,
    }

    res.json(cart);
})

router.post('/cart/deleteAll', authRequired, async (req, res)=>{   
    await req.user.clearCart();

    res.redirect('/cart');

})

module.exports = router