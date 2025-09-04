import express from 'express';
import { dbAll, dbGet, dbRun, initDb } from './util/database.js';

const port = 3000;
const app = express();
app.use(express.json())

app.get("/users", async (req, res) => {
    const users = await dbAll("SELECT * FROM Users");
    res.status(200).json(users)
})

app.get("/users/:id", async (req, res) => {
    const id = req.params.id;
    const user = await dbGet("SELECT * FROM Users WHERE id=?", [id])
    if (!user){
        return res.status(404).json({message:"user not found"})
    }
    res.status(200).json(user);
})











// HAS TO BE LAST
app.use((req, res, next, err) => {
    if (err){
        res.status(500).json({message: `Error: ${err.message}`})
    }
})

async function startServer(){
    await initDb();
    app.listen(port, () => {
        console.log(`server running on port ${port}`)
    })
}

startServer();