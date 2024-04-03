import { Injectable } from '@angular/core';
import {apiConfig} from "../api-config";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient) { }

  addNewBook(bookData:any){
      return this.http.post<any>(apiConfig.addBook, bookData);
  }

  getAllBooks(){
    return this.http.get<any>(apiConfig.getAllBooks);
  }

  updateABook(id:string,bookData:any){
    return this.http.put<any>(`${apiConfig.editBook}/${id}`, bookData)
  }

  deleteABook(id:string){
    return this.http.delete<any>(`${apiConfig.deleteBook}/${id}`);
  }

  searchBook(value:string){
    return this.http.post<any>(apiConfig.searchBooks, {value});
  }

}
