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

  constructor(private router: Router) { }

  ngOnInit() { }

  search(form: NgForm) {
    this.router.navigate([ '/books' ], { state: form.value as SearchCriteria });
    form.resetForm();
  }

}
