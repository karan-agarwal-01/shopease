const Category = require("../models/Category")

exports.createCategory = async (req, res) => {
    const { name, description, image } = req.body;
    try {
        const category = await Category.create({name, description, image});
        return res.status(201).json({ message: 'Product Category created successfully', category });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" })
    }
} 

exports.fetchCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).json(categories)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" })        
    }
}

exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if (!category) {
            return res.status(404).json({ message: "Category not found" })
        }
        return res.status(200).json({ message: "Category updated successfully", category })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" })      
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "category not found" });
        }
        return res.status(200).json({ message: "category deleted successcfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" })      
    }
}