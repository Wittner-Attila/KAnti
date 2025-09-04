const express = require('express');
const app = express();

app.use(express.json())

const movies = [
    {
        title : "Fury",
        director : "",
        releaseYear : 2012,
        oscar : false
    },
    {
        title : "John Wick",
        director : "",
        releaseYear : 2010,
        oscar : false
    },
    {
        title : "Intouchables",
        director : "",
        releaseYear : 2010,
        oscar : true
    }
]

const port = 3000;

// GET
app.get("/movies", (req, res) => {
    res.json(movies);
});

// GET (by ID)
app.get("/movies/:id", (req, res) => {
    const id = req.params.id;
    if (id < 0 || id > movies.length){
        res.json({message : "no item found"})
        return;
    }
    res.json(movies[id]);
});

// POST
app.post("/movies", (req, res) => {
    const {title, director, releaseYear, oscar} = req.body;
    console.log(req.body)
    if (!title || !director || !releaseYear || !oscar){
        res.json({message : "fill all fields"})
        return;
    }
    movies.push({title, director, releaseYear, oscar});
    res.json({message : "movie added"})
})

// PUT
app.put("/movies/:id", (req, res) => {
    const id = req.params.id;
    const {title, director, releaseYear, oscar} = req.body;
    console.log(req.body)
    if (id < 0 || id > movies.length){
        res.json({message : "no item found"})
        return;
    }
    if (!title || !director || !releaseYear || !oscar){
        res.json({message : "fill all fields"})
        return;
    }
    movies[id] = {title, director, releaseYear, oscar}
    res.json({message : "movie added"})
})

// DELETE
app.delete("/movies/:id", (req, res) => {
    const id = req.params.id;
    movies.splice(id)
    res.json({message: "movie deleted"})
})

app.listen(port, () => {console.log(`server running on port ${port}`)})