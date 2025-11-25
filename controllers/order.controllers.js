const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");

exports.createOrder = async (req, res) => {
    const { shippingAddress, phone } = req.body;
    const userId = req.user._id
    try {

        if (!shippingAddress || !phone) {
            return res.status(400).json({ message: "Create Profile first" })
        }

        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const totalAmount = cart.totalPrice;

        const order = await Order({
            user: userId,
            orderItems: cart.items.map((i) => (
                {
                    product: i.product,
                    quantity: i.quantity
                }
            )),
            shippingAddress,
            phone,
            totalAmount
        })

        if (order.orderItems.length === 0) {
            return res.status(404).json({ message: "No order found" })
        }

        await order.save();

        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        return res.status(201).json({ message: "Order Placed Successfully", order });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

exports.getAllOrder = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'fullname email').populate('orderItems.product', 'name image price')
        return res.status(200).json(orders);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' })
    }
}

exports.getUserOrder = async (req, res) => {
    const userId = req.user._id;
    try {
        const orders = await Order.find({ user: userId }).populate('orderItems.product', 'name price').populate('user', 'fullname address phone');
        return res.status(200).json(orders);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' })
    }
}

exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }

        if (status === "Delivered" && order.status !== "Delivered") {
            for (let item of order.orderItems) {
                const product = await Product.findById(item.product._id);
                if (product.stock < item.quantity) {
                    return res.status(400).json({ message: `${product.name} does not have enough stock` })
                }
                product.stock -= item.quantity;
                await product.save();
            }
        }

        order.status = status;
        await order.save();

        return res.status(200).json({ message: "order status updated", order });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server Error'})
    }
}

exports.deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findByIdAndDelete({ _id: orderId });
        if (!order) {
            return res.status(404).json({ message: "Order not found"});
        }
        return res.status(200).json({ message: "order deleted successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" })
    }
}