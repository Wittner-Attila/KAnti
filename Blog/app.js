import {
    setupDB,
    getUsers,
    getUser,
    postUser,
    changeUser,
    deleteUser,
    getBlogs,
    getBlog,
    postBlog,
    changeBlog,
    deleteBlog,
} from './util/database.js';
import express from 'express';
import cors from 'cors';

const port = 5000;
const app = express();

app.use(express.json());
app.use(cors());

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

app.get('/users/:id/blogs', (req, res) => {
    const user = getUser(req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const blogs = getBlogs().filter((blog) => blog.userId === parseInt(req.params.id));
    if (blogs.length === 0) {
        return res.status(404).json({ message: 'No blogs found for this user' });
    }
    res.json(blogs);
});

//non case-sensitive search for users
app.get('/users/search/:query', (req, res) => {
    const query = req.params.query.toLowerCase();
    let users = getUsers();
    let usersSearch = users.filter(
        (user) =>
            (user.username && user.username.toLowerCase().includes(query)) ||
            (user.email && user.email.toLowerCase().includes(query)),
    );
    if (usersSearch.length === 0) {
        query.split(' ').forEach((word) => {
            if (word.length >= 3) {
                var result = getUsers().filter(
                    (user) =>
                        (user.username && user.username.toLowerCase().includes(word)) ||
                        (user.email && user.email.toLowerCase().includes(word)),
                );
                if (result.length > 0) {
                    usersSearch = usersSearch.concat(result);
                }
            }
        });
    }
    if (usersSearch.length === 0) {
        return res.status(404).json({ message: 'No users found matching your search' });
    }
    res.json(usersSearch);
});

//non case-sensitive search for blogs
app.get('/blogs/search/:query', (req, res) => {
    const query = req.params.query.toLowerCase();
    let blogs = getBlogs();
    let blogsSearch = [];
    blogsSearch = blogs.filter(
        (blog) =>
            (blog.title && blog.title.toLowerCase().includes(query)) ||
            (blog.category && blog.category.toLowerCase().includes(query)) ||
            (blog.content && blog.content.toLowerCase().includes(query)),
    );
    if (blogsSearch.length === 0) {
        query.split(' ').forEach((word) => {
            if (word.length >= 3) {
                var result = getBlogs().filter(
                    (blog) =>
                        (blog.title && blog.title.toLowerCase().includes(word)) ||
                        (blog.category && blog.category.toLowerCase().includes(word)) ||
                        (blog.content && blog.content.toLowerCase().includes(word)),
                );
                if (result.length > 0) {
                    blogsSearch = blogsSearch.concat(result);
                }
            }
        });
    }
    if (blogsSearch.length === 0) {
        return res.status(404).json({ message: 'No blogs found matching your search' });
    }
    res.json(blogsSearch);
});
// date format: YYYY-MM-DD
app.get('/blogs/date/:date', (req, res) => {
    const blogs = getBlogs().filter(
        (blog) => new Date(blog.createdAt).toISOString().split('T')[0] === req.params.date,
    );
    if (blogs.length === 0) {
        return res.status(404).json({ message: 'No blogs found for this date' });
    }
    res.json(blogs);
});

app.get('/blogs', (req, res) => {
    const blogs = getBlogs();
    res.json(blogs);
});
app.get('/blogs/:id', (req, res) => {
    const blog = getBlog(req.params.id);
    if (blog) {
        res.json(blog);
    } else {
        res.status(404).json({ message: 'Blog not found' });
    }
});
app.post('/blogs', (req, res) => {
    const { userId, title, category, content } = req.body;
    const result = postBlog(userId, title, category, content);
    res.status(201).json({ id: result.lastInsertRowid });
});
app.put('/blogs/:id', (req, res) => {
    const { content } = req.body;
    changeBlog(req.params.id, content);
    res.sendStatus(204);
});
app.delete('/blogs/:id', (req, res) => {
    deleteBlog(req.params.id);
    res.sendStatus(204);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    //setupDB();
});
