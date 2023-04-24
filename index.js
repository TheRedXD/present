const express = require('express');
const multer = require('multer');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('static'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// multer without destination will save files to memory
const upload = multer();
app.use(upload.single('file'));

app.get('/', (req, res) => {
    try {
        res.render('index');
    } catch (error) {
        res.status(500).send('Something went wrong!');
    }
});

app.post('/present', (req, res) => {
    try {
        // get file posted via form
        let file = req.file;
        if(file.mimetype !== 'application/json') {
            res.status(400).send('File must be a JSON file!');
            return;
        }
        // get file content
        let slides = file.buffer.toString();
        // render slides
        res.render('present', { slides });
    } catch (error) {
        res.status(500).send('Something went wrong!');
    }
});

app.listen(3000, () => {
    console.log('App is listening!');
});