const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose')
const Handlebars = require('handlebars')
const csrf = require('csurf')
const flash = require('connect-flash')
const exphbs = require('express-handlebars')
const session = require('express-session')
const MongoStore = require("connect-mongodb-session")(session)
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')

const app = express();

const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const aboutRoutes = require('./routes/about')
const cartRoutes = require('./routes/cart')
const ordersRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')

const MongoURL = `mongodb+srv://Nikita:Ea7dP4H57g43Lihn@cluster0.tegas.mongodb.net/Shop`
/* https://www.youtube.com/watch?v=AfypOVaB5r0 сделать оплату */

/* const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
}) */

/* app.engine('hbs', hbs.engine) */

const store = new MongoStore({
    collection: 'sessions',
    uri: MongoURL
})

app.engine('handlebars', exphbs({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));

app.set('view engine', 'handlebars') 
app.set('views', 'pages')
mongoose.set('useFindAndModify', false);

/* app.use(async (req, res, next)=>{
    try {
        const user = await User.findById('5f6875b0b20a9250b8cee1a7');
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
    }
}) */

/* app.use(express.static('public')); */
app.use(express.static(path.join(__dirname, 'public'))); // лучше таким способом
app.use(express.urlencoded({extended: true}))

app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(csrf())
app.use(flash())
app.use(varMiddleware) // в ответе сервера теперь есть переменная res.locals.isAuth
app.use(userMiddleware) // при регистрации req.session.user заносится в req.user (модель mongo user.js)

app.use(homeRoutes);
app.use(aboutRoutes);
app.use(coursesRoutes);
app.use(addRoutes);
app.use(cartRoutes);
app.use(ordersRoutes);
app.use(authRoutes)


const PORT = process.env.PORT || 3000 ;

(async function start(){
    try {
        await mongoose.connect(MongoURL, {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        });

        /* const candidate = await User.findOne();
        if (!candidate) {
            const user = new User({
                email: 'ivan@mail.ru',
                name: 'ivan',
                cart: {
                    items: []
                }
            })
            await user.save();
        } else {
            console.log(candidate);
        } */
        app.listen(PORT , ()=>{
            console.log(`server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
})();


