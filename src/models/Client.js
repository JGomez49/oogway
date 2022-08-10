
const {Schema, model} = require('mongoose');

const ClientSchema = new Schema({
    First_Name: {type: String,required: true},
    Last_Name: {type: String,required: true},
    DOB: {type: Date,required: false},
    SIN: {type: String,required: false},
    Email: {type: String,required: false},
    Address: {type: String,required: false},
    City: {type: String,required: false},
    Province: {type: String,required: false},
    Postal_Code: {type: String,required: false},
    Advisor: {type: String,required: false},
    user: {type: String,required: true}
},{timestamps: true})

module.exports = model('Client', ClientSchema);