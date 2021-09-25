import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAuthorComponent } from './add-author/add-author.component';
import { AddBookComponent } from './add-book/add-book.component';
import { AuthGuard } from './auth.guard';
import { AuthorsComponent } from './authors/authors.component';
import { BooksComponent } from './books/books.component';
import { HomeComponent } from './home/home.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { UpdateAuthorComponent } from './update-author/update-author.component';
import { UpdateBookComponent } from './update-book/update-book.component';

const routes: Routes = [
  {
    path:'login', component:LoginComponent
  },
  {
    path:'', component: LandingPageComponent
  },
  {
    path:'home',canActivate:[AuthGuard],component:HomeComponent,
  },
  {
    path:'signup',component:SignupComponent
  },
  {
    path:'books',canActivate:[AuthGuard],component:BooksComponent
  },
  {
    path:'authors',canActivate:[AuthGuard],component:AuthorsComponent
  },
  {
    path:'add_book', canActivate:[AuthGuard],component:AddBookComponent
  },
  {
    path:'add_author', canActivate:[AuthGuard],component:AddAuthorComponent
  },
  {
    path:'update_book', canActivate:[AuthGuard],component:UpdateBookComponent
  },
  {
    path:'update_author',canActivate:[AuthGuard],component:UpdateAuthorComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
