const express = require('express');

const port = 3001;

const app = express();

app.get('/index', (req, res, next) => {res.sendFile("./views/index.html", {root : __dirname})})

app.listen(port, () => {console.log(`server is running on port ${port}`)})