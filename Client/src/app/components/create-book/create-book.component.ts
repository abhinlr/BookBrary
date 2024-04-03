import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators,  ValidatorFn, AbstractControl} from '@angular/forms';
import {BookService} from "../../services/book.service";

@Component({
  selector: 'app-create-book',
  templateUrl: './create-book.component.html',
  styleUrls: ['./create-book.component.css']
})
export class CreateBookComponent implements OnInit {
  bookFormModel!: FormGroup;
  currentYear:Date = new Date();

  constructor(private fb:FormBuilder,
              private bookService:BookService) {}

  ngOnInit(): void {
    this.bookFormModel = this.fb.group({
      title: ['', Validators.required], // Add validators to each form control
      author: [''],
      description: ['', Validators.required],
      publicationYear: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      ISBN: ['', [Validators.required, this.isbnValidator()]],
      genre: ['', Validators.required],
      language: ['']
    });
  }

  addBook() {
    if (this.bookFormModel.valid) {
      const formData = this.bookFormModel.value;
      this.bookService.addNewBook(formData)
        .subscribe((response)=>{
          console.log(response);
        })

    } else {
      this.bookFormModel.markAllAsTouched();
    }
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
}
