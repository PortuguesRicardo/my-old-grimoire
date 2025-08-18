
const Book = require('../models/Book');
const sharp = require('sharp');  // importing sharp
const path = require('path');

exports.createBook = async (req, res) => {
    try {
        const bookObject = JSON.parse(req.body.book);

        // Creates optimized image path
        const imagePath = `images/${req.file.filename}`;
        const optimizedPath = `images/optimized-${req.file.filename}`;

        // Optimizes the image using sharp
        await sharp(req.file.path)
            .resize({ width: 600 })
            .jpeg({ quality: 80 })  // Compresses quality to reduce size
            .toFile(optimizedPath);

        // Deletes the original image
        const fs = require('fs');
        fs.unlinkSync(req.file.path);

        const book = new Book({
            ...bookObject,
            userId: req.auth.userId,
            imageUrl: `${req.protocol}://${req.get('host')}/${optimizedPath}`,
            averageRating: bookObject.ratings?.[0]?.grade || 0,
        });

        await book.save();
        res.status(201).json({ message: 'Book saved successfully!' });
    } catch (error) {
        res.status(400).json({ error });
    }
};


exports.updateBook = async (req, res) => {
    const bookId = req.params.id;

    try {
        let updatedData;

        // Handles image compression if new file is uploaded
        if (req.file) {
            const imagePath = `images/${req.file.filename}`;
            const optimizedFilename = `optimized-${req.file.originalname}`;
            const optimizedPath = path.join(__dirname, '../images', optimizedFilename);

            // Optimizes the uploaded image
            await sharp(req.file.path)
                .resize({ width: 600 })
                .jpeg({ quality: 80 })  // compress quality
                .toFile(optimizedPath);
            // Deletes original uploaded file
            fs.unlinkSync(req.file.path);

            const parsedBook = typeof req.body.book === 'string' ? JSON.parse(req.body.book) : req.body.book;

            updatedData = {
                ...parsedBook,
                imageUrl: `${req.protocol}://${req.get('host')}/images/${optimizedFilename}`
            };

            // No image uploaded
        } else {
            // updatedData = JSON.parse(req.body.book);
            updatedData = req.body;
        }

        const updatedBook = await Book.findByIdAndUpdate(bookId, updatedData, { new: true });

        if (!updatedBook) {
            return res.status(404).json({ error: 'Book not found.' });
        }

        res.status(200).json({ message: 'Book updated!', book: updatedBook });

    } catch (error) {
        console.error('Error updating book:', error);
        res.status(400).json({ error: 'Update failed. Please check the data and try again.' });
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