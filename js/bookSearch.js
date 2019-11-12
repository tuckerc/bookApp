'use strict';

///////////////////////////////////////////////////////
// Dependencies
///////////////////////////////////////////////////////
const superagent = require('superagent');

///////////////////////////////////////////////////////
// Declarations
///////////////////////////////////////////////////////
function Book(book) {
  this.title = book.volumeInfo.title;
  this.etag = book.etag;
  this.description = book.volumeInfo.description;
  this.imageLink = book.volumeInfo.imageLinks.thumbnail;
}

function newSearch(req, res) {
  res.render('pages/index');
}

function volumeSearch(req, res) {
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';
  if (req.body.searchType === 'title') { url += `+intitle:${req.body.searchField}`; }
  if (req.body.searchType === 'author') { url += `+inauthor:${req.body.searchField}`; }

  superagent.get(url)
    .then(searchResults => {
      console.log(searchResults.body.items);
      searchResults.body.items.map(book => {
        new Book(book);
      });
    })
    .then(results => {
      res.render('pages/searches/show', {searchResults: results});
    });
}


///////////////////////////////////////////////////////
// Exports
///////////////////////////////////////////////////////
exports.newSearch = newSearch;
exports.volumeSearch = volumeSearch;