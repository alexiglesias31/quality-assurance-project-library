/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const Book = require('../models/book');

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      const books = await Book.find({})
      res.json(books)
    })
    
    .post(async function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if(title === undefined) {
        res.json('missing required field title')
        return
      }

      const newBook = new Book({
        title: title
      })

      const book = await newBook.save()

      if(!book) {
        res.json('could not save new book')
        return
      }
      
      res.json(book)
    })
    
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'
      const books = await Book.deleteMany({})

      if(!books) {
        res.json('could not delete')
        return
      }

      res.json('complete delete successfully')
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      const bookDB = await Book.findById(bookid).exec()

      if(!bookDB) {
        res.json('no book exists')
        return
      }

      res.json(bookDB)
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;

      if(comment === undefined) {
        res.json('missing required field comment')
        return
      }

      if(bookid === undefined) {
        res.json('missing required field _id')
      }

      //json res format same as .get
      const book = await Book.findByIdAndUpdate(
        bookid,
        {
          $push: {comments: comment},
          $inc: {commentcount: 1}
        },
        {
          new: true
        }
      )

      if(!book) {
        res.json('no book exists')
        return
      }

      res.json(book)
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;

      if(bookid === undefined) {
        res.json('missing required field _id')
      }

      //if successful response will be 'delete successful'
      const book = await Book.findByIdAndDelete(bookid);

      if(!book) {
        res.json('no book exists')
        return
      }

      res.json('delete successfully')
    });
  
};
