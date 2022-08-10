
const {Schema, model} = require('mongoose');

const NoteSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    user: {type: String, required: true},
    filename: {type: String},
    path: {type: String},
    originalname: {type: String},
    mimetype: {type: String},
    size: {type: Number},
    public_id: {type: String},
},{timestamps: true})

module.exports = model('Note', NoteSchema);