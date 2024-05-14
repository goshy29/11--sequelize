const Product = require('../models/product');
const Cart = require('../models/cart');

// 143. Fetching Products from Mysql
exports.getProducts = (req, res, next) => {
  // 156. Retrieving Data and Finding Products
  Product.findAll()
  .then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  })
  .catch(err => console.log(err));
};

// 146. Fetching a Single Product with the WHERE condition
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  // 157. Getting a Single Product with the WHERE Condition
  Product.findByPk(prodId)
    .then(product => {
      res.render("shop/product-detail", {product: product, pageTitle: product.title, path: "/products"});
    })
    .catch(err => console.log(err));

    // OR
    // Product.findAll({where: {id: prodId}})
    // .then(products => {
    //   res.render("shop/product-detail", {product: products[0], pageTitle: product.title, path: "/products"});
    // })
    // .catch(err => console.log(err));
}

exports.getIndex = (req, res, next) => {
  // 156. Retrieving Data and Finding Products
  Product.findAll()
  .then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  })
  .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  // 167. Creating and Fetching a Cart
  req.user.getCart()
  .then(cart => {
    return cart.getProducts()
      .then(products => {
        res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your Cart',
          products: products
      });
      })
      .catch(err => console.log(err));  
  })
  .catch(err => console.log(err));

  // Cart.getCart(cart => {
  //   Product.fetchAll(products => {
  //     const cartProducts = [];
  //     for (let product of products) {
  //       const cartProductData = cart.products.find(prod => prod.id === product.id);
  //       if (cartProductData) {
  //         cartProducts.push({productData: product, qty: cartProductData.qty});  
  //       } 
  //     }
  //     res.render('shop/cart', {
  //       path: '/cart',
  //       pageTitle: 'Your Cart',
  //       products: cartProducts
  //     });
  //   });
  // });
};

exports.postCart = (req, res, next) => {
  // 168. Adding New Products to the Cart
  // 169. Adding Existing Products and Retrieving Cart Items
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({where: {id: prodId}});
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;  
        return product;  
      }
      return Product.findByPk(prodId);
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: {quantity: newQuantity}
      });
    })
    .then(() => {
      res.redirect("/");
    })
    .catch(err => console.log(err));

  // Product.findById(prodId, product => {
  //   Cart.addProduct(prodId, product.price)
  // })
  // res.redirect("/cart");  
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  // 170. Deleting Related Items and Deleting Cart Products
  req.user.getCart()
    .then(cart => {
      return cart.getProducts({where: {id: prodId}});  
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(result => {
      res.redirect("/cart"); 
    })
    .catch(err => console.log(err));

  // Product.findById(prodId, product => {
  //   Cart.deleteProduct(prodId, product.price);
  //   res.redirect("/cart"); 
  // });
}

// 172. Storing CartItems as OrderItems
// 173. Resetting the Cart and Fetching and Outputting Orders
exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user.createOrder()
        .then(order => {
          return order.addProducts(products.map(product => {
            product.orderItem = {quantity: product.cartItem.quantity};
            return product;
          }));
        })
        .catch(err => console.log(err));
    })
    .then(result => {
      return fetchedCart.setProducts(null);
    })
    .then(result => {
      res.redirect("/orders");
    })
    .catch(err => console.log(err));
}

// 173. Resetting the Cart and Fetching and Outputting Orders
exports.getOrders = (req, res, next) => {
  req.user.getOrders({include: ["products"]})
  .then(orders => {
    res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
    orders: orders
  });  
  })
  .catch(err => console.log(err));

  // res.render('shop/orders', {
  //   path: '/orders',
  //   pageTitle: 'Your Orders'
  // });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
