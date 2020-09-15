const {Router} = require('express')
const Course = require('../models/course')
const router = Router()



router.get('/add', (req, res)=>{
    res.render('add', {
        title: 'Добавить курс',
        isAdd: true,
    })
})

router.post('/add', async (req, res) => {

    req.body.image == '' ? req.body.image = '/img/default.jpg' : null
    req.body.description == '' ? req.body.description = 'Нет описания...' : null
    
    const course = new Course(req.body.title, req.body.price, req.body.image, req.body.description);
    /* console.log('получили новй курс: ', course); */ 
    await course.save();

    res.redirect('/courses')
  })

module.exports = router