const fs = require('fs'); //imports file storage module
const path = require('path'); //imports path module

const p = path.join(path.dirname(process.mainModule.filename), 'data','productlist.json'); //defines our path to the product list file

const getProductsFromFile = cb => { //helper function
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent)); //parses our file from JSON if no error is thrown
        }
    });
};

module.exports = class Product {
    constructor(t) {
        this.title = t;
    }

    save() {
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), err => {  //re-parses our file and saves
                console.log(err);
            });
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }
};
