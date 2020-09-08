const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true}, 
                quantity: { type: Number, required: true }
            }
        ]
    }
});

userSchema.methods.addToCart = function(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });
    let newQty = 1
    const updatedItems = [...this.cart.items];
    if (cartProductIndex >= 0){
        newQty = this.cart.items[cartProductIndex].quantity + 1;
        updatedItems[cartProductIndex].quantity = newQty;
    } else { 
        updatedItems.push({ productId: product._id, quantity: newQty})
    }
    const updatedCart = {items: updatedItems};
    this.cart = updatedCart;
    return this.save();
};

userSchema.methods.deleteItemFromCart = function(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
        console.log(productId);
        return item.productId.toString() !== productId.toString(); //returns false if you want to delete it
    });
    this.cart.items = updatedCartItems;
    return this.save();
};

userSchema.methods.clearCart = function() {
    this.cart = {items: []};
    return this.save();
}

module.exports = mongoose.model('User', userSchema);
