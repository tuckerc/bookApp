'use strict';

//////////////////////////////////////////////////
// Dependencies
//////////////////////////////////////////////////
const pg = require('pg');
const handlers = require('../handlers.js');

//////////////////////////////////////////////////
// Database Setup
//////////////////////////////////////////////////
const client = new pg.Client(process.env.DB_URL);
client.connect();
client.on('error', err => handlers.errorHandler((err)));

//////////////////////////////////////////////////
// function to add a new book to books table
//////////////////////////////////////////////////
function addBook(book) {
  const sql = 'insert into books (title, author, id, description, image_link) values (($1), ($2), ($3), ($4), ($5)) returning *';
  const safeVals = [book.title, book.author, book.id, book.description, book.image_link];
  return client.query(sql, safeVals);
}

//////////////////////////////////////////////////
// function to retrieve the book matching the
// provided isbn
//////////////////////////////////////////////////
function getBookByID(id) {
  const sql = 'select * from books where id = ($1)';
  const safeVals = [id];
  return client.query(sql, safeVals);
}

//////////////////////////////////////////////////
// function to retrieve all the books in db
//////////////////////////////////////////////////
function getAllBooks() {
  const sql = 'select * from books order by title';
  return client.query(sql);
}

///////////////////////////////////////////////////
// Exports
///////////////////////////////////////////////////
exports.addBook = addBook;
exports.getAllBooks = getAllBooks;
exports.getBookByID = getBookByID;
