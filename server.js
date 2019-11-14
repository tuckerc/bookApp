'use strict';

//////////////////////////////////////////////////
// Configs
//////////////////////////////////////////////////
require('dotenv').config();

//////////////////////////////////////////////////
// Dependencies
//////////////////////////////////////////////////
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bookSearch = require('./js/bookSearch.js');
const handlers = require('./handlers.js');

//////////////////////////////////////////////////
// Declarations
//////////////////////////////////////////////////
const app = express();
app.use(bodyParser());
app.use(cors());
const PORT = process.env.PORT || 3000;

//////////////////////////////////////////////////
// Routing
//////////////////////////////////////////////////
app.use( express.static( './public' ));
app.set('view engine', 'ejs');

app.get('/', bookSearch.showLibrary);
app.get('/search', bookSearch.newSearch);
app.post('/search', bookSearch.volumeSearch);

app.use('*', handlers.notFoundHandler);
app.use(handlers.errorHandler);


app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
