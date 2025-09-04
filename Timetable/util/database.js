import sqlite from 'sqlite3';

const db = new sqlite.Database('./data/database.sqlite');

export function dbAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err){
                reject(err);
            }
            else {
                resolve(rows);
            }
        });
    });
}

export function dbGet(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err){
                reject(err);
            }
            else {
                resolve(row);
            }
        });
    });
}

export function dbRun(sql, params) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({ lastID: this.lastID });
            }
        });
    });
}


export async function initDb() {
    await dbRun("DROP TABLE IF EXISTS Monday")
    await dbRun("CREATE TABLE IF NOT EXISTS Monday (id INTEGER PRIMARY KEY AUTOINCREMENT, className STRING, teacher STRING, room STRING, period INTEGER)")

    const monday = [
        {className:"Math", teacher:"RJJ", room:"6.", period:3},
        {className:"P.English", teacher:"CsB", room:"7.", period:4},
        {className:"Literature", teacher:"GyZs", room:"16.", period:5}
    ]

    await dbRun("DROP TABLE IF EXISTS Tuesday")
    await dbRun("CREATE TABLE IF NOT EXISTS Tuesday (id INTEGER PRIMARY KEY AUTOINCREMENT, className STRING, teacher STRING, room STRING, period INTEGER)")
    
    const tuesday = [
        {className:"Civics", teacher:"KG", room:"13.", period:1},
        {className:"PE", teacher:"BHA", room:"T", period:2},
        {className:"W(CMS+WD)", teacher:"ZsM", room:"Szt2", period:3},
        {className:"Literature", teacher:"GyZs", room:"16.", period:4},
        {className:"History", teacher:"KG", room:"16.", period:5},
        {className:"English", teacher:"SzM", room:"6.", period:6},
        {className:"IT", teacher:"KOA", room:"nylab", period:7},
        {className:"IT", teacher:"KOA", room:"Szt1", period:8},
        {className:"Softwaretest", teacher:"NyT", room:"14", period:9},
        {className:"Softwaretest", teacher:"NyT", room:"14", period:10}
    ]

    await dbRun("DROP TABLE IF EXISTS Wednesday")
    await dbRun("CREATE TABLE IF NOT EXISTS Wednesday (id INTEGER PRIMARY KEY AUTOINCREMENT, className STRING, teacher STRING, room STRING, period INTEGER)")

    const wednesday = [
        {className:"IT", teacher:"VA", room:"tani", period:0},
        {className:"IT", teacher:"VA", room:"tani", period:1},
        {className:"IT", teacher:"VA", room:"tani", period:2},
        {className:"History", teacher:"KG", room:"14", period:3},
        {className:"className", teacher:"SzM", room:"14.", period:4},
        {className:"Literature", teacher:"GyZs", room:"35.", period:5},
        {className:"Math", teacher:"RJJ", room:"7.", period:6},
        {className:"Math", teacher:"RJJ", room:"7.", period:7}
    ]

    await dbRun("DROP TABLE IF EXISTS Thursday")
    await dbRun("CREATE TABLE IF NOT EXISTS Thursday (id INTEGER PRIMARY KEY AUTOINCREMENT, className STRING, teacher STRING, room STRING, period INTEGER)")

    const thursday = [
        {className:"IT", teacher:"VA", room:"tani", period:1},
        {className:"IT", teacher:"VA", room:"tani", period:2},
        {className:"PE", teacher:"BHA", room:"T", period:3},
        {className:"PE", teacher:"BHA", room:"T", period:4},
        {className:"History", teacher:"KG", room:"15.", period:5},
        {className:"Math", teacher:"RJJ", room:"14.", period:6},
        {className:"P.English", teacher:"CsB", room:"8.", period:7}
    ]

    await dbRun("DROP TABLE IF EXISTS Friday")
    await dbRun("CREATE TABLE IF NOT EXISTS Friday (id INTEGER PRIMARY KEY AUTOINCREMENT, className STRING, teacher STRING, room STRING, period INTEGER)")

    const friday = [
        {className:"Grammar", teacher:"GyZs", room:"15.", period:1},
        {className:"English", teacher:"SzM", room:"8.", period:2},
        {className:"English", teacher:"SzM", room:"8.", period:3},
        {className:"P.English", teacher:"CsB", room:"8.", period:4},
        {className:"IT", teacher:"BR", room:"nylab", period:5},
        {className:"History", teacher:"KG", room:"16.", period:6}
    ]

    for (const day of [{name:"Monday", classNamees:monday}, {name:"Tuesday", classNamees:tuesday}, {name:"Wednesday", classNamees:wednesday}, {name:"Thursday", classNamees:thursday}, {name:"Friday", classNamees:friday}]) {
        for (const lesson of day.classNamees) {
            await dbRun(`INSERT INTO ${day.name} (className, teacher, room, period) VALUES (?, ?, ?, ?)`, [lesson.className, lesson.teacher, lesson.room, lesson.period])
        }
    }
}