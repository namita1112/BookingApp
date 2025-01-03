import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoute from "./routes/auth.js"
import usersRoute from "./routes/users.js"
import hotelsRoute from "./routes/hotels.js"
import roomsRoute from "./routes/rooms.js"
import cookieParser from "cookie-parser"
import path from "path";
import cors from "cors";

const port = process.env.PORT || 8080;
// const cors = require("cors");
const app = express()
dotenv.config()
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


console.log("Mongo URI:", process.env.MONGO);
// app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use(cors({ origin: "https://bookingapp-client-4se4.onrender.com" }));
app.use(
  cors({
    origin: "https://bookingapp-client-4se4.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // Enable this only if cookies or authentication are required
  })
);

app.options("*", cors());

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO)
        console.log("connected to mongoDB..!");
    }catch(error){
        throw error
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!");
});

mongoose.connection.on("connected", () => {
    console.log("mongoDB connected!");
});

// middleware
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500
    const errorMessage = err.message || "Something went wrong.!"
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    })
})


app.listen(port, () =>{
    connect();
    console.log("Connected to backend");
});

