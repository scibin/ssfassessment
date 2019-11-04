// || Init, setup and load the libraries
const express = require('express');
// const path = require('path');
const cors = require('cors');
// const moment = require('moment');
const request = require('request-promise-native');

// Required local files
// Require createpool function with SQL user/password
const pool = require('./database');
// Require make SQL query function
const mkQuery = require('./dbfnhelper');
// New York Times dev API key
const NYT_API_KEY = require('./config').NYTIMES_API_KEY;
// New York Times API URL
const NYT_API_URL = 'https://api.nytimes.com/svc/books/v3/reviews.json';

// Initialize application port
const PORT = parseInt(process.argv[2] || process.env.APP_PORT) || 3001;

// Query phrases
// Search in title and authors fields. Params: [ %ST%, %ST%, limit offset ]
const query_Phrase_For_Title_And_Authors = 'select * from book2018 where (title like ? or authors like ?) limit ? offset ?';
// Search in title and authors fields, return the total count as total. Params: [ %ST%, %ST% ]
const query_Phrase_For_Search_Count = 'select count(*) as total from book2018 where (title like ? or authors like ?)';
// Search books via bookid. Params: [ 'bookId' ]
const query_Phrase_For_Search_Book = 'select * from book2018 where book_id = ?'

// Query functions
const queryTitleOrAuthors = mkQuery(query_Phrase_For_Title_And_Authors, pool);
const queryTitleOrAuthorsTotalCount = mkQuery(query_Phrase_For_Search_Count, pool);
const queryBook = mkQuery(query_Phrase_For_Search_Book, pool);

// || Configuration and create an instance of the express application
const app = express();
// CORS
app.use(cors());

// User body parser to read body objects
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// || Define requests the app will be handling

// Task 3
// Conduct a search with parameters: terms, limit and offset
app.get('/api/search', (req, res) => {
    // Check if terms is undefined, return error if undefined
    if (!req.query.terms) {
        res.status(400).type('application/json')
        res.json({
            status: 400,
            message: 'No search terms entered! Please enter a valid search term.',
            timestamp: (new Date()).getTime()
        })
    }
    const terms = req.query.terms;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    // Promise all: Two promises, one for searching book data, the other for counting the total
    Promise.all([queryTitleOrAuthors([ `%${terms}%`, `%${terms}%`, limit, offset ]), queryTitleOrAuthorsTotalCount([ `%${terms}%`, `%${terms}%` ])])
    // [Bookdata results, total count]
    // Book data results
    .then(results => {
        const data = results[0].map(v => {
            return({
                book_id: v.book_id,
                title: v.title,
                authors: v.authors.split('|'),
                rating: v.rating
            });
        });
        // Total count of books returned
        const total = results[1][0].total;
        // Fit data obtained from database to output
        const output = {
            data: data,
            terms: terms,
            timestamp: (new Date()).getTime(),
            total: total,
            limit: limit,
            offset: offset
        }
        // Response status 200 and a BooksResponse-like object
        res.status(200).json(output);
    })
    .catch(err => {
        console.log(err);
        res.json({
            status: 500,
            message: 'Internal server error',
            timestamp: (new Date()).getTime()
        })
    })
})

// Task 5
// Get a book's details
app.get('/api/book/:bookid', (req, res) => {
    // Gets the id of the book
    const bookId = req.params.bookid;
    // Query the book from database
    queryBook([ bookId ])
    .then(result => {
        // Convert to object
        const tempResult = result[0];
        const data = {
                book_id: tempResult.book_id,
                title: tempResult.title,
                authors: tempResult.authors.split('|'),
                description: tempResult.description,
                edition: tempResult.edition,
                format: tempResult.format,
                pages: tempResult.pages,
                rating: tempResult.rating,
                rating_count: tempResult.rating_count,
                review_count: tempResult.review_count,
                genres: tempResult.genres.split('|'),
                image_url: tempResult.image_url
            }
        res.status(200).json({ data: data, timestamp: (new Date()).getTime() });
    })
    .catch(err => {
        console.log(err);
        res.json({
            status: 404,
            message: 'Not found!',
            timestamp: (new Date()).getTime()
        })
    })
})

// Task 6
// Use NYT API to get book reviews
// http://localhost:4200/api/book/c170603a/review
app.get('/api/book/:bookid/review', (req, res) => {
    // Gets the id of the book
    const bookId = req.params.bookid;
    // Search for the title of the book
    queryBook([ bookId ])
    .then(result => {
        const bookTitle = result[0].title;
        // Get book's authors if required. Will be in an array
        // const bookAuthors = result[0].authors.split('|');
        return (bookTitle);
    })
    // After getting the title of the book, query it using the NYT API
    .then(bookTitle => {
        const NYToptions = {
            url: NYT_API_URL,
            qs: {
                'api-key': NYT_API_KEY,
                title: bookTitle,
            },
            headers: {
                'Accept': 'application/json'
            },
        };
        return(
            request.get(NYToptions, (error, response, body) => {
                return(body);
            })
        );
    })
    // Return the response back to front end
    .then(API_Result => {
        // Note: Takes the results of the search
        const tempContainer = JSON.parse(API_Result);
        const bookReview = tempContainer.results.map(v => {
            return({
                book_id: bookId,
                title: v.book_title,
                authors: v.book_author,
                byline: v.byline,
                summary: v.summary,
                url: v.url
            })
        })
        const reviewResObj = {
            data: bookReview,
            timestamp: (new Date()).getTime()
        }
        // No processing needed to return empty array for data
        // if book title is not found via NYT API
        res.status(200).json(reviewResObj);
    })
    // Log an errors
    .catch(err => {
        console.log(err);
        res.json({
            status: 500,
            message: 'Internal server error!',
            timestamp: (new Date()).getTime()
        })
    });
})

// !!! Add error.html!
// Catch-all
app.use((req, res, next) => {
    res.redirect('/error.html');
});

// Logs the port that is used
app.listen(PORT, () => {
    console.info(`Webserver at port ${PORT}`);
});
