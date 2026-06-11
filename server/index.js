import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import connectDB from './database/connect.js';
import clientRoutes from './routers/clients.js';
import salesRoutes from './routers/sales.js';
import managementRoutes from './routers/management.js';
import generalRoutes from './routers/general.js';
import authRoutes from './routers/auth.js';

// Import Models for Seeding
import Product from './models/Product.js';
import ProductStat from './models/ProductStat.js';
import User from './models/User.js';
import Transaction from './models/Transaction.js';
import OverallStat from './models/OverallStat.js';
import AffiliateStat from "./models/AffiliateStat.js";

// Import Seeding Data
import { 
    dataUser, 
    dataProduct, 
    dataProductStat, 
    dataTransaction, 
    dataOverallStat, 
    dataAffiliateStat 
} from './data/index.js';

const app = express();
app.use(morgan('common'));
app.use(helmet());
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

dotenv.config({ path: ".env" });
const PORT = process.env.PORT || 9000;

app.get("/", (req, res) => {
    res.status(200)
    .json({
        status: 200,
        message: "Syed Mehfooz C S - Admin Dashboard API in Node JS and Express 🚀",
        api_documentation: "https://documenter.getpostman.com/view/21884902/2s935soMqx"
    });
});

app.use("/auth", authRoutes);
app.use("/client", clientRoutes);
app.use("/general", generalRoutes);
app.use("/management", managementRoutes);
app.use("/sales", salesRoutes);

// Server startup lifecycle
const startServer = async () => {
    try {
        // Wait for Database connection before starting Express listen
        await connectDB();

        // Automatic Seeding Logic (Runs only on a fresh DB mount)
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            console.log("Database is empty. Initiating automatic data seeding...");
            await Promise.all([
                User.insertMany(dataUser),
                Product.insertMany(dataProduct),
                ProductStat.insertMany(dataProductStat),
                Transaction.insertMany(dataTransaction),
                OverallStat.insertMany(dataOverallStat),
                AffiliateStat.insertMany(dataAffiliateStat)
            ]);
            console.log("Data seeding completed successfully!");
        } else {
            console.log("Database contains existing records. Skipping data seeding.");
        }

        // Start listening
        app.listen(PORT, () => {
            console.log(`Server running successfully on port ${PORT}`);
        });
    } catch (error) {
        console.error("Initialization failed:", error);
        process.exit(1);
    }
};

startServer();
