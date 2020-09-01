const db = require('../data/database');
const Cart = require('./cart-model');

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
        return db.execute('INSERT INTO products (title, artist, imageURL, description, price) VALUES (?, ?, ?, ?, ?)',
        [this.title, this.artist, this.imageURL, this.description, this.price]
        );
    }
    static delete(id) {
        
    }

    static fetchAll() { // 
        return db.execute('SELECT * FROM products'); 
    }

    static searchId(id) { 
        return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
    }
};