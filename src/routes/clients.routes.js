
const {Router} = require('express');
const router = Router();
const {
    renderClientForm, 
    createNewClient, 
    renderClients, 
    renderEditForm,
    updateClient,
    deleteClient,
    renderClientProfile,
    renderClientAddTorque,
    createNewTorque,
    deleteModel,
    deleteEDR,
} = require('../controllers/client.controller');

const {isAuthenticated} = require('../helpers/auth');


//Get New client Form
router.get('/clients/add', isAuthenticated, renderClientForm);

//New client
router.post('/clients/new-client', isAuthenticated, createNewClient);

//Get all clients
router.get('/clients', isAuthenticated, renderClients);

//Edit clients
    //Mostrar el formulario para editar
    router.get('/clients/edit/:id', isAuthenticated, renderEditForm);

    //Actualizar lo que esta en el formulario
    router.put('/clients/edit/:id', isAuthenticated, updateClient);

//Delete client
router.delete('/clients/delete/:id', isAuthenticated, deleteClient);

// Get the client profile
router.get('/client/:id', isAuthenticated, renderClientProfile);



// Get the new torque form
router.get('/clients/addtnd/:id', isAuthenticated, renderClientAddTorque);

// New Torque data
router.post('/clients/newtnd/:id', isAuthenticated, createNewTorque);

// Delete Model data
router.get('/clients/deletemodel/:well', isAuthenticated, deleteModel);

// Delete EDR data
router.get('/clients/deleteedr/:well', isAuthenticated, deleteEDR);


module.exports = router;