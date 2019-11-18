'use strict';

//////////////////////////////////////////////////
// Dependencies
//////////////////////////////////////////////////
const pg = require('pg');
const handlers = require('../handlers.js');

//////////////////////////////////////////////////
// Database Setup
//////////////////////////////////////////////////
const client = new pg.Client(process.env.DATABASE_URL);
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

//////////////////////////////////////////////////
// function to update the details of a book
//////////////////////////////////////////////////
function updateBook(book) {
  let {title, author, id, description, image_link} = book;
  const sql = 'update books set title=$1, author=$2, description=$3, image_link=$4 where id=$5 returning *';
  const values = [title, author, description, image_link, id];
  return client.query(sql, values);
}

//////////////////////////////////////////////////
// function to delete a book from the library
//////////////////////////////////////////////////
function deleteBook(id) {
  const sql = 'delete from books where id=$1 returning *';
  const values = [id];
  return client.query(sql, values);
}

///////////////////////////////////////////////////
// Exports
///////////////////////////////////////////////////
exports.addBook = addBook;
exports.getAllBooks = getAllBooks;
exports.getBookByID = getBookByID;
exports.updateBook = updateBook;
exports.deleteBook = deleteBook;
