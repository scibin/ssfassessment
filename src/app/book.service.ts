import { Injectable } from "@angular/core";
import { SearchCriteria, BooksResponse, BookResponse } from './models';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BookService {
  constructor(private http: HttpClient) { }

  getBooks(searchCriteria: SearchCriteria): Promise<BooksResponse> {
    //TODO - for Task 3 and Task 4
    return (null);
  }

  getBook(bookId: string): Promise<BookResponse> {
    //TODO - for Task 5
    return (null);
  }
}
