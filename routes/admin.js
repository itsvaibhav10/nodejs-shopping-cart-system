const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
var Product = require("../models/product");
const Order = require("../models/order");
const Cart = require("../models/cart");
// Set The Storage Engine
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single("pro_image");

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

//Add Product Get And Post Routes
router.get("/addProduct", (req, res) => {
  res.render("admin/addProduct");
});
router.post("/addProduct", (req, res) => {
  upload(req, res, err => {
    if (err) {
      res.render("admin/addProduct", {
        msg: err
      });
    } else {
      if (req.file == undefined) {
        res.render("admin/addProduct", {
          msg: "Error: No File Selected!"
        });
      } else {
        // Saving Product To database
        var product = new Product({
          imagePath: `/uploads/${req.file.filename}`,
          title: req.body.pro_title,
          description: req.body.pro_description,
          price: req.body.pro_price
        });
        product.save((err, result) => {
          res.render("admin/addProduct");
        });
      }
    }
  });
});
//Edit Product Get And Post Routes
router.get("/editProduct", (req, res) => {
  Product.find(function(err, docs) {
    const productChunks = [];
    var chunkSize = docs.length;
    for (var i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs);
    }
    res.render("admin/editProduct", {
      title: "Shopping Cart",
      products: productChunks
    });
  });
});
//View Orders Get Routes
router.get("/viewOrders", (req, res) => {
  Order.find({}, (err, orders) => {
    if (err) {
      return res.send("Error!");
    }
    var cart;
    orders.forEach(order => {
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render("admin/viewOrders", { orders: orders });
  });
});
// Deleting Product
router.get("/del-pro/:id", (req, res) => {
  Product.deleteOne({ _id: req.params.id }, err => {
    if (err) {
      return handlError(err);
    }
    res.redirect("/admin/editProduct");
  });
});
// Editing Product
router.get("/edit-pro/:id", (req, res) => {
  Product.findOne({ _id: req.params.id }, function(err, docs) {
    console.log(docs);
    res.render("admin/edit-pro", {
      title: "Shopping Cart",
      products: docs
    });
  });
});
router.post("/edit-pro/:id", (req, res) => {
  Product.updateOne(
    { _id: req.params.id },
    {
      title: req.body.pro_title,
      price: req.body.pro_price,
      description: req.body.pro_description
    },
    err => {
      if (err) {
        return handlError(err);
      }
      res.redirect("/admin/editProduct");
    }
  );
});
module.exports = router;
