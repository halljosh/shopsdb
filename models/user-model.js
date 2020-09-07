const getDb = require('../data/database').getDb;
const mongodb = require('mongodb');

class User {
    constructor(username, email, cart, id) {
        this.name = username;
        this.email = email;
        this.cart = cart;
        this._id = id
    };

    save() {
        const db = getDb();
        return db
            .collection('users')
            .insertOne(this)
            .then(result => console.log("user succesfully added!"))
            .catch(err => console.log(err));
    };

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });
        let newQty = 1
        const updatedItems = [...this.cart.items];
        if (cartProductIndex >= 0){
            newQty = this.cart.items[cartProductIndex].quantity + 1;
            updatedItems[cartProductIndex].quantity = newQty;
        } else { 
            updatedItems.push({ productId: new mongodb.ObjectId(product._id), quantity: newQty})
        }
        const updatedCart = {items: updatedItems};
        const db = getDb();
        return db
            .collection('users') 
            .updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: {cart: updatedCart}});
    };

    getAllCartItems() {
        const db = getDb();
        const productIds = this.cart.items.map(item => {
            return item.productId;
        });
        return db
            .collection('products')
            .find({_id: {$in: productIds}})
            .toArray()
            .then(products => {
                return products.map(product => {
                    return {...product, quantity: this.cart.items.find(item => {
                        return item.productId.toString() === product._id.toString();
                        }).quantity
                    };
                })
            })
            .catch(err => {
                console.log(err);
            })
    };

    static findById(userId) {
        const db = getDb();
        return db
            .collection('users')
            .find({ _id: new mongodb.ObjectId(userId)})
            .next()
            .then(user => {
                console.log(user);
                return user;
            })
            .catch(err => console.log(err));
    };
};

module.exports = User;