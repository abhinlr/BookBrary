import {Component, OnInit} from '@angular/core';
import {BookService} from "../../services/book.service";
import {resolve} from "@angular/compiler-cli";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EditBookComponent} from "../edit-book/edit-book.component";

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

  constructor(private bookService:BookService,
              private modalService:NgbModal) {
  }

  ngOnInit() {
    this.getAllBooks();
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
  }

  getAllBooks(){
    this.bookService.getAllBooks()
      .subscribe((response)=>{
        this.items = response;
        this.totalItems = this.items.length;
        this.pageChanged(1);
      })
  }

  searchBook(title:string){
    this.bookService.searchBook(title)
      .subscribe((response)=>{
        this.items = response;
        this.totalItems = this.items.length;
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

  deleteBook(){
    console.log('Selected rows:', this.selectedRows);
    this.bookService.deleteABook(this.selectedRows[0].id)
      .subscribe(response=>{
        console.log(response);
      })
  }

  openPopup() {
    const modalRef = this.modalService.open(EditBookComponent);
    modalRef.componentInstance.data = { data:this.selectedRows };
  }
}
