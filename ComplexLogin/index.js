import { setupDB, getUsers, getUser, postUser, changeUser, deleteUser } from './util/database.js';
import express from 'express';
import cors from 'cors';

const port = 5000;
const app = express();

app.use(express.json());
app.use(cors());

//
//
//
//
//
//
//
//

app.get('/users', (req, res) => {
    const users = getUsers();
    res.json(users);
});
app.get('/users/:id', (req, res) => {
    const user = getUser(req.params.id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});
app.post('/users', (req, res) => {
    const { username, password, email } = req.body;
    const result = postUser(username, password, email);
    res.status(201).json({ id: result.lastInsertRowid });
});
app.put('/users/:id', (req, res) => {
    const { username, password, email } = req.body;
    changeUser(req.params.id, username, password, email);
    res.sendStatus(204);
});
app.delete('/users/:id', (req, res) => {
    deleteUser(req.params.id);
    res.sendStatus(204);
});

//
//
//
//
//
//
//
//

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    setupDB();
});
