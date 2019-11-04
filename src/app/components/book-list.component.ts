import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BookService } from '../book.service';
import { SearchCriteria, ErrorResponse, BooksResponse } from '../models';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {

  limit = 10;
  offset = 0;
  terms = '';

  books: BooksResponse = null;

  constructor(private router: Router, private activatedRoute: ActivatedRoute
      , private bookSvc: BookService) { }

  ngOnInit() {
    const state = window.history.state;
    if (!state['terms'])
      return this.router.navigate(['/']);

    this.terms = state.terms;
    this.limit = state.limit || 10;

    const searchCriterial: SearchCriteria = {
      terms: this.terms,
      limit: this.limit
    }
    this.bookSvc.getBooks(searchCriterial)
      .then(result => {
        this.books = result;
      }).catch(error => {
        const errorResponse = error as ErrorResponse;
        alert(`Status: ${errorResponse.status}\nMessage: ${errorResponse.message}`)
      })
  }

  next() {
    //TODO - for Task 4
    // Increase the offset
    this.offset = +this.offset + +this.limit;
    // if offset >= books.total, dont activate it
    if (this.offset < this.books.total) {
      const searchNext: SearchCriteria = {
        terms: this.terms,
        limit: this.limit,
        offset: this.offset
      }
      this.bookSvc.getBooks(searchNext)
      .then(result => {
        this.books = result;
      }).catch(error => {
        const errorResponse = error as ErrorResponse;
        alert(`Status: ${errorResponse.status}\nMessage: ${errorResponse.message}`)
      })
    }
  }

  previous() {
    //TODO - for Task 4
    // Decrease the offset
    this.offset = +this.offset - +this.limit;
    // if offset <= 0, dont activate it
    if (this.offset >= 0) {
      const searchNext: SearchCriteria = {
        terms: this.terms,
        limit: this.limit,
        offset: this.offset
      }
      this.bookSvc.getBooks(searchNext)
      .then(result => {
        this.books = result;
      }).catch(error => {
        const errorResponse = error as ErrorResponse;
        alert(`Status: ${errorResponse.status}\nMessage: ${errorResponse.message}`)
      })
    }
  }

  bookDetails(book_id: string) {
    //TODO
    this.router.navigate(['books', book_id]);
  }

  back() {
    this.router.navigate(['/']);
  }

}
