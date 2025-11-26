const Stripe = require('stripe');
const Order = require('../models/Order');
const dotenv = require('dotenv')
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

exports.createCheckoutSession = async (req, res) => {
    const { orderId } = req.body;
    try {
        if (!orderId) {
            return res.status(400).json({ message: "OrderId is required" });
        }
        const order = await Order.findById(orderId).populate("orderItems.product");
        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }
        const lineItems = order.orderItems.map(item => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.product.name
                },
                unit_amount: item.product.price * 100,
            },
            quantity: item.quantity
        }))

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: lineItems,
            success_url: `https://shopease-frontend-smoky.vercel.app/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: "https://shopease-frontend-smoky.vercel.app/payment-failed",
            metadata: {
                orderId: order._id.toString()
            }
        })

        return res.status(200).json({ url: session.url })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Payment session creation failed" });    
    }
}

exports.stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        return res.status(400).send(`Webhook Error: ${error.message}`)
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const orderId = session.metadata.orderId;
        console.log("Payment successful for order:", orderId);
        await Order.findByIdAndUpdate(orderId, {
            status: "Confirmed"
        });
        console.log("Order status updated");
    }
    return res.status(200).json({ received: true });
}