const Product = require('../models/product-model');

exports.getAddProductPage = (req, res, next) => { //GETs the add product page
    res.render('admin-views/add-product', {products: Product, docTitle: 'Add Product', path:'/admin/add-product'}); //here's where we're using our product model
};

exports.postProduct = (req, res, next) => { //POSTs the product to our product array with key of title
    const title = req.body.title;
    const artist = req.body.artist;
    const imageURL = req.body.imageURL;
    const description = req.body.description;
    const price = req.body.price;
    const newProduct = new Product(null, title, artist, imageURL, description, price); //creates a new product based on our model
    newProduct.save(); //saves current product to our array
    res.redirect('/'); //sends back home
};

exports.getAdminProductList = (req, res, next) => { //GETs an admin page with all our products
    Product.fetchAll(products => { //fetches our entire list of products
        res.render('admin-views/admin-product-view', {products: products, docTitle: 'Shop', path: '/admin/admin-product-view'}); //looks for .pug files & passes our products array
    }); 
};

exports.getEditProductPage = (req, res, next) => { //GETs an edit page with a specific product ID    
    const id = req.params.id;
    Product.searchId(id, foundProduct => {
        res.render('admin-views/edit-product', {foundProduct: foundProduct, docTitle: 'edit product', path: '/admin/edit-product/' + id});
    });
};

exports.postEditedProduct = (req, res, next) => {
    const id = req.body.id;
    const updatedTitle = req.body.title;
    const updatedArtist = req.body.artist;
    const updatedURL = req.body.imageURL;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;
    const updatedProduct = new Product(id, updatedTitle, updatedArtist, updatedURL, updatedDescription, updatedPrice);
    updatedProduct.save();
    res.redirect('/admin/admin-product-view');
}

exports.deleteProduct = (req, res, next) => {
    const id = req.body.id;
    Product.delete(id);
    res.redirect('/admin/admin-product-view');
}