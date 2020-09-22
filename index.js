const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose')
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const User = require('./models/user')

const app = express();

const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const aboutRoutes = require('./routes/about')
const cartRoutes = require('./routes/cart')

/* const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
}) */

/* app.engine('hbs', hbs.engine) */

app.engine('handlebars', exphbs({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));

app.set('view engine', 'handlebars') 
app.set('views', 'pages')
mongoose.set('useFindAndModify', false);

app.use(async (req, res, next)=>{

    try {
        const user = await User.findById('5f6875b0b20a9250b8cee1a7');
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
    }
})

/* app.use(express.static('public')); */
app.use(express.static(path.join(__dirname, 'public'))); // лучше таким способом
app.use(express.urlencoded({extended: true}))

app.use(homeRoutes);
app.use(aboutRoutes);
app.use(coursesRoutes);
app.use(addRoutes);
app.use(cartRoutes);

const MongoURL = `mongodb+srv://Nikita:Ea7dP4H57g43Lihn@cluster0.tegas.mongodb.net/Shop`
const PORT = process.env.PORT || 3000 ;

(async function start(){
    try {
        await mongoose.connect(MongoURL, {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        });

        const candidate = await User.findOne();
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
        }


        app.listen(PORT , ()=>{
            console.log(`server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
})();


