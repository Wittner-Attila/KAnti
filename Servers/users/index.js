const express = require('express');

const port = 3000;

const users = [
    { firstName: "Harry", lastName: "Potter" },
    { firstName: "Ronald", lastName: "Bilius Weasley" },
    { firstName: "Hermione", lastName: "Jean Granger" },
    { firstName: "Draco", lastName: "Malfoy" },
    { firstName: "Cedric", lastName: "Diggory" },
    { firstName: "Luna", lastName: "Lovegood" },
  ]

const app = express();
app.use(express.json());

app.get('/users', (req, res, next) => {
    console.log(users);
    res.send(users);
})

app.get('/users/:id', (req, res, next) => {
    const id = req.params.id;
    console.log(users[id]);
    res.send(users[id]);
})

app.post('/users', (req, res, next) => {
    const {firstName, lastName} = req.body;
    if (!firstName || lastName === undefined){
        console.log({'message':'fill all fields'})
        return res.send({'message':'fill all fields'})
    }
    users.push({firstName, lastName})
    console.log(`new student added ${firstName} ${lastName}`);    
    res.status(201).json({firstName, lastName});
})

app.put('/users/:id', (req, res, next) => {
    const id = req.params.id;
    try{
        if (!(id > 0 && id < users.length)){
            console.log({"message" : "User not found"});
            res.send({"message" : "User not found"})
            return;
        }
        if (req.body.firstName === undefined || req.body.lastName === undefined){
            console.log({'message':'fill all fields'})
            res.send({'message':'fill all fields'})
            return;
        }
        users[id] = req.body;

        console.log(users);
        res.send(users);
    }
    catch (ex){
        console.log(`Error:${ex}`)
    }
})

app.patch('/users/:id', (req, res, next) => {
    const id = req.params.id;
    try{
        if (users[id] === undefined){
            console.log({"message" : "User not found"});
            res.send({"message" : "User not found"})
            return;
        }
        users[id] = req.body;
        console.log(users);
        res.send(users);
    }
    catch (ex){
        console.log(`Error:${ex}`)
    }
})

app.delete('/users/:id', (req, res, next) => {
    const id = req.params.id
    try{
        if (users[id] === undefined){
            console.log({"message" : "User not found"});
            res.send({"message" : "User not found"})
            return;
        }
        users.splice(id);
        console.log({"message" : "Delete successful"});
        res.send({"message" : "Delete successful"});
    }
    catch (ex){
        console.log(`Error:${ex}`)
    }
})

app.use((req,res,next) => {res.status(404).sendFile("./views/404.html", {root:__dirname})});

app.listen(port, () => {console.log(`server running on port: ${port}`)});