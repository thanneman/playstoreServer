const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(morgan('common'));


const playstoreApps = require('./playstore-data.js');

app.get('/apps', (req, res) => {
    const { search = "", sort } = req.query;

    if(sort) {
        if(!['app', 'rating'].includes(sort)) {
            return res
                .status(400)
                .send('Sort must be one of App or Rating')
        }
    }

    let results = playstoreApps
        .filter(App =>
            App
                .App
                .toLowerCase()
                .includes(search.toLowerCase()));

    if (sort) {
        results
            .sort((a, b) => {
                return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
            });
    }

    res
        .json(results);
});


app.listen(8000, () => {
    console.log('Server started on PORT 8000');
});