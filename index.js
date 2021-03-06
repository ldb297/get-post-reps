//package handling
const express = require('express');
const app = express();
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const fs = require('fs');
const { json } = require('express');
const methodOverride = require('method-override');

//middleware
app.use(expressLayouts);
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'))
app.set('view engine', 'ejs');


//routes
app.get('/', (req,res)=>{
    res.send(`Welcome to The Land Before Time`);
})

//post route, doesn't have view
app.post('/dinosaurs', (req,res)=>{
    //pulled in file
    let dinos = fs.readFileSync('./dinosaurs.json');
    //made readable
    dinos = JSON.parse(dinos);
    //created variable
    const dino = dinos[req.params.index];
    //created skeleton for form inputs to store
    const newDino = {
        name: req.body.name,
        type: req.body.type
    }
    //pushed into preexisting array
    dinos.push(newDino);
    //rewrites original file with new data
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinos));
    //get requests us back to home page
    let lastIndex = dinos.length - 1
    res.redirect(`/dinosaurs/${lastIndex}`);
})

//index view
app.get('/dinosaurs', (req,res)=>{
    let dinos = fs.readFileSync('./dinosaurs.json');
    //translates data
    dinos = JSON.parse(dinos);
    console.log(req.query.nameFilter);
    let nameToFilterBy = req.query.nameFilter;
    
    if(nameToFilterBy){
        const newFilteredArray = dinos.filter((dinosaurObj)=>{
            if (dinosaurObj.name.toLowerCase() === nameToFilterBy.toLowerCase()) {
                return true
            }
        })
        dinos = newFilteredArray
    }
    //renders page in views folder
    res.render('dinosaurs/index', {dinos: dinos});
})

//new view
app.get('/dinosaurs/new', (req,res)=>{
    res.render('dinosaurs/new');
})

app.get('/dinosaurs/edit/:idx', (req,res)=>{
    const dinosaurs = fs.readFileSync('./dinosaurs.json');
    const dinosaursArray = JSON.parse(dinosaurs);
    let idx = Number(req.params.idx);
    const ourDino = dinosaursArray[idx]
    res.render('dinosaurs/edit', {dino: ourDino, idx})
})

//show view
app.get('/dinosaurs/:index', (req,res)=>{
    let dinos = fs.readFileSync('./dinosaurs.json');
    dinos = JSON.parse(dinos);
    const dino = dinos[req.params.index];
    res.render('dinosaurs/show', {dino});
})

//removing dinosaurs
app.delete('/dinosaurs/:idx', (req,res)=>{
    const dinosaurs = fs.readFileSync('./dinosaurs.json');
    const dinosaursArray = JSON.parse(dinosaurs);

    let idx = Number(req.params.idx);

    dinosaursArray.splice(idx, 1);
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinosaursArray));
    
    res.redirect('/dinosaurs');
})

app.put('/dinosaurs/:idx', (req,res)=>{
    //updating a dinosaur
    const dinosaurs = fs.readFileSync('./dinosaurs.json')
    const dinosaursArray = JSON.parse(dinosaurs);

    //setting up index
    let idx = Numer(req.params.idx);
    const ourDino = dinosaursArray[idx];

    //update the dino
    ourDino.name = req.body.name;
    ourDino.type = req.body.type;

    //rewrite file with updated info
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(ourDino));

    //redirect back to dinosaurs page
    res.redirect('/dinosaurs');
});

//local server hosting
const PORT = process.env.PORT || 8000
app.listen(PORT, ()=>{
    console.log(`server running @ port:${PORT}`);
})