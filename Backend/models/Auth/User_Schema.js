const mongoose = require("mongoose");

const User_Schema = new mongoose.Schema({
    User_$ID: {
        type: String,
        required: true,
        unique: true
    },
    User_Age: {
        type: Number,
        default: 0
    },
    User_Job: {
        type: String,
        default: ""
    },
    User_Degree: {
        type: String,
        default: ""
    },
    User_Ban_Status: {
        type: Boolean,
        default: false
    },
    User_Bio: {
        type: String,
        default: "",
        max: 80
    },
    User_Birthday: {
        type: String,
        default: ""
    },
    User_Country: {
        type: String,
        default: ""
    },
    User_Last_Online: {
        type: String,
        default: ""
    },
    User_Name: {
        type: String,
        required: true
    },
    User_UserName: {
        type: String,
        required: true,
        min: 3,
        max: 25,
        unique: true,
        trim: true,
        lowercase: true,
    },
    User_Permission: {
        type: String,
        default: "user",
    },
    User_PhoneNumber: {
        type: String,
        default: "",
    },
    User_CountryCode: {
        type: String,
        default: "",
    },
    User_CallingCode: {
        type: String,
        default: "",
    },
    User_PhoneNumber_Hidden: {
        type: Boolean,
        default: false,
    },
    User_Profile_Picture: {
        type: String,
        default: ''
    },
    onBoarded_finished: {
        type: Boolean,
        default: false,
    },
    User_Chats: {
        type: Object,
        default: {
            Primary_Chats: [],
            General_Chats: [],
            Requests_Chats: [],
        }
    },
    User_Skills: {
        type: Array,
        default: [],
    },
    User_Projects: {
        type: Array,
        default: [],
    },
    User_Rating: {
        type: Number,
        default: 0,
    },
    User_Reviews: {
        type: Array,
        default: [],
    },
    User_Freelancer: {
        type: Boolean,
        default: false,
    }
},
    { timestamps: true }
);


module.exports = User_Schema // ✅ Export only the schema