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
      let tempArr = searchResults.body.items.map(book => {
        return new Book(book);
      });
      console.log(tempArr);
      return tempArr;
    })
    .then(results => {
      console.log(results);
      res.render('pages/searches/show', {results: results});
    });
}


///////////////////////////////////////////////////////
// Exports
///////////////////////////////////////////////////////
exports.newSearch = newSearch;
exports.volumeSearch = volumeSearch;
