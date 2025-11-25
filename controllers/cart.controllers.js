const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id
    try {
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(404).json({ message: "Product not found"});
        }

        let cart = await Cart.findOne({ user: userId })

        if (!cart) {
            cart = await Cart.create({
                user: userId,
                items: [{
                    product: productId,
                    quantity
                }],
                totalPrice: product.price * quantity
            })
        } else {
            const existingItem = cart.items.find((item) => item.product.toString() === productId);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({
                    product: productId,
                    quantity
                })
            }
            cart.totalPrice += product.price * quantity
        }

        await cart.save();
        return res.status(200).json({ message: "Product Added to cart", cart})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" })        
    }
}

exports.getCart = async (req, res) => {
    const userId = req.user._id
    try {
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        return res.status(200).json(cart);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ messgae: "Server Error" })
    }
}

exports.removeCart = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user._id
    try {
        const cart = await Cart.findOne({ user: userId })
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" })
        }

        const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        const product = await Product.findById(productId);
        cart.totalPrice -= product.price * cart.items[itemIndex].quantity;
        cart.items.splice(itemIndex, 1);

        await cart.save();
        return res.status(200).json({ message: "Product removed from the cart", cart })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" })
    }
}

exports.updateQuantity = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id
    try {
        const cart = await Cart.findOne({ user: userId })
        if (!cart) {
            return res.status(404).json({ message: "cart not found" })
        }

        const item = cart.items.find((item) => item.product.toString() === productId)
        if (!item) {
            return res.status(404).json({ message: "Product not found in cart" })
        }

        const product = await Product.findById(productId);
        cart.totalPrice -= product.price * item.quantity;
        item.quantity = quantity;
        cart.totalPrice += product.price * item.quantity;

        await cart.save();
        return res.status(200).json({ message: "quantity updated", cart});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" })    
    }
}

exports.clearCart = async (req, res) => {
    const userId = req.user._id
    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "cart not found" });
        }

        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();
        return res.status(200).json({ message: "Cart cleared"}) 
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "server error" })
    }
}