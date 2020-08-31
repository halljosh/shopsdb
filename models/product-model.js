const fs = require('fs'); //imports file storage module
const path = require('path'); //imports path module
const Cart = require('./cart-model');

const p = path.join(path.dirname(process.mainModule.filename), 'data','productlist.json'); //defines our path to the product list file

const getProductsFromFile = cb => { //helper function
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]); //creates an empty array if error is thrown 
        } else {
            cb(JSON.parse(fileContent)); //parses our file from JSON if no error is thrown
        }
    });
};

module.exports = class Product {
    constructor(id, title, artist, imageURL, description, price) { //contains our album properties
        this.id = id;
        this.title = title;
        this.artist = artist;
        this.imageURL = imageURL;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile(products => {
            if (this.id) { //replaces existing product info upon edit
                const existingProductIndex = products.findIndex (prod => prod.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), err => {  
                    console.log(err);
                });
            } else {
                this.id = Math.random().toString(); //gives new product a unique ID
                products.push(this); //pushes current input to products array
                fs.writeFile(p, JSON.stringify(products), err => {  //re-parses our file as JSON and saves
                console.log(err);
                });
            }
        });
    }
    static delete(id) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id ===id);
            const updatedProducts = products.filter(p => p.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                if (!err) {
                    Cart.deleteProduct(id, product.price);
                }
            });
        });
    }

    static fetchAll(cb) { // static calls the function on the Product class itself
        getProductsFromFile(cb);
    }

    static searchId(id, cb) { //filters our entire products array by ID
        getProductsFromFile(products => {
            const foundProduct = products.find(p => p.id === id);
            cb(foundProduct); 
        });
    }
};
