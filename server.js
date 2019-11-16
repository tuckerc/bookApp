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
const methodOverride = require('method-override');
const handlers = require('./handlers.js');
const bookSearch = require('./js/bookSearch.js');

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

app.use(methodOverride((req, res) => {
  if(req.body && typeof req.body === 'object' && '_method' in req.body){
    let method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.get('/', bookSearch.showLibrary);
app.get('/search', bookSearch.newSearch);
app.post('/search', bookSearch.volumeSearch);
app.post('/add', bookSearch.addBook);
app.get('/books/:id', bookSearch.showBook);

app.use('*', handlers.notFoundHandler);
app.use(handlers.errorHandler);


app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
