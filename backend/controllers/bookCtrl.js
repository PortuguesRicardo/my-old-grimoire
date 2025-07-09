
const Book = require('../models/Book');

exports.createBook = (req, res) => {  //create book functionality 
    const bookObject = JSON.parse(req.body.book);
    bookObject.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

    const book = new Book({
        ...bookObject,
    });

    book.save()
        .then(() => res.status(201).json({ message: 'Book created!' }))
        .catch(error => res.status(400).json({ error }));
};


exports.updateBook = (req, res) => { //update book functionality
    const bookId = req.params.id;

    const updatedData = req.file
        ? {
            ...JSON.parse(req.body.book),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        }
        : { ...JSON.parse(req.body.book) };

    Book.findByIdAndUpdate(bookId, updatedData, { new: true })
        .then((updatedBook) => {
            if (!updatedBook) {
                return res.status(404).json({ error: 'Book not found.' });
            }
            res.status(200).json({ message: 'Book updated!', book: updatedBook });
        })
        .catch((error) => res.status(400).json({ error }));
};


exports.getAllBooks = (req, res) => {  // All books functionality. req is not needed in this function. 
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};


exports.getOneBook = (req, res) => {  // get one book functionality
    Book.findById(req.params.id)
        .then(book => {
            if (!book) return res.status(404).json({ error: 'Book not found' });
            res.status(200).json(book);
        })
        .catch(error => res.status(400).json({ error }));
};

const fs = require('fs');

exports.deleteBook = (req, res) => {  // delete a book 
    Book.findById(req.params.id)
        .then(book => {
            if (!book) return res.status(404).json({ error: 'Book not found' });

            const filename = book.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Book.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Book deleted!' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

