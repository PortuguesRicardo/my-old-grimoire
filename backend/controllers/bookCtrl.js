
const Book = require('../models/Book');
// const sharp = require('sharp');  
// const path = require('path');

// CREATE
exports.createBook = async (req, res) => {
    try {
        // If multipart sends JSON in "book", parse it; otherwise use body directly
        const payload = req.body.book ? JSON.parse(req.body.book) : req.body;

        const doc = {
            ...payload,
            // keep  auth assignment if  used
            userId: req.auth?.userId ?? payload.userId,
            // Cloudinary public URL from multer-storage-cloudinary
            imageUrl: req.file ? req.file.path : payload.imageUrl,
            // keep initial average rating logic
            averageRating: Array.isArray(payload.ratings) && payload.ratings.length
                ? payload.ratings[0].grade
                : (payload.averageRating ?? 0),
            // If you later want to delete from Cloudinary, also save:
            // imageId: req.file?.filename,
        };

        const created = await Book.create(doc);
        return res.status(201).json(created);
    } catch (err) {
        console.error('createBook error:', err);
        return res.status(400).json({ message: err.message });
    }
};

// UPDATE
exports.updateBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const payload = req.body.book ? JSON.parse(req.body.book) : req.body;

        const updates = {
            ...payload,
        };

        // If a new image was uploaded, use the Cloudinary URL
        if (req.file) {
            updates.imageUrl = req.file.path;      // Cloudinary public URL
            // updates.imageId = req.file.filename; // optional for later delete
        }

        const updated = await Book.findByIdAndUpdate(bookId, updates, { new: true });
        return res.status(200).json(updated);
    } catch (err) {
        console.error('updateBook error:', err);
        return res.status(400).json({ message: err.message });
    }
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

exports.rateBook = (req, res) => {  // Rating a book 
    const userId = req.auth.userId;
    const bookId = req.params.id;
    const { rating } = req.body;

    if (rating < 0 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 0 and 5." });
    }

    Book.findById(bookId)
        .then(book => {
            if (!book) return res.status(404).json({ message: "Book not found" });

            // Check if user already rated
            const alreadyRated = book.ratings.find(r => r.userId === userId);
            if (alreadyRated) {
                return res.status(400).json({ message: "User has already rated this book" });
            }

            // Add new rating
            book.ratings.push({ userId, grade: rating });

            // Calculate new average
            const total = book.ratings.reduce((sum, r) => sum + r.grade, 0);
            book.averageRating = parseFloat((total / book.ratings.length).toFixed(1)); //wrapping in parseFloat to avoid warnings with Mongo due to String being returned as opposed to Number defined in averageRating

            book.save()
                .then(updatedBook => res.status(200).json(updatedBook))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// Get books sorted by average rating
exports.getBestRatedBooks = (req, res) => {
    Book.find()
        .sort({ averageRating: -1 }) // Sort descending by averageRating
        .limit(3) // Get top 3 rated books
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};