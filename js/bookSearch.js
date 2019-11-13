'use strict';

///////////////////////////////////////////////////////
// Dependencies
///////////////////////////////////////////////////////
const superagent = require('superagent');
const db = require('../db/db.js');

///////////////////////////////////////////////////////
// Declarations
///////////////////////////////////////////////////////
function Book(book, searchField) {
  if(book.volumeInfo.title) this.title = book.volumeInfo.title;
  if(book.etag) this.etag = book.etag;
  if(book.volumeInfo.description) this.description = book.volumeInfo.description;
  if(book.volumeInfo.imageLinks) this.image_link = book.volumeInfo.imageLinks.thumbnail;
  this.searchField = searchField.toUpperCase();
}

function newSearch(req, res) {
  res.render('pages/index');
}

function volumeSearch(req, res) {
  
  db.getBook(req.body.searchField)
    .then(results => {
      if(results.rowCount) {
        console.log('rendering from database');
        console.log(results);
        res.render('pages/searches/show', {results: results.rows});
      }
      else {
        //prepare url
        let url = 'https://www.googleapis.com/books/v1/volumes?q=';
        if (req.body.searchType === 'title') { url += `+intitle:${req.body.searchField}`; }
        if (req.body.searchType === 'author') { url += `+inauthor:${req.body.searchField}`; }
        
        // grab new books
        superagent.get(url)
          .then(searchResults => {
            let tempArr = searchResults.body.items.map(book => {
              const newBook = new Book(book, req.body.searchField);
              db.addBook(newBook);
              return newBook;
            });
            return tempArr;
          })
          .then(results => {
            console.log('rendering from api');
            res.render('pages/searches/show', {results: results});
          });
      }
    });
}


///////////////////////////////////////////////////////
// Exports
///////////////////////////////////////////////////////
exports.newSearch = newSearch;
exports.volumeSearch = volumeSearch;
