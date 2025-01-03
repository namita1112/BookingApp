import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique: true
    },
    email : {
        type : String,
        required : true,
        unique: true
    },
    country : {
        type : String,
        require : true
    },
    img : {
        type : String
    },
    city : {
        type : String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        // validate: {
        //     validator: function (v) {
        //         return /^\d{10}$/.test(v); 
        //     },
        //     message: props => `${props.value} is not a valid 10-digit phone number!`
        // }
    },
    password : {
        type : String,
        required : true
    },
    isAdmin : {
        type : Boolean,
        default : false
    },
}, {timestamps: true});

export default mongoose.model("User", UserSchema);