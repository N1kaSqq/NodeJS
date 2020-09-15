const {Router} = require('express')
const Course = require('../models/course')
const router = Router()

router.get('/courses', async (req, res) => {

    const allCourses = await Course.getAll();

    res.render('courses', { 
        title: 'Курсы',
        isCourses: true,
        allCourses,
    })
})

router.get('/courses/:id/edit', async (req, res)=>{
    /* console.log(req.query); */
    /* res.redirect('/') */
    if(!req.query.allow){
        return res.redirect('/')
    }
    const course = await Course.getByID(req.params.id);
    /* console.log(course); */

    try {
        res.render('edit-course', {
            title : `Edit ${course.title}`,
            course,
        })
    } catch (error) {
        res.redirect('/');
    }

})

router.post('/courses/edit', async (req, res)=>{
    /* console.log(req.body); */
    const updatedCourse = req.body  //курс который нужно обновить 
    await Course.editCourse(updatedCourse);

    res.redirect('/courses');
})

router.get('/courses/:id', async (req, res) => {

    const course = await Course.getByID(req.params.id);
    /* console.log(course); */

    try {
        res.render('detailedCourse', {
            layout : 'empty',
            title: course.title,
            course,
        })
    } catch (error) {
        res.redirect('/')
    }

})

module.exports = router