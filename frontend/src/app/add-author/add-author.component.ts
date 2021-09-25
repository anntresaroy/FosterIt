import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DetailsService } from '../details.service';

@Component({
  selector: 'app-add-author',
  templateUrl: './add-author.component.html',
  styleUrls: ['./add-author.component.css']
})
export class AddAuthorComponent implements OnInit {



  title: String = "Add Author";

  newAuthor = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    image: new FormControl('')
  });

  constructor(private detailsService:DetailsService, public router:Router) { }
  ngOnInit(): void {
  }

  addAuthor(){
    console.log(this.newAuthor.value);
    this.detailsService.addAuthor(this.newAuthor.value);
    console.log("Added Successfully");
    alert("Foster Home has been successfully added ");
    this.router.navigate(['/authors']);
  }
}

  // newBook = new BookModel('','','','','');
