import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators,  ValidatorFn, AbstractControl} from '@angular/forms';
import {BookService} from "../../services/book.service";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {Router} from "@angular/router";
import { ToastrService } from 'ngx-toastr';


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
              private bookService:BookService,
              private activeModal: NgbActiveModal,
              private router: Router,
              private toastr:ToastrService) {}

  ngOnInit(): void {
    this.bookFormModel = this.fb.group({
      title: [this.data.title || '', Validators.required],
      author: [this.data.author || ''],
      description: [this.data.description || '', Validators.required],
      publicationYear: [this.data.publicationYear || '', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      ISBN: [this.data.ISBN || '', [Validators.required, this.isbnValidator()]],
      genre: [this.data.genre || '', Validators.required],
      language: [this.data.language || '']
    });
    console.log(this.data);
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
    const formData = this.bookFormModel.value;
    this.bookService.updateABook(this.data.id,formData)
      .subscribe(response=>{
        if(response.success){
          this.toastr.success('successfully updated the book','Success');
          this.activeModal.close();
          this.router.navigate(['/']);
        }else{
          this.toastr.error('Error updating the book','Error');
        }
      })
  }

  close(){
    this.activeModal.close();
  }

}
