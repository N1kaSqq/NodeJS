const {Router} = require('express')
const Course = require('../models/course')
const authRequired = require('../middleware/auth')
const router = Router()

router.get('/courses', async (req, res) => {
    /* const allCourses = await Course.getAll(); */ // file DB
    const allCourses = await Course.find().populate('userId', 'email name');
    /*  console.log(allCourses); */
    res.render('courses', { 
        title: 'Курсы',
        isCourses: true,
        allCourses,
    })
})

router.get('/courses/:id/edit', authRequired,  async (req, res)=>{
    /* console.log(req.query); */
    /* res.redirect('/') */
    if(!req.query.allow){
        return res.redirect('/')
    }
    /* const course = await Course.getByID(req.params.id); */ // fileDB
    /* console.log(course); */
    const course = await Course.findById(req.params.id);

    try {
        res.render('edit-course', {
            title : `Edit ${course.title}`,
            course,
        })
    } catch (error) {
        res.redirect('/');
    }

})

router.post('/courses/edit', authRequired, async (req, res)=>{
    /* console.log(req.body); */
    /* const updatedCourse = req.body  //курс который нужно обновить 
    await Course.editCourse(updatedCourse); */
    const {id} = req.body;
    delete req.body.id;
    await Course.findByIdAndUpdate(id, req.body)

    res.redirect('/courses');
})

router.get('/courses/:id', async (req, res) => {
    /* const course = await Course.getByID(req.params.id); */ // fileDB
    const course = await Course.findById(req.params.id);
    /* console.log(course); */

    try {
        res.render('detailedCourse', {
            title: course.title,
            course,
        })
    } catch (error) {
        res.redirect('/')
    }

})

router.post('/courses/remove', authRequired, async (req, res)=>{
    try {
        await Course.deleteOne({
            _id: req.body.id, 
        })
        res.redirect('/courses')
    } catch (error) {
       console.log(error); 
    }
})

router.delete('/courses/remove/:id', authRequired, async (req, res)=>{
    try {
        await Course.deleteOne({
            _id: req.params.id, 
        })

        const allCourses = await Course.find();
        res.json(allCourses);
    } catch (error) {
        console.log(error);
    }
})

module.exports = router