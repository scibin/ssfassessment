import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BookService } from '../book.service';
import { BookResponse } from '../models';

@Component({
  selector: 'app-bookdetail',
  templateUrl: './bookdetail.component.html',
  styleUrls: ['./bookdetail.component.css']
})
export class BookdetailComponent implements OnInit {

  // Initialize object container
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

  constructor(private activatedRoute: ActivatedRoute,
    private booksvc: BookService, private router: Router) { }

  ngOnInit() {
    const bookId = this.activatedRoute.snapshot.params.bookid;
    console.log('Book ID is: ', bookId);
    this.booksvc.getBook(bookId)
    .then(result => {
      console.log('This is bookresponse', result);
      this.bookDetail = result;
    })
  }

  back() {
    this.router.navigate(['/']);
  }
}
