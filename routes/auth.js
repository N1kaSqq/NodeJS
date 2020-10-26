const {Router} = require('express')
const bcrypt = require('bcryptjs')
const router = Router()
const User = require('../models/user')

router.get('/auth/login', async (req, res)=>{
    res.render('auth/login', {
        title: 'Вход',
        layout: 'empty',
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')
    }) 
})

router.get('/auth/logout', async (req, res)=>{
    req.session.destroy(()=>{
        res.redirect('/');
    })
    
})

router.post('/auth/login', async (req, res)=>{
    try {
        const {email, password} = req.body;
        const candidate = await User.findOne({ email });

        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password); 
            if (areSame) {
                req.session.user = candidate;
                req.session.isAuth = true;
                req.session.save(err => {
                    if(err) {
                        throw new Error(err)
                    }
                    res.redirect('/');
                })
            } else {
                req.flash('loginError', 'Неверный пароль!');
                res.redirect('/auth/login#login');
            }

        } else {
            req.flash('loginError', 'Такого пользователя не существует!');
            res.redirect('/auth/login#login');
        }
    } catch (error) {
        console.log(error);
    }
})

router.post('/auth/register', async (req, res)=>{
    try {
        const {name, email, password, confirmpassword} = req.body;

         if (password !== confirmpassword) {
            req.flash('registerError', 'Пароли не совпадают');
            return res.redirect('/auth/login#register');
        } 

        const candidate = await User.findOne({ email })
        
        if (candidate) {
            req.flash('registerError', 'Пользователь с таким email уже существует!');
            res.redirect('/auth/login#register');
        } else {
            const hashPassword = await bcrypt.hash(password, 12)
            const user = new User({
                email, name, password: hashPassword, cart: { items: [] }
            })
            await user.save();
            res.redirect('/auth/login#login')
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = router