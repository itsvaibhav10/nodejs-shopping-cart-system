var Product = require('../models/product');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopping', {useNewUrlParser: true});
var product = [
    new Product({
        imagePath: '/images/card_1.jpg',
        title: 'Image of card',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sollicitudin lorem id ex tincidunt, ut fermentum quam interdum. Orci varius.',
        price: 15
    }),
    new Product({
        imagePath: '/images/card_2.jpg',
        title: 'Image of card',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sollicitudin lorem id ex tincidunt, ut fermentum quam interdum. Orci varius.',
        price: 15
    }),
    new Product({
        imagePath: '/images/card_3.jpg',
        title: 'Image of card',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sollicitudin lorem id ex tincidunt, ut fermentum quam interdum. Orci varius.',
        price: 15
    }),
    new Product({
        imagePath: '/images/card_1.jpg',
        title: 'Image of card',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sollicitudin lorem id ex tincidunt, ut fermentum quam interdum. Orci varius.',
        price: 15
    })
]
var done = 0;

for (var i = 0; i < product.length; i++) {
    product[i].save(function (err, result) {
        done++
        if (done == product.length) {
            exit();

        }
    });

}

function exit() {
    mongoose.disconnect();
}