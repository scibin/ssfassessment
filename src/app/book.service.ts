import { Injectable } from "@angular/core";
import { SearchCriteria, BooksResponse, BookResponse } from './models';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class BookService {
  constructor(private http: HttpClient) { }

  getBooks(searchCriteria: SearchCriteria): Promise<BooksResponse> {
    //TODO - for Task 3 and Task 4
    // Set query parameters
    const qs = new HttpParams()
    .set('terms', searchCriteria.terms)
    .set('limit', searchCriteria.limit.toString() || '10')
    .set('offset', searchCriteria.offset.toString() || '0')
    return (
      // Get results from backend
      this.http.get<BooksResponse>('/api/search', { params: qs }).toPromise()
    );
  }

  getBook(bookId: string): Promise<BookResponse> {
    //TODO - for Task 5
    return (null);
  }
}
