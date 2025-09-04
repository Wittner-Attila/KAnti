import express from 'express';
import cors from "cors";
import { dbAll, dbGet, dbRun, initDb } from './util/database.js';

const port = 3000;
const app = express();
app.use(express.json());
app.use(cors());

app.get("/table", async (req, res) => {
    const monday = await dbAll("SELECT * FROM Monday");
    const tuesday = await dbAll("SELECT * FROM Tuesday");
    const wednesday = await dbAll("SELECT * FROM Wednesday");
    const thursday = await dbAll("SELECT * FROM Thursday");
    const friday = await dbAll("SELECT * FROM Friday");
    const timetable = {
        Monday: monday,
        Tuesday: tuesday,
        Wednesday: wednesday,
        Thursday: thursday,
        Friday: friday
    }
    res.status(200).json(timetable)
})

app.get("/:day", async (req, res) => {
    const dayName = req.params.day;
    dayName[0].toUpperCase();
    const day = await dbAll(`SELECT * FROM ${dayName}`)
    if (!day){
        return res.status(404).json({message:"Day not found"})
    }
    res.status(200).json(day);
})

app.get("/:day/:id", async (req, res) => {
    const id = req.params.id;
    const dayName = req.params.day;
    dayName[0].toUpperCase();
    const day = await dbGet(`SELECT * FROM ${dayName} WHERE id=?`, [id])
    if (!day){
        return res.status(404).json({message:"Day not found"})
    }
    res.status(200).json(day);
})

app.post("/:day", async (req, res) => {
    const dayName = req.params.day;
    dayName[0].toUpperCase();
    const {className, teacher, room, period} = req.body;
    if (!className || !teacher || !room || !period) {
        return res.status(400).json({message: `Fill all fields`})
    }
    const result = await dbRun(`INSERT INTO ${dayName} (className, teacher, room, period) VALUES (?, ?, ?, ?);`, [className, teacher, room, period]);
    res.status(201).json({id: result.lastID, className, teacher, room, period});
})

app.put("/:day/:id", async (req, res) => {
    const id = req.params.id;
    const dayName = req.params.day;
    dayName[0].toUpperCase();
    const {className, teacher, room, period} = req.body;
    const day = await dbGet(`SELECT * FROM ${dayName} WHERE id=?`, [id])
    if (!day){
        return res.status(404).json({message:"Day not found"})
    }
    if (!className || !teacher || !room || !period) {
        return res.status(400).json({message: `Fill all fields`})
    }
    await dbRun(`UPDATE ${dayName} SET className=?, teacher=?, room=?, period=? WHERE id=?`, [className, teacher, room, period, id])
    res.status(200).json({id, className, teacher, room, period});
})

app.delete("/:day/:id", async (req, res) => {
    const id = req.params.id;
    const dayName = req.params.day;
    dayName[0].toUpperCase();
    const day = await dbGet(`SELECT * FROM ${dayName} WHERE id=?`, [id])
    if (!day){
        return res.status(404).json({message:"Class not found"})
    }
    dbRun(`DELETE FROM ${dayName} WHERE id=?`, [id])
    res.status(201).json({message: "Deleted class"})
})

// HAS TO BE LAST
app.use((err, req, res, next) => {
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