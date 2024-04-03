import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators,  ValidatorFn, AbstractControl} from '@angular/forms';
import {BookService} from "../../services/book.service";

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent implements OnInit{
  @Input() data: any;

  bookFormModel!: FormGroup;
  currentYear:Date = new Date();

  constructor(private fb:FormBuilder,
              private bookService:BookService) {}

  ngOnInit(): void {
    this.bookFormModel = this.fb.group({
      title: ['', Validators.required],
      author: [''],
      description: ['', Validators.required],
      publicationYear: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      ISBN: ['', [Validators.required, this.isbnValidator()]],
      genre: ['', Validators.required],
      language: ['']
    });
  }

  isbnValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (!value || value.length !== 13 || isNaN(Number(value))) {
        return { 'invalidIsbn': true };
      }
      return null;
    };
  }

  editBook(){

  }

}
