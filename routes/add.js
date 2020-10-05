const {Router} = require('express')
const Course = require('../models/course')
const authRequired = require('../middleware/auth')
const router = Router()



router.get('/add', authRequired, (req, res)=>{
    res.render('add', {
        title: 'Добавить курс',
        isAdd: true,
    })
})


router.post('/add', authRequired, async (req, res) => {
    req.body.image == '' ? req.body.image = '/img/default.jpg' : null
    req.body.description == '' ? req.body.description = 'Нет описания...' : null
    /* const course = new Course(req.body.title, req.body.price, req.body.image, req.body.description); */ // file DB
    /* console.log('получили новй курс: ', course); */ 
    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        img: req.body.image,
        description: req.body.description,
        userId: req.user._id,
    })

    try {
        await course.save();
        res.redirect('/courses')
    } catch (error) {
        console.log(error);
    }
    
  })

module.exports = router