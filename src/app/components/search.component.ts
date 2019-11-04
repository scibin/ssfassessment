import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchCriteria } from '../models';
import { BookService } from '../book.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private router: Router, private booksvc: BookService) { }

  ngOnInit() {
    this.booksvc.getBooks({ terms: 'king', limit: 10, offset: 0 })
    .then(results => {
      console.log(results);
    })
    .catch(err => { error: err})
  }

  search(form: NgForm) {
    this.router.navigate([ '/books' ], { state: form.value as SearchCriteria });
    form.resetForm();
  }

}
