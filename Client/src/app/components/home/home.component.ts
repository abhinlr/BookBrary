import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  items: any[] = [1,2,3,4,5];
  pagedItems!: any[];

  constructor() {
    // Initialize pagedItems with the first page of items
    this.pageChanged(1);
  }

  pageChanged(pageNumber: number) {
    const itemsPerPage = 10; // Number of items per page
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, this.items.length);
    this.pagedItems = this.items.slice(startIndex, endIndex);
  }

}
