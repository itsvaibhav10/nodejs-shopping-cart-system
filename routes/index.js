const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/product');
const stripe = require('stripe')('Your Secret Key Here');
const Order = require('../models/order');

/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];
  Product.find(function(err, docs) {
    const productChunks = [];
    var chunkSize = docs.length;
    for (var i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs);
    }
    res.render('shop/index', {
      title: 'Shopping Cart',
      products: productChunks,
      successMsg: successMsg,
      noMessage: !successMsg
    });
  });
});
//Adding Items To Cart
router.get('/add-to-cart/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(productId, function(err, product) {
    cart.add(product, product.id);
    req.session.cart = cart;
    res.redirect('/');
  });
});
// Reduce item Of Cart
router.get('/reduce/:id', (req, res) => {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart);
  cart.removeByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});
// Remove item from Cart
router.get('/remove/:id', (req, res) => {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart);
  cart.removeItems(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});
// dispalying Items To cart
router.get('/shopping-cart', function(req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', { products: null });
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice
  });
});

// Payment Routes Starts Here
router.get('/checkout', isLoggedIn, (req, res) => {
  if (!req.session.cart) {
    return res.redirect('shop/shopping-cart');
    {
      products: null;
    }
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/checkout', {
    title: 'Shopping Cart',
    total: cart.totalPrice
  });
});

router.post('/checkout', isLoggedIn, (req, res) => {
  var cart = new Cart(req.session.cart);
  stripe.customers
    .create({
      email: req.body.stripeEmail,
      description:
        'name: ' +
        req.body.StripeCardHolder +
        ' ' +
        'Address: ' +
        req.body.stripeAddress,
      source: req.body.stripeToken
    })
    .then(customer =>
      stripe.charges.create({
        amount: cart.totalPrice * 100,
        description: 'Shopping Cart',
        currency: 'usd',
        customer: customer.id
      })
    )
    .then(charge => {
      var order = new Order({
        user: req.user,
        cart: cart,
        name: req.body.StripeCardHolder,
        address: req.body.stripeAddress,
        payment_Id: charge.id
      });
      order.save((err, result) => {
        req.flash('success', 'SuccessFully Bought The Product');
        req.session.cart = null;
        res.redirect('/');
      });
    });
});
module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}
