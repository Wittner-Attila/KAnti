const express = require('express');

const port = 3003;

const app = express();

app.get('/', (req, res, next) => {res.send("Hello üdvözöllek a weboldalamon.")})

app.listen(port, () => {console.log(`Server started on port: ${port}`)})