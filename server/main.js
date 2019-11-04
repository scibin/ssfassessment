// || Init, setup and load the libraries
const express = require('express');
const path = require('path');
const cors = require('cors');
// const moment = require('moment');

// Required local files
// Require createpool function with SQL user/password
const pool = require('./database');
// Require make SQL query function
const mkQuery = require('./dbfnhelper');
// New York Times dev API key
const NYT_API_KEY = require('./config').NYTIMES_API_KEY;

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

// Initialize static content
// app.use(express.static(path.join(__dirname, '../', 'dist', 'day14workshop')));
// app.use(express.static(path.join(__dirname, 'public')));


// User body parser to read body objects
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json({limit: '50mb'}));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded());

// || Define requests the app will be handling

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

// Get a book's details
app.get('/api/book/:bookid', (req, res) => {
    // Gets the id of the book
    const bookId = req.params.bookid;
    console.log('This is bookId: ', bookId);
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

// !!! Add error.html!
// Catch-all
app.use((req, res, next) => {
    res.redirect('/error.html');
});

// Logs the port that is used
app.listen(PORT, () => {
    console.info(`Webserver at port ${PORT}`);
});




