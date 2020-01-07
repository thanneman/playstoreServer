const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(morgan('common'));


const store = require('./playstore-data.js');

app.get('/apps', (req, res) => {
    const { sort, genres = "" } = req.query;

    if(sort) {
        if(!['app', 'rating'].includes(sort)) {
            return res.status(400).send('Sort must be one of rating or app');
        }
    }

    let results = store

    if(sort === 'app') {
        results = results.sort((a, b) => {
            let x = a['App'].toLowerCase();
            let y = b['App'].toLowerCase();
            return a['App'] > b['App'] ? 1 : a['App'] < b['App'] ? -1 : 0;
        });
    }
    else if (sort === 'rating') {
        results = results.sort((a, b) => {
            return a['Rating'] < b['Rating'] ? 1 : a['Rating'] > b['Rating'] ? -1 : 0;
        });
    }

    if(genres) {
        if(!['action', 'arcade', 'card', 'casual', 'puzzle', 'strategy'].includes(genres.toLowerCase())) {
          return res.status(400).send('Genre must be one of Action, Arcade, Card, Casual, Puzzle or Strategy')
        }
        results = results.filter(app => {
          return app.Genres.toLowerCase() === genres.toLowerCase()
        })
    }

    res
        .json(results);
});

module.exports = app;