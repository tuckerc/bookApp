'use strict';

//////////////////////////////////////////////////
// Dependencies
//////////////////////////////////////////////////
const pg = require('pg');

//////////////////////////////////////////////////
// Database Setup
//////////////////////////////////////////////////
const client = new pg.Client(process.env.DB_URL);
client.connect();
client.on('error', err => console.error(err));

//////////////////////////////////////////////////
// function to add a new book to books table
//////////////////////////////////////////////////
function addBook(book) {
  const sql = 'insert into books (title, etag, description, image_link, searchfield) values (($1), ($2), ($3), ($4), ($5))';
  const safeVals = [book.title, book.etag, book.description, book.image_link, book.searchField];
  return client.query(sql, safeVals);
}

//////////////////////////////////////////////////
// function to retrieve all the books
// with key matching parameter
//////////////////////////////////////////////////
function getBook(searchString) {
  const sql = 'select * from books where searchfield = ($1)';
  const safeVals = [searchString.toUpperCase()];
  return client.query(sql, safeVals);
}

///////////////////////////////////////////////////
// Exports
///////////////////////////////////////////////////
exports.addBook = addBook;
exports.getBook = getBook;
