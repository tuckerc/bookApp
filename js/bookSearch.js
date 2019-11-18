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
function Book(book) {
  const bookInfo = book.volumeInfo;
  if(bookInfo.title) this.title = bookInfo.title;
  if(book.id) this.id = book.id;
  if(bookInfo.description) this.description = bookInfo.description;
  if(bookInfo.imageLinks) {
    if(bookInfo.imageLinks.medium) this.image_link = bookInfo.imageLinks.medium;
    else if(bookInfo.imageLinks.small) this.image_link = bookInfo.imageLinks.small;
    else if(bookInfo.imageLinks.thumbnail) this.image_link = bookInfo.imageLinks.thumbnail;

  }
  if(bookInfo.authors) {
    let authorStr = '';
    for(let i = 0; i < bookInfo.authors.length; i++) {
      if(i < bookInfo.authors.length - 1) {
        authorStr += `${bookInfo.authors[i]}, `;
      }
      else authorStr += bookInfo.authors[i];
    }
    this.authors = authorStr;
  }
}

function showBook(req, res) {
  db.getBookByID(req.params.id)
    .then(results => {
      res.render('pages/showBook', {results: results.rows});
    })
    .catch(err => handlers.errorHandler(err, req, res));
}

function showLibrary(req, res) {
  db.getAllBooks()
    .then(results => {
      if(results.rowCount) {
        res.render('pages/index', {results: results.rows});
      }
    })
    .catch(err => handlers.errorHandler(err, req, res));
}

function newSearch(req, res) {
  res.render('pages/searches/search');
}

function volumeSearch(req, res) {
  
  //prepare url
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';
  if (req.body.searchType === 'title') { url += `+intitle:${req.body.searchField}`; }
  if (req.body.searchType === 'author') { url += `+inauthor:${req.body.searchField}`; }
        
  // grab new books
  superagent.get(url)
    .then(searchResults => {
      if(searchResults.body.items) {
        let tempArr = searchResults.body.items.map(book => {
          const newBook = new Book(book);
          return newBook;
        });
        return tempArr;
      }
      else return [];
    })
    .then(results => {
      res.render('pages/searches/showResults', {results: results});
    })
    .catch(err => handlers.errorHandler(err, req, res));
}

function addBook(req, res) {
  let url = `https://www.googleapis.com/books/v1/volumes/${req.body.id}`;
  superagent.get(url)
    .then(result => {
      if(result.body) {
        db.addBook(new Book(result.body))
          .then((results) => {
            res.render('pages/showBook', {results: results.rows});
          })
          .catch(err => handlers.errorHandler(err, req, res));
      }
    })
    .catch(err => handlers.errorHandler(err, req, res));
}

function showUpdateBook(req, res) {
  db.getBookByID(req.body.id)
    .then(results => {
      res.render('pages/updateBook', {results: results.rows});
    })
    .catch(err => handlers.errorHandler(err, req, res));
}

function updateBook(req, res) {
  db.updateBook(req.body)
    .then(res.redirect(`/books/${req.body.id}`))
    .catch(err => handlers.errorHandler(err, req, res));
}


///////////////////////////////////////////////////////
// Exports
///////////////////////////////////////////////////////
exports.showLibrary = showLibrary;
exports.volumeSearch = volumeSearch;
exports.newSearch = newSearch;
exports.showBook = showBook;
exports.addBook = addBook;
exports.showUpdateBook = showUpdateBook;
exports.updateBook = updateBook;
