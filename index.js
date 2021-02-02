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
    //pulled in file
    let dinos = fs.readFileSync('./dinosaurs.json')
    //made readable
    dinos = JSON.parse(dinos)
    //created variable
    const dino = dinos[req.params.index]
    //created skeleton for form inputs to store
    const newDino = {
        name: req.body.name,
        type: req.body.type
    }
    //pushed into preexisting array
    dinos.push(newDino)
    //rewrites original file with new data
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinos))
    //get requests us back to home page
    res.redirect('/dinosaurs')
})

//index view
app.get('/dinosaurs', (req,res)=>{
    let dinos = fs.readFileSync('./dinosaurs.json')
    //translates data
    dinos = JSON.parse(dinos)
    console.log(req.query.nameFilter)
    let nameToFilterBy = req.query.nameFilter
    
    if(nameToFilterBy){
        const newFilteredArray = dinos.filter((dinosaurObj)=>{
            if (dinosaurObj.name.toLowerCase() === nameToFilterBy.toLowerCase()) {
                return true
            }
        })
        dinos = newFilteredArray
    }
    
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