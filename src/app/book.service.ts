import { Injectable } from "@angular/core";
import { SearchCriteria, BooksResponse, BookResponse } from './models';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable()
export class BookService {
  constructor(private http: HttpClient) { }

  getBooks(searchCriteria: SearchCriteria): Promise<BooksResponse> {
    //TODO - for Task 3 and Task 4
    // Check if offset is undefined. If so, set it to zero
    // since toString() doesn't work on undefined
    if (searchCriteria.offset === undefined) {
      searchCriteria.offset = 0;
    }
    // Get the parameters from searchCriteria
    const limitTemp = searchCriteria.limit
    const offsetTemp = searchCriteria.offset
    // Set query parameters
    const qs = new HttpParams()
    .set('terms', searchCriteria.terms)
    .set('limit', limitTemp.toString() || '10')
    .set('offset', offsetTemp.toString() || '0')
    // Set headers
    const headers = new HttpHeaders()
    .set('Accept', 'application/json');
    return (
      // Get search results from backend
      this.http.get<BooksResponse>('/api/search', { headers: headers, params: qs }).toPromise()
    );
  }

  getBook(bookId: string): Promise<BookResponse> {
    //TODO - for Task 5
    // Set headers
    const headers = new HttpHeaders()
    .set('Accept', 'application/json');
    return (
      // Get book detail from backend
      this.http.get<BookResponse>(`/api/book/${bookId}`, { headers: headers }).toPromise()
    );
  }
}
