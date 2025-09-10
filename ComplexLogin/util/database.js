import Database from 'better-sqlite3';

const db = new Database('./data/database.sql');

export const setupDB = () => {
    db.prepare(
        `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    );`,
    ).run();
    db.prepare(
        `
    INSERT OR IGNORE INTO users (username, password, email)
    VALUES ('admin', 'admin123', 'admin@gmail.com'),
           ('admin2', 'admin321', 'admin2@gmail.com'),
           ('testUser', 'testpsw', 'test@gmail.com');
    `,
    ).run();
};

export const getUsers = () => {
    return db.prepare('SELECT * FROM users').all();
};

export const getUser = (id) => {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
};

export const postUser = (username, password, email) => {
    return db
        .prepare('INSERT INTO users (username, password, email) VALUES (?, ?, ?)')
        .run(username, password, email);
};

export const changeUser = (id, username, password, email) => {
    return db
        .prepare('UPDATE users SET username = ?, password = ?, email = ? WHERE id = ?')
        .run(username, password, email, id);
};

export const deleteUser = (id) => {
    return db.prepare('DELETE FROM users WHERE id = ?').run(id);
};
