const {Router} = require('express')
const router = Router()
const User = require('../models/user')

router.get('/auth/login', async (req, res)=>{
    res.render('auth/login', {
        title: 'Вход',
        layout : 'empty',
    }) 
})

router.get('/auth/logout', async (req, res)=>{
    req.session.destroy(()=>{
        res.redirect('/');
    })
    
})

router.post('/auth/login', async (req, res)=>{
    const user = await User.findById('5f6875b0b20a9250b8cee1a7');
    req.session.user = user;
    req.session.isAuth = true;
    req.session.save(err => {
        if(err) {
            throw new Error(err)
        }
        res.redirect('/');
    })
    
})

module.exports = router