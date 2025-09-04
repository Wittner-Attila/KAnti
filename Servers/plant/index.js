const express = require('express');

const port = 3010;

const flowers = [
    {"name" : "nárcisz", "category" : "egyéves"},
    {"name" : "rózsa", "category" : "egyéves"},
    {"name" : "tulipán", "category" : "egyéves"}
]

const trees = [
    {"name" : "tölgy", "category" : "lombhullató"},
    {"name" : "fűz", "category" : "lombhullató"},
    {"name" : "fenyő", "category" : "örökzöld"}
]

const app = express();
app.use(express.json())

app.get('/', (req, res, next) => {res.sendFile("./views/novenyek.html", {root:__dirname})})

app.get('/flowers', (req, res, next) => {
    res.send(flowers)
})

app.get('/trees', (req, res, next) => {
    res.send(trees)
})

app.get('/plants/:param', (req, res, next) => {
    const param = req.params.param
    switch(param){
        case "flowers":
            res.send(flowers);
            break;
        case "trees":
            res.send(trees);
            break;
        default:
            res.status(404).sendFile("./views/404.html", {root : __dirname});
            break;
    }
    /*
    if (param === "flowers"){
        res.send(flowers)
    }
    else if (param === "trees"){
        res.send(trees)
    }*/
})

app.use((req, res, next) => {res.status(404).sendFile("./views/404.html", {root : __dirname})});

app.listen(port, () => {console.log(`Server running on port: ${port}`)})