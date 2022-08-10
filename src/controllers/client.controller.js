
const clientsCrtl = {};
const cookieSession = require('cookie-session');
const { session } = require('passport');
const Client = require('../models/Client');
const Torque = require('../models/Torque');
//const Notes = require('../models/Note');


clientsCrtl.renderClientForm = (req,res)=>{
    res.render('clients/new-client');
}

clientsCrtl.createNewClient = async(req,res)=>{
    console.log(req.body);
    const{First_Name, Last_Name}=req.body;
    const newClient = new Client({
        First_Name,
        Last_Name,
        user: req.session.passport.user
    });
    newClient.user = req.user.id;
    await newClient.save();
    req.flash('success_msg','Client added successfully');
    console.log(newClient);
    res.redirect('/clients');
}

clientsCrtl.renderClients = async (req,res)=>{
    let user = ({
        name: req.session.passport.user
    })
    if (user.name == '62ac0c8d2cbdfe3c9c4b4f38'){
        user.auth = 1
        const clients = await Client.find().sort({createdAt: 'desc'});
        res.render('clients/all-clients', {clients, user});
    }else{
        const clients = await Client.find({
            user: user.name
        }).sort({createdAt: 'desc'});
        res.render('clients/all-clients', {clients, user});
    }
};

clientsCrtl.renderEditForm = async(req,res)=>{
    const client = await Client.findById(req.params.id);
    if(client.user != req.user.id){
        req.flash('error_msg','Not authorized user for the URL');
        return res.redirect('/clients');
    }
    console.log(client);
    res.render('clients/edit-client', {client});
}

clientsCrtl.updateClient = async (req,res)=>{
    const {
        First_Name, 
        Last_Name
    } = req.body;
    await Client.findByIdAndUpdate(req.params.id, {
        First_Name, 
        Last_Name
    });
    req.flash('success_msg','Note updated successfully');
    res.redirect('/clients');
}

clientsCrtl.deleteClient = async (req,res)=>{
    await Client.findByIdAndDelete(req.params.id);
    req.flash('success_msg','Client deleted successfully');
    res.redirect('/clients');
}



clientsCrtl.renderClientAddTorque = async (req,res)=>{
    const client = await Client.findById(req.params.id);
    res.render('clients/new-torque', {client});
}

clientsCrtl.createNewTorque = async(req,res)=>{
    const obj = JSON.parse(JSON.stringify(req.body))
    // console.log('>> req.body:');
    // console.log(obj);
    let modelpoint = null
    let EDRpoint = null
    const client = await Client.findById(req.params.id);
    if(obj.type == 'model'){modelpoint = '1'}
    if(obj.type == 'EDR'){EDRpoint = '1'}
    const newTorque = new Torque({
        company: req.body.company,
        well: req.body.well,
        user: req.session.passport.user,
        MD: req.body.MD,
        slide: req.body.slide,
        rotaton: req.body.rotaton,
        rotatoff: req.body.rotatoff,
        tripin: req.body.tripin,
        tripout: req.body.tripout,
        type: req.body.type,
        modelpoint,
        EDRpoint,
    });
    await newTorque.save();
    console.log(">>> newTorque:")
    console.log(newTorque);
    req.flash('success_msg','Client added successfully');
    res.redirect(`/client/${req.params.id}`);
}


clientsCrtl.renderClientProfile = async (req,res)=>{
    const user = req.session.passport.user
    const client = await Client.findById(req.params.id)
    if (user == '62ac0c8d2cbdfe3c9c4b4f38'){client.auth = 1}
    const well = client.Last_Name
    const torques = await Torque.find({well});
    // let data = torques       
    function mySort(obj, key) {
        obj.sort(function(a, b) {
            return (a[key] > b[key]) ? 1 : ((a[key] < b[key]) ? -1 : 0);
        });
        // console.log(data);
    }
    mySort(torques, 'MD');
    res.render('clients/client-profile', {client, torques});
}


clientsCrtl.deleteModel = async (req,res)=>{
    const well = req.params.well;
    await Torque.deleteMany({
        well: well,
        modelpoint: "1",
    });
    req.flash('success_msg','Model deleted successfully');
    res.redirect('/clients');
}

clientsCrtl.deleteEDR = async (req,res)=>{
    const well = req.params.well;
    await Torque.deleteMany({
        well: well,
        EDRpoint: "1",
    });
    req.flash('success_msg','EDR deleted successfully');
    res.redirect('/clients');
}



module.exports = clientsCrtl;