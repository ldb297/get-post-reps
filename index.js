//package handling
const express = require('express');
const app = express();
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const fs = require('fs');
const { json } = require('express');

//middleware
app.use(expressLayouts);
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'ejs');


//routes
app.get('/', (req,res)=>{
    res.send(`Welcome to The Land Before Time`);
})

//post route, doesn't have view
app.post('/dinosaurs', (req,res)=>{
    console.log(req.body)
})

//index view
app.get('/dinosaurs', (req,res)=>{
    let dinos = fs.readFileSync('./dinosaurs.json')
    //translates data
    dinos = JSON.parse(dinos)
    //renders page in views folder
    res.render('dinosaurs/index', {dinos: dinos})
})

//new view
app.get('/dinosaurs/new', (req,res)=>{
    res.render('dinosaurs/new')
})

//show view
app.get('/dinosaurs/:index', (req,res)=>{
    let dinos = fs.readFileSync('./dinosaurs.json')
    dinos = JSON.parse(dinos)
    const dino = dinos[req.params.index]
    res.render('dinosaurs/show', {dino})
})

//local server hosting
const PORT = process.env.PORT || 8000
app.listen(PORT, ()=>{
    console.log(`server running @ port:${PORT}`);
})