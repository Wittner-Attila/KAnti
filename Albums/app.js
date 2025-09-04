import express from 'express';
import cors from "cors";
import { dbAll, dbGet, dbRun, createNewTable, putSongIntoTable } from './util/database.js';

const port = 5000;
const app = express();
app.use(express.json());
app.use(cors());

app.use('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});



app.get('/albums', (req, res) => {
    dbAll(`SELECT * FROM sqlite_master WHERE type='table'`)
        .then((rows) => {
            const albums = rows.map(row => row.name);
            res.json(albums.filter(album => album !== 'sqlite_sequence'));
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Error retrieving albums' });
        });
})







app.post('/newAlbum', (req, res) => {
    const albumName = req.body.albumName;
    createNewTable(albumName)
        .then(() => {
            res.status(201).json({ message: 'Album created successfully' });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Error creating album' });
        });
})

app.get('/:album', (req, res) => {
    const album = req.params.album;
    dbAll(`SELECT * FROM ${album}`)
    .then((rows) => {
        res.json(rows);
    })
    .catch(err => {
        console.error(err);
        res.status(404).json({ message: 'Album not found' });
    });
})

app.delete('/:album', (req, res) => {
    const album = req.params.album;
    dbRun(`DROP TABLE ${album}`)
        .then(() => {
            res.status(200).json({ message: 'Album deleted successfully' });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Error deleting album' });
        });
})

app.put('/:album', (req, res) => {
    const album = req.params.album;
    const { newAlbumName } = req.body;

    if (!newAlbumName) {
        return res.status(400).json({ message: 'New album name is required' });
    }

    dbRun(`ALTER TABLE ${album} RENAME TO ${newAlbumName}`)
        .then(() => {
            res.status(200).json({ message: 'Album renamed successfully' });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Error renaming album' });
        });
})









app.post('/:album/newSong', (req, res) => {
    const album = req.params.album;
    const { songName, songLength } = req.body;

    if (!songName || !songLength) {
        return res.status(400).json({ message: 'Song name and length are required' });
    }

    putSongIntoTable({ tableName: album, songName, songLength })
        .then(() => {
            res.status(201).json({ message: 'Song added successfully' });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Error adding song' });
        });
    });

app.delete('/:album/:id', (req, res) => {
    const album = req.params.album;
    const id = req.params.id;

    dbRun(`DELETE FROM ${album} WHERE id = ?`, [id])
        .then(() => {
            res.status(200).json({ message: 'Song deleted successfully' });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Error deleting song' });
        });
})

app.put('/:album/:id', (req, res) => {
    const album = req.params.album;
    const id = req.params.id;
    const { newSongName, newSongLength } = req.body;

    console.log(newSongName, newSongLength);

    if (!newSongName || !newSongLength) {
        return res.status(400).json({ message: 'New song name and length are required' });
    }

    dbRun(`UPDATE ${album} SET songName = ?, songLength = ? WHERE id = ?`, [newSongName, newSongLength, id])
        .then(() => {
            res.status(200).json({ message: 'Song updated successfully' });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Error updating song' });
        });
})






// HAS TO BE LAST
app.use((err, req, res, next) => {
    if (err){
        res.status(500).json({message: `Error: ${err.message}`})
    }
})

async function startServer(){
    app.listen(port, () => {
        console.log(`server running on port ${port}`)
    })
}

startServer();