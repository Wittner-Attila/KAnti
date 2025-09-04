const express = require('express');

const port = 3000;

const app = express();

app.get('/', (req, res, next) => {res.sendFile("./views/index.html", {root : __dirname})})

app.get('/car', (req, res, next) => {res.sendFile("./views/car.html", {root : __dirname})})

app.use((req, res, next) => {res.status(404).sendFile("./views/404.html", {root : __dirname})});

app.listen(port, () => {console.log(`Server is running on port ${port}`)})