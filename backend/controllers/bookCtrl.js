exports.createBook = (req, res) => {
    const bookObject = JSON.parse(req.body.book);
    bookObject.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

    const book = new Book({
        ...bookObject,
    });

    book.save()
        .then(() => res.status(201).json({ message: 'Book created!' }))
        .catch(error => res.status(400).json({ error }));
};