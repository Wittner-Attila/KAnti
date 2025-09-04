import sqlite from 'sqlite3';

const db = new sqlite.Database('./data/database.sqlite');

// Query all rows
export function dbAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// Get a single row
export function dbGet(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

// Run a query (insert, update, delete)
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

// Create a new table for an album
export async function createNewTable(albumName) {
    const sql = `CREATE TABLE IF NOT EXISTS ${albumName} (id INTEGER PRIMARY KEY AUTOINCREMENT, songName STRING, songLength INTEGER)`;
    try {
        await dbRun(sql);
    } catch (error) {
        throw new Error('Error creating table: ' + error.message);
    }
}

// Insert a song into the album table
export async function putSongIntoTable(params) {
    const sql = `INSERT INTO ${params.tableName} (songName, songLength) VALUES (?, ?)`;
    try {
        await dbRun(sql, [params.songName, params.songLength]);
    } catch (error) {
        throw new Error('Error inserting song: ' + error.message);
    }
}
