import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {CreateBookComponent} from "./components/create-book/create-book.component";

const routes: Routes = [
  { path: '', component:HomeComponent},
  { path: 'add-book', component:CreateBookComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
