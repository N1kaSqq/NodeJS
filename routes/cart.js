const {Router} = require('express')
const router = Router()

router.post('/cart/add', async (req, res)=>{
    console.log(req.body);
    res.redirect('/')
    
})


router.get('/cart', async (req, res)=>{
    res.render('cart',{
        title : 'Корзина'
    })
    
}) 

module.exports = router