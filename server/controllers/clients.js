import Product from '../models/Product.js'
import ProductStat from '../models/ProductStat.js'
import User from '../models/User.js'
import Transaction from '../models/Transaction.js'
import getCountryIso3 from "country-iso-2-to-3"

export const getProducts = async(req,res) =>{
    try{
        const products = await Product.find()
        const productsWithStats = await Promise.all(
            products.map(async(product) =>{
                const stat = await ProductStat.find({
                    productId:product._id
                })
                return{
                    ...product._doc,
                    stat
                }
            })
        )
        return res.status(200).json(productsWithStats)
    }
    catch(error){
        return res.status(404).json({message: error.message})
    }
}

export const getCustomers = async(req,res) =>{
    try{
        const customers = await User.find({ role:"user" }).select("-password")
        return res.status(200).json(customers)
    }
    catch(error){
        return res.status(404).json({message: error.message})
    }
}

export const getTransactions = async(req,res) =>{
    try{
        //sort data - server side
        const { page = 1, pageSize = 20, sort = null,search = "" } = req.query

        // format sort
        const generateSort = () =>{
            const sortParsed = JSON.parse(sort)
            const sortFormatted = {
                [sortParsed.field]:sortParsed.sort ="asc" ? 1 : -1
            };

            return sortFormatted
        }
        const sortFormatted = Boolean(sort) ? generateSort() : {}

        const transactions = await Transaction.find({
            $or:[
                { cost: {$regex: new RegExp(search,"i")} },
                { userId: {$regex: new RegExp(search,"i")} }
            ],
        })
        .sort(sortFormatted)
        .skip(page * pageSize)
        .limit(pageSize)

        const total = await Transaction.countDocuments({
            name:{ $regex: search, $options: "i" }
        })
        
        res.status(200).json({
            transactions,
            total
        })
    }
    catch(error){
        return res.status(404).json({message: error.message})
    }
}

export const getGeography = async(req,res) =>{
    try{
        const users = await User.find()
        const mappedLocations = users.reduce((acc,{country}) =>{
            const countryISO3 = getCountryIso3(country)
            if(!acc[countryISO3]){
                acc[countryISO3] = 0
            }
            acc[countryISO3]++        
            return acc
        },{})

        const formattedLocations = Object.entries(mappedLocations).map(
            ([country,count]) => {
                return { id:country, value:count }
            }
        )

        res.status(200).json(formattedLocations)
    }
    catch(error){
        return res.status(404).json({message: error.message})
    }
}

// CREATE PRODUCT
export const createProduct = async (req, res) => {
    try {
        const { name, price, description, rating, category, supply } = req.body;
        
        const newProduct = new Product({
            name,
            price: Number(price),
            description,
            rating: Number(rating) || 0,
            category,
            supply: Number(supply) || 0
        });

        const savedProduct = await newProduct.save();

        // Create a default ProductStat for this new product
        const newProductStat = new ProductStat({
            productId: savedProduct._id,
            yearlySalesTotal: 0,
            yearlyTotalSoldUnits: 0,
            year: 2026,
            monthlyData: [],
            dailyData: []
        });
        await newProductStat.save();

        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, rating, category, supply } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                name,
                price: Number(price),
                description,
                rating: Number(rating),
                category,
                supply: Number(supply)
            },
            { new: true }
        );

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        await Product.findByIdAndDelete(id);
        await ProductStat.findOneAndDelete({ productId: id });

        res.status(200).json({ message: "Product deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
