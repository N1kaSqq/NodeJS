const {Router} = require('express')
const bcrypt = require('bcryptjs')
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
    try {
        const {email, password} = req.body;
        const candidate = await User.findOne({ email })

        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password) 
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
                res.redirect('/auth/login#login')
            }

        } else {
            res.redirect('/auth/login#login')
        }
    } catch (error) {
        console.log(error);
    }
})


router.post('/auth/register', async (req, res)=>{
    try {
        const {name, email, password, confirmpassword} = req.body;
        const candidate = await User.findOne({ email })
        
        if (candidate) {
            res.redirect('/auth/login#register')
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