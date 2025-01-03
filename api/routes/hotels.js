import express from "express";
import Hotel from "../models/Hotel.js";
import { verifyAdmin } from "../utils/verifyToken.js";
import { countByCity, countByType, createHotel, deleteHotel, getHotel, getHotels, sendEmail, updatedHotel } from "../controllers/hotel.js";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();


// This code is for upload images in static folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const hotelNameFormatted = req.body.name
            .toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/^(.)/, (match) => match.toUpperCase());
        const dir = `uploads/${hotelNameFormatted}`;
        fs.exists(dir, (exists) => {
            if (!exists) {
                fs.mkdirSync(dir, { recursive: true }); 
            }
            cb(null, dir); 
        });
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });

// CREATE hotel
router.post("/", verifyAdmin, upload.array("photos"), createHotel);


//CREATE
// router.post("/", verifyAdmin, createHotel);
// UPDATE hotel
router.put("/:id", verifyAdmin, updatedHotel);
// DELETE hotel
router.delete("/:id", verifyAdmin, deleteHotel);
// GET hotel by ID
router.get("/find/:id", getHotel);
// GET all hotels
router.get("/", getHotels);

// Other routes
router.get('/countByCity', countByCity);
router.get("/countByType", countByType);
router.post("/sendEmail", sendEmail);

export default router;
