const express = require('express');
const path = require('path');
const fs = require('fs');
const exphbs = require('express-handlebars')

const app = express();

const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const aboutRoutes = require('./routes/about')
const cartRoutes = require('./routes/cart')

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'pages')

/* app.get('/', (req, res)=>{
    // res.sendFile(path.join(__dirname, 'pages', 'index.html')) // without nandllebars 
    res.render('index', {
        title: 'Главная страница',
        isHome: true,
    })
});

app.get('/about', (req, res)=>{
    // res.sendFile(path.join(__dirname, 'pages', 'about.html')) 
    res.render('about', {
        title: 'О нас',
        isAbout: true,
    })
})

app.get('/courses', (req, res)=>{
    res.render('courses', {
        title: 'Курсы',
        isCourses: true,
    })
})

app.get('/add', (req, res)=>{
    res.render('add', {
        title: 'Добавить курс',
        isAdd: true,
    })
}) */

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}))

app.use(homeRoutes);
app.use(aboutRoutes);
app.use(coursesRoutes);
app.use(addRoutes);
app.use(cartRoutes);





const PORT = process.env.PORT || 3000 ;

app.listen(PORT , ()=>{
    console.log(`server is running on port ${PORT}`);
});