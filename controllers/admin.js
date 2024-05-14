const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  // 164. Using Magic Association Methods
  req.user.createProduct({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description
  })
  // 154. Inserting Data and Crating a Product
  .then(result => {
    //console.log(result);
    console.log("Created Product");
    res.redirect("/admin/products");
  })
  .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');  
  }
  const prodId = req.params.productId;
  // 165. Fetching Related Products
  req.user.getProducts({where: {id: prodId}})

  // 159. Updating Products
  //Product.findById(prodId)
  .then( products => {
    const product = products[0];
    if (!product) {
      return res.redirect('/');  
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  })
  .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImage = req.body.imageUrl;
  const updatedDesc = req.body.description;

  // 159. Updating Products
  Product.findByPk(prodId)
  .then(product => {
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDesc;
    product.imageUrl = updatedImage; 
    return product.save(); 
  })
  .then(result => {
    console.log("UPDATED PRODUCT!");
    res.redirect('/admin/products');
  })
  .catch(err => console.log(err));
}

exports.getProducts = (req, res, next) => {
  // 158. Fetching Admin Products
  // 165. Fetching Related Products
  req.user.getProducts()
  //Product.findAll()
  .then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    })
  })
  .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  // 160. Deleting Product
  Product.findByPk(prodId)
  .then(product => {
    return product.destroy();  
  })
  .then(result => {
    console.log("DESTROYED PRODUCT!");
    res.redirect('/admin/products'); 
  })
  .catch(err => console.log(err)); 
}