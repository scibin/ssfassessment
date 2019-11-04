export interface BookSummary {
  book_id: string;
  title: string;
  authors: string[];
  rating: number;
}

export interface Book {
  book_id: string;
  title: string;
  authors: string[];
  description: string;
  edition: string;
  format: string;
  pages: number;
  rating: number;
  rating_count: number;
  review_count: number;
  genres: string[];
  image_url: string;
}

export interface Review {
  book_id: string;
  title: string;
  authors: string[];
  // The reviewer as per NYT API
  byline: string;
  // Summary of the review as per NYT API
  summary: string;
  // URL of the review as per NYT API
  url: string;
}

export interface SearchCriteria {
  // Search terms
  terms: string;
  // How many results to return
  limit?: number;
  // Number of results to skip from the top of the query
  offset?: number;
}

export interface BooksResponse {
  data: BookSummary[];
  // The search term that resulted in this qurey
  terms: string;
  // Time stamp of this response (new Date()).getTime()
  timestamp: number;
  // Total number of results from this search
  total: number;
  // Number of results from total limit < total
  limit: number;
  // Number of records skipped from the top
  offset: number;
}

export interface BookResponse {
  data: Book;
  // Time stamp of this response (new Date()).getTime()
  timestamp: number;
}

export interface ReviewResponse {
  // One or more reviews
  data: Review[];
  // Time stamp of this response (new Date()).getTime()
  timestamp: number;
}

export interface ErrorResponse {
  // HTTP status code
  status: number;
  // Error message
  message: string;
  // Time stamp of this response (new Date()).getTime()
  timestamp: number;
}
