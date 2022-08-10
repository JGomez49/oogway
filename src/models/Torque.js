
const {Schema, model} = require('mongoose');

const TorqueSchema = new Schema({
    company: {type: String,required: true},
    well: {type: String,required: true},
    user: {type: String,required: true},
    MD: {type: Number,required: true},
    slide: {type: Number},
    rotaton: {type: Number},
    rotatoff: {type: Number},
    tripin: {type: Number},
    tripout: {type: Number},
    type:{type: String,required: true},
    modelpoint:{type: String},
    EDRpoint:{type: String},
},{timestamps: true})

module.exports = model('Torque', TorqueSchema);