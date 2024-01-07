import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{


  usersList: User[] = [];

  constructor(private userService: UserService, private router: Router){}

  ngOnInit(): void {
      this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().subscribe(
      data => this.usersList = data.response,
      err => console.log(err)
    )
  }

  saveUser(){
    // Implementar
  }

  selectUser(userId: number){
    localStorage.setItem('user', userId.toString());
    this.router.navigate(['/chat']);
  }

}
