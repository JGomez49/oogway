// Al igual que index.controller.js, en este archivo se definen las funciones
// que despues seran llamadas desde notes.routes.js

const notesCrtl = {};
const Note = require('../models/Note');
const User = require('../models/User')
const path = require('path');
const {unlink} = require('fs-extra');
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
let nodemailer = require('nodemailer');


notesCrtl.renderNoteForm = (req,res)=>{
    // res.send('Add a note...');
    console.log('user_id: ' + req.user.id);
    res.render('new-note.ejs');
}

notesCrtl.createNewNote = async(req,res)=>{
    //console.log(req.body);
    //const{title, description}=req.body;
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    console.log('>> result:')
    console.log(result)
    const newNote = new Note({
        title: req.body.title,
        description: req.body.description,
        filename: req.file.filename,
        path: result.url,
        public_id: result.public_id,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
    });
    newNote.user = req.user.id;
    await unlink(req.file.path);
    await newNote.save();
    req.flash('success_msg','Note added successfully');
    console.log('>> newNote:');
    console.log(newNote);
    res.redirect('/notes');
}


notesCrtl.renderNotes = async (req,res)=>{
    let user = {}
    user.id = req.params.guest
    if(user.id != null){
        console.log('>> Not null user id: ')
        console.log(user.id)
        user.name = 'Guest'
    }else{
        user.id = req.session.passport.user
        console.log('>> null user id:')
        console.log(user.id)
        let usuario = await User.findById(user.id);
        console.log('>> obj usuario:')
        console.log(usuario)
        user.name = usuario.name
    }
    const notes = await Note.find().sort({createdAt: 'desc'});
    res.render('all-notes.ejs', {notes, user});
};

notesCrtl.renderEditForm = async(req,res)=>{
    // res.send('Edit note...');
    const note = await Note.findById(req.params.id);
    if(note.user != req.user.id){
        req.flash('error_msg','Not authorized user for the URL');
        return res.redirect('/notes');
    }
    console.log('>>> note to edit: ');
    console.log(note);
    res.render('edit-note', {note});
}

notesCrtl.updateNote = async (req,res)=>{
    // res.send('Update note...');
    // console.log(req.body);
    const {title, description} = req.body;
    await Note.findByIdAndUpdate(req.params.id, {title, description});
    req.flash('success_msg','Note updated successfully');
    res.redirect('/notes');
}

notesCrtl.deleteNote = async (req,res)=>{
    let id = req.params.id
    const note = await Note.findById(id)    
    console.log('>>> note by id (' + id + '): ');
    console.log(note);
    if(note.public_id){
        console.log('>>> From deleteNote, public_id: ');
        console.log(note.public_id);
        await cloudinary.v2.uploader.destroy(note.public_id);
    }
    await Note.findByIdAndDelete(req.params.id); 
    req.flash('success_msg','Note deleted successfully');
    res.redirect('/notes');
}


notesCrtl.renderOrder = async (req,res)=>{
    let id = req.params.id
    let user = await User.findById(id);
    console.log('>>> user: ');
    console.log(user);
    res.render('order.ejs', {user})
}

notesCrtl.sendOrder = async (req,res)=>{
    let id = req.params.id
    let user = await User.findById(id);
    console.log('>>> Order from user:')
    console.log(user)
    res.redirect('/notes');
}






module.exports = notesCrtl;