import {Component, OnInit} from '@angular/core';
import {BookService} from "../../services/book.service";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EditBookComponent} from "../edit-book/edit-book.component";
import { ToastrService } from 'ngx-toastr';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  items!: any[];
  pageSize: number = 10;
  currentPage: number = 1;
  searchValue:string = '';
  totalItems:number = 0;
  selectedRows: any[] = [];
  userObject!: any;
  userIsAuthenticated: boolean = false;

  constructor(private bookService:BookService,
              private modalService:NgbModal,
              private toastr: ToastrService,
              private authService:AuthService) {
    this.authService.getUserObject().subscribe(value => this.userObject = value);
  }

  ngOnInit() {
    if(this.userObject){
      this.userIsAuthenticated = true;
    }
    this.getAllBooks();
  }

  pageChanged(event: any): void {
    this.currentPage = event;
  }

  getAllBooks(){
    this.searchValue = '';
    this.bookService.getAllBooks()
      .subscribe((response)=>{
        if(response.success){
          this.items = response.data;
          this.totalItems = this.items.length;
          this.pageChanged(1);
        }else{
          this.toastr.error('Error fetching books!','Error');
        }
      })
  }

  searchBook(title:string){
    this.bookService.searchBook(title)
      .subscribe((response)=>{
        if(response.success){
          if(response.data.length>0){
            this.items = response.data;
            this.totalItems = this.items.length;
          }else{
            this.toastr.warning('No books found!','Message');
          }
        }else{
          this.toastr.error('Error fetching books!','Error');
        }
      })
  }

  toggleSelection(event: any, item: any) {
    if (event.target.checked) {
      this.selectedRows.push(item);
    } else {
      this.selectedRows = this.selectedRows.filter(selectedItem => selectedItem !== item);
    }
  }

  isSelected(item: any): boolean {
    return this.selectedRows.includes(item);
  }

  deleteBook() {
    if(!this.userIsAuthenticated){
      this.toastr.warning('Please login to delete book(s)','Warn');
      return;
    }
    if(this.selectedRows.length<1){
      this.toastr.warning('Select at least one book','Message');
      return;
    }
    const ISBNs = this.selectedRows.map(row => row.ISBN).join(',');
    this.bookService.deleteBook(ISBNs)
      .subscribe(response => {
        this.toastr.success('Book(s) deleted successfully', 'Success');
        this.selectedRows = [];
        this.getAllBooks();
      });
  }

  openPopup() {
    if(!this.userIsAuthenticated){
      this.toastr.warning('Please login to edit book!','Warn');
      return;
    }
    if(this.selectedRows.length<1){
      this.toastr.warning('Select a book to edit!','Message');
      return;
    }
    const modalRef = this.modalService.open(EditBookComponent,{
      size: 'xl',
      centered: true
    });
    modalRef.componentInstance.data = this.selectedRows[0];
    modalRef.result.then(
      () => {
        this.selectedRows = [];
        this.getAllBooks();
      }
    );
  }
}
