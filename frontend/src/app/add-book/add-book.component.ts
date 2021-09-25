import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DetailsService } from '../details.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {

  title:String = "Add Book";

  newBook = new FormGroup({
    title: new FormControl(''),
    author: new FormControl(''),
    genre: new FormControl(''),
    description: new FormControl(''),
    image: new FormControl('')
  });

  // newBook = new BookModel('','','','','');

  constructor(private detailsService:DetailsService, private router:Router) { }

  ngOnInit(): void {

   

  }

  addBook(){
    console.log(this.newBook.value);
    this.detailsService.addBook(this.newBook.value);
    console.log("Added Successfully");
    alert("Pet has been successfully added.");
    this.router.navigate(['/books']);
  }

}

