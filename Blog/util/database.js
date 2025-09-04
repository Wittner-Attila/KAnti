import Database from "better-sqlite3";

const db = new Database("./data/database.sql");

export const setupDB = () => {
    db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    );`).run();
    db.prepare(`
    INSERT OR IGNORE INTO users (username, password, email)
    VALUES ('admin', 'admin123', 'admin@gmail.com'),
           ('admin2', 'admin321', 'admin2@gmail.com'),
           ('testUser', 'testpsw', 'test@gmail.com');
    `).run();

    db.prepare(`
    CREATE TABLE IF NOT EXISTS blogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      title TEXT NOT NULL UNIQUE,
      category TEXT NOT NULL,
      content TEXT NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
    `).run();
    db.prepare(`
    INSERT OR IGNORE INTO blogs (userId, title, category, content)
    VALUES (1, '1First Blog', 'General', 'This is the content of the first blog.'),
           (1, '1Second Blog', 'General', 'This is the content of the second blog.'),
           (1, '1Third Blog', 'General', 'This is the content of the third blog.'),
           (2, '2Second Blog', 'Tech', 'This is the content of the second blog.'),
           (2, '2Third Blog', 'Tech', 'This is the content of the third blog.'),
           (3, '3First Blog', 'Lifestyle', 'This is the content of the first blog.'),
           (3, '3Second Blog', 'Lifestyle', 'This is the content of the second blog.'),
           (3, '3Third Blog', 'Lifestyle', 'This is the content of the third blog.');

    `).run();
}

export const getUsers = () => {
    return db.prepare("SELECT * FROM users").all();
}

export const getUser = (id) => {
    return db.prepare("SELECT * FROM users WHERE id = ?").get(id);
}

export const postUser = (username, password, email) => {
    return db.prepare("INSERT INTO users (username, password, email) VALUES (?, ?, ?)").run(username, password, email);
}

export const changeUser = (id, username, password, email) => {
    return db.prepare("UPDATE users SET username = ?, password = ?, email = ? WHERE id = ?").run(username, password, email, id);
}

export const deleteUser = (id) => {
    return db.prepare("DELETE FROM users WHERE id = ?").run(id);
}



export const getBlogs = () => {
    return db.prepare("SELECT * FROM blogs").all();
}

export const getBlog = (id) => {
    return db.prepare("SELECT * FROM blogs WHERE id = ?").get(id);
}

export const postBlog = (userId, title, category, content) => {
    return db.prepare("INSERT INTO blogs (userId, title, category, content) VALUES (?, ?, ?, ?)").run(userId, title, category, content);
}

export const changeBlog = (id, content) => {
    return db.prepare("UPDATE blogs SET content = ? WHERE id = ?").run(content, id);
}

export const deleteBlog = (id) => {
    return db.prepare("DELETE FROM blogs WHERE id = ?").run(id);
}