import express from 'express';

const PORT = 5000;
const app = express();

const books = [
    { id: 1, title: 'Harry Potter', author: 'J.K. Rowling' },
    { id: 2, title: 'IT', author: 'Stephen King' },
    { id: 3, title: 'book', author: 'bob' },
    { id: 4, title: 'book the second', author: 'bob' },
];

app.use(express.json());

app.get('/books', (req, res) => {
    res.status(200).json(books);
});
app.get('/books/:id', (req, res) => getById(req.params.id, res));
app.post('/books', (req, res) => post(req.body, res));
app.put('/books/:id', (req, res) => put(req.body, req.params.id, res));
app.delete('/books/:id', (req, res) => remove(req.params.id, res));

const getById = (id, res) => {
    for (const book of books) {
        if (book.id == id) return res.status(200).json(book);
    }
    return res.status(404).json({ message: 'Not Found' });
};

const post = (body, res) => {
    if (!(body.author || body.title || body.id))
        return res.status(401).json({ message: 'Bad Request' });
    let exists = false;
    for (const book of books) {
        if (book.id == body.id) exists = true;
    }
    if (exists) return res.status(401).json({ message: 'Already exists' });
    books.push({ id: body.id, title: body.title, author: body.author });
    return res.status(201).json({ message: 'book added at id:' + body.id });
};

const put = (body, id, res) => {
    if (!(body.author || body.title || id)) {
        return res.status(401).json({ message: 'Bad Request' });
    }

    const index = books.findIndex((book) => book.id == id);
    if (index === -1) {
        return res.status(404).json({ message: 'Not found' });
    }

    books[index] = {
        id: parseInt(id),
        title: body.title,
        author: body.author,
    };

    return res.status(200).json({ message: 'Book updated', book: books[index] });
};

const remove = (id, res) => {
    let exists = false;
    let deletableBook;
    books.forEach((book) => {
        if (book.id == id) {
            exists = true;
            deletableBook = book;
        }
    });
    if (!exists) return res.status(404).json({ message: 'Not found' });
    books.pop(deletableBook);
    return res.status(204).json({ message: 'Deleted succesfully' });
};

app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`));
