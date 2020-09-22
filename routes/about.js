const {Router} = require('express')
const router = Router()

router.get('/about', (req, res)=>{
    res.render('about', {
        title: 'О нас',
        isAbout: true,
    })
})


module.exports = router