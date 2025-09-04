const express = require('express');

const port = 3000;

const app = express();
app.use(express.json());

app.get('', (req, res, next) => {res.sendFile("./views/index.html", {root:__dirname})})

app.get('/:param', (req, res, next) => {
    const param = req.params.param
    console.log(`parameter: ${param}`);
    res.json({param: param})
})

app.post("/", (req, res, next) => {
    // const name = req.body.name;
    // const age = req.body.age;
    const {name, age} = req.body; 
    console.log({"name" : name, "age" : age})
    res.json({name, age})
})





app.listen(port, () => {console.log(`Server running on port ${port}`)})