const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

// 153. Syncing JS Definition to the Database
const sequelize = require("./util/database");

// 162. Adding a One to Many Relationship
const Product = require("./models/product");
const User = require("./models/user");


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// 163. Creating and Managing a DUMMY User
app.use((req, res, next) => {
    User.findByPk(1)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);


// 162. Adding a One to Many Relationship
Product.belongsTo(User, {constraints: true, onDelete: "CASCADE"});
User.hasMany(Product);

// 166. One to Many and Many to Many Relations
User.nasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});

// 171. Adding an Order Model
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem});

// 153. Syncing JS Definition to the Database
sequelize
    .sync()
    //.sync({force: true})
    .then(result => {
        // 163. Creating and Managing a DUMMY User
        return User.findByPk(1);

        //console.log(result); 
    })
    .then(user => {
        if (!user) {
            return User.create({name: "George", email: "test@a.com"});
        }  
        return user;  
    })
    .then(user => {
        //console.log(user);

        // 167. Creating and Fetching a Cart
        return user.createCart();
    })
    .then(cart => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err); 
});
