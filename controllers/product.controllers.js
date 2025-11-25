const Category = require("../models/Category");
const Product = require("../models/Product");

exports.createProducts = async (req, res) => {
    const { name, description, price, stock, category, image } = req.body;
    try {
        if (!name || !price || !category) {
            return res.status(400).json({ message: "Name, Price and Category is required" })
        }
        const foundCategory = await Category.findOne({ name: category})
        if (!foundCategory) {
            return res.status(404).json({ message: "category not found!"})
        }
        const product = await Product.create({ name, description, price, category: foundCategory._id, stock, image });
        return res.status(201).json({ message: "Product created Successfully", product});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

exports.getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }
        return res.status(200).json({ message: "product fetched successfully", product })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

exports.getProduct =  async (req, res) => {
    try {
        const product = await Product.find().populate("category");
        return res.status(200).json({ message: "products fetched successfully", product});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }
        return res.status(200).json({ message: "product updated successfully", product})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" })
    }
}

exports.deleteProduct =  async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json({ message: "product deleted successcfully" });
    } catch (error) {
        console.log(error);
        return res.statusO(500).json({ message: "Server Error" });
    }
}