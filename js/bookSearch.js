'use strict';

///////////////////////////////////////////////////////
// Dependencies
///////////////////////////////////////////////////////
const superagent = require('superagent');
const db = require('../db/db.js');
const handlers = require('../handlers.js');

///////////////////////////////////////////////////////
// Declarations
///////////////////////////////////////////////////////
function Book(book, searchField) {
  if(book.volumeInfo.title) this.title = book.volumeInfo.title;
  if(book.etag) this.etag = book.etag;
  if(book.volumeInfo.description) this.description = book.volumeInfo.description;
  if(book.volumeInfo.imageLinks) this.image_link = book.volumeInfo.imageLinks.thumbnail;
  if(book.volumeInfo.authors) {
    let authorStr = '';
    for(let i = 0; i < book.volumeInfo.authors.length; i++) {
      if(i < book.volumeInfo.authors.length - 1) {
        authorStr += `${book.volumeInfo.authors[i]}, `;
      }
      else authorStr += book.volumeInfo.authors[i];
    }
    this.authors = authorStr;
  }
  this.searchField = searchField.toUpperCase();
}

function newSearch(req, res) {
  res.render('pages/index');
}

function volumeSearch(req, res) {
  
  db.getBook(req.body.searchField)
    .then(results => {
      if(results.rowCount) {
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
            if(searchResults.body.items) {
              let tempArr = searchResults.body.items.map(book => {
                const newBook = new Book(book, req.body.searchField);
                db.addBook(newBook);
                return newBook;
              });
              return tempArr;
            }
            else return [];
          })
          .then(results => {
            res.render('pages/searches/show', {results: results});
          })
          .catch(err => handlers.errorHandler(err, req, res));
      }
    })
    .catch(err => handlers.errorHandler(err, req, res));
}


///////////////////////////////////////////////////////
// Exports
///////////////////////////////////////////////////////
exports.newSearch = newSearch;
exports.volumeSearch = volumeSearch;
