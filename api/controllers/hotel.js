import Hotel from "../models/Hotel.js";
import nodemailer from "nodemailer";
import twilio from 'twilio';
import multer from "multer";
import dotenv from "dotenv"


// This code is for upload images in static folder
const storage = multer.diskStorage({
destination: (req, file, cb) => {
    const hotelName = req.body.name;
    const dir = `uploads/${hotelName}`
    cb(null, dir); // Ensure the "uploads" folder exists
},
filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
},
});
  const upload = multer({ storage });

// CREATE 
export const createHotel = async (req, res, next) => {
    // console.log("response", req.body);
    // console.log("files", req.files)
    if (!req.body.name) {
        return res.status(400).json({ message: "Hotel name is required" });
    }
    const hotelNameFormatted = req.body.name
    .toLowerCase()                   
    .replace(/\s+/g, '_')             
    .replace(/^(.)/, (match) => match.toUpperCase());

    const photos = Object.values(req.files).map(file => `uploads/${hotelNameFormatted}/${file.filename}`);
    // const photos = req.files.map(file => `uploads/${file.filename}`); // Generate URLs
    const hotelData = { ...req.body, photos };
    const newHotel = new Hotel(hotelData)
    try{
        const savedHotel = await newHotel.save();
        res.status(200).json(savedHotel);
    }catch(err){
        next(err);
    }
}
//  CREATE
// export const createHotel = async (req, res, next) => {
//     const newHotel = new Hotel(req.body);
  
//     try {
//       const savedHotel = await newHotel.save();
//       res.status(200).json(savedHotel);
//     } catch (err) {
//       next(err);
//     }
// };

// UPDATE
export const updatedHotel= async (req, res, next) => {
    try{
        const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, { $set: req.body }, {new: true});
        res.status(200).json(updatedHotel);
    }catch(err){
        next(err);
    }
}
// DELETE
export const deleteHotel= async (req, res, next) => {
    try{
        await Hotel.findByIdAndDelete(req.params.id);
        res.status(200).json("Hotel has been deleted.");
    }catch(err){
        next(err);
    }
}
// GET
export const getHotel= async (req, res, next) => {
    try{
        const hotel = await Hotel.findById(req.params.id);
        res.status(200).json(hotel);
    }catch(err){
        next(err);
        // res.status(500).json(err);
    }
}
//  GET ALL
export const getHotels = async (req, res, next) => {
    const { min, max, limit, ...others } = req.query; // Exclude `limit`, `min`, and `max`
    try {
      const lmt = parseInt(limit) || 0; // Convert `limit` to an integer, default to 0 if not provided
  
      const hotels = await Hotel.find({
        ...others, // Spread other valid query parameters
        cheapestPrice: { 
          $gte: parseInt(min) || 1, // Convert `min` to a number, default to 1
          $lte: parseInt(max) || 20000 // Convert `max` to a number, default to 2000
        }
      })
      .sort({ updatedAt: -1 })
      .limit(lmt); // Apply the limit to the query result
  
      res.status(200).json(hotels);
    } catch (err) {
      next(err); // Handle error with middleware
    }
};  
  

export const countByCity = async (req, res, next) => {
    const cities = req.query.cities.split(",");
    try {
        const list = await Promise.all(cities.map(city => {
            return Hotel.countDocuments({ city: city }); // MongoDB method for counting documents
        }));
        res.status(200).json(list);
    } catch (err) {
        next(err);
    }
};


export const countByType = async (req, res, next) => {
    
    try {
        const hotelCount = await Hotel.countDocuments({ type: "Hotel" })
        const apartmentCount = await Hotel.countDocuments({ type: "apartment" })
        const resortCount = await Hotel.countDocuments({ type: "resort" })
        const villaCount = await Hotel.countDocuments({ type: "villa" })
        const cabinCount = await Hotel.countDocuments({ type: "cabin" })
        
        res.status(200).json([
            { type: "hotel", count: hotelCount},
            { type: "apartment", count: apartmentCount},
            { type: "resort", count: resortCount},
            { type: "villa", count: villaCount},
            { type: "cabin", count: cabinCount}
        ]);
    } catch (err) {
        next(err);
    }
};

export const sendEmail = async (req, res, next) => {
    const {
        userName,
        userEmail,
        userPhone,  
        hotel,
        stayDetails,
        options,
    } = req.body;
    try{
        const transporter = nodemailer.createTransport({
            service: "Gmail", 
            auth: {
              user: "testhotels360@gmail.com", // Replace with your email
              pass: "fhpw paoe lcjs mata", // Replace with your email password or app password
            },
        });

        const mailOptions = {
            from: "testhotels360@gmail.com",
            to: userEmail,
            subject: `Reservation Confirmation - ${hotel.name}`,
            text: `
              Dear ${userName},
      
              Thank you for booking with us! Here are your reservation details:
      
              Hotel Name: ${hotel.name}
              Address: ${hotel.address}
              Price Per Night: ₹${hotel.pricePerNight}
              Grand Total: ${hotel.grandTotal}
      
              Stay Details:
              - Start Date: ${new Date(stayDetails.startDate).toLocaleDateString()}
              - End Date: ${new Date(stayDetails.endDate).toLocaleDateString()}
              - Number of Nights: ${stayDetails.numberOfNights}
             
      
              Guests:
              - Adults: ${options.adults}
              - Children: ${options.children}
              - Rooms: ${options.rooms}
      
              Contact Number: ${userPhone}
      
              We look forward to hosting you!
              Best Regards,
              Your Booking Team
            `,
        };
        await transporter.sendMail(mailOptions);
        res.status(200).send("Email sent successfully!");

        const accountSid = process.env.TWILIO_ACCOUNT_SID; // Replace with your Twilio Account SID
        const authToken = process.env.TWILIO_AUTH_TOKEN; // Replace with your Twilio Auth Token
        const client = twilio(accountSid, authToken);

        const adminPhoneNumber = 'whatsapp:+918779861687';

        const message = `New booking from: ${userName}
        Hotel: ${hotel.name}
        Address: ${hotel.address}
        Price per Night: ₹${hotel.pricePerNight}
        Grand Total: ₹${hotel.grandTotal}
        Stay Dates: ${new Date(stayDetails.startDate).toLocaleDateString()} to ${new Date(stayDetails.endDate).toLocaleDateString()}
        Rooms: ${options.rooms}, Adults: ${options.adults}, Children: ${options.children}
        Contact: ${userPhone}`;
        await client.messages.create({
            from: 'whatsapp:+14155238886', // This is a Twilio sandbox WhatsApp number
            to: adminPhoneNumber,
            body: message,
        });
    
        console.log("WhatsApp message sent to admin!");
      
          // Respond to client that email and message were sent
        res.status(200).send("Email and WhatsApp message sent successfully!");

    }catch(err){
        console.error("Error sending email:", err);
    }
}
