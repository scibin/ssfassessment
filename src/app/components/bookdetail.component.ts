import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BookService } from '../book.service';
import { BookResponse, ReviewResponse, Review } from '../models';

@Component({
  selector: 'app-bookdetail',
  templateUrl: './bookdetail.component.html',
  styleUrls: ['./bookdetail.component.css']
})
export class BookdetailComponent implements OnInit {

  // Initialize object containers
  bookDetail: BookResponse = {
    data: {
      book_id: '',
      title: '',
      authors: [],
      description: '',
      edition: '',
      format: '',
      pages: 1,
      rating: 1,
      rating_count: 1,
      review_count: 1,
      genres: [],
      image_url: '',
    },
    timestamp: 1
  };

  bookReviews: ReviewResponse = {
    data: [],
    timestamp: 1
  }

  constructor(private activatedRoute: ActivatedRoute,
    private booksvc: BookService, private router: Router) { }

  ngOnInit() {
    const bookId = this.activatedRoute.snapshot.params.bookid;
    // Use promise all for 2 promises
    // Promise 1: Get book details
    // Promise 2: Get book reviews
    Promise.all([this.booksvc.getBook(bookId), this.booksvc.getBookReviews(bookId)])
    .then(results => {
      this.bookDetail = results[0];
      this.bookReviews = results[1];
    })
  }

  back() {
    this.router.navigate(['/']);
  }
}
