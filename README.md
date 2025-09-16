

# My Old Grimoire

### This repository contains both the frontend (React) and backend (Node.js/Express) code for the project.

This is the final project for the My Old Grimoire application — a full-stack web app that allows users to sign up, log in, add/edit/delete books, and rate others' books. 

The project follows Green Code best practices by compressing uploaded images in the backend.

[View the live app here] https://grimoire-rate.vercel.app

### Demo Login
You can explore the app using the following test account:

**Email:** testassessment2@example.com  
**Password:** 123456!


## Tech Stack

- **Frontend:** React
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Image Processing:** Sharp
  

## Installation Instructions

### Clone the repository
```bash
git clone https://github.com/PortuguesRicardo/my-old-grimoire.git

cd my-old-grimoire
```

### Backend setup
```
cd backend

```
### Project tested on Node v22.14.0
Use:
```
npm install
```

- If using another Node version, use:

```
npm install --legacy-peer-deps
```

to avoid peer dependency errors.

### Optional: Switching Node versions:
```
nvm use 22
```

### Environment variables

Create a .env file in the backend folder:

```

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

```
### Run backend server

```
npm start
```


or for development with auto-reload:

```
npm run dev
```


MongoDB URI and JWT secret should be set up in /backend/.env

The project uses common Node.js packages such as express, mongoose, cors, multer, and jsonwebtoken. 
All required dependencies will be installed automatically when you run npm install.


## Create a .env file in /backend/ with the following:
```
ini

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret_key
```

to run the server:
```
npm start

```

### Frontend setup (in a separate terminal)
```
cd my-old-grimoire

npm install

npm start
```

This will launch the frontend at http://localhost:3000.

 
## Features

- User Sign Up & Login

- Add / Edit / Delete books

- Rate a book (0-5 scale)

- Prevent multiple ratings by same user

- Display average ratings

- Image upload with automatic compression (via Sharp)

- Responsive UI

- Accessibility improvements

## Green Code Practices

- Uploaded book images are automatically compressed and resized (600px width, 80% quality) using sharp.

- The original uncompressed images are deleted after processing to reduce storage usage.

##  Notes
- You must be authenticated to create, update, or delete books.

- Any user can rate other users' books but cannot rate the same book more than once.

- Deleting a book also removes the associated image from the backend folder.

## MongoDB

Data is stored in MongoDB. Use MongoDB Compass to view:

   - users collection

   - books collection

Book documents include an averageRating and a ratings array of user ratings.


