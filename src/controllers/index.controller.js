// Se hace un objeto para definir las funciones y despues llamarlas
// desde index.router.js

const indexCtrl = {};

indexCtrl.renderIndex = (req,res)=>{
    res.render('index.ejs')
};

indexCtrl.renderAbout = (req,res)=>{
    res.render('about.ejs')
};

module.exports = indexCtrl;