import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from '../environments';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  URL: string = Environments.apiUrl + "/users";


  getUsers(): Observable<User[]>{
    return this.http.get<User[]>(this.URL)
  }

  saveUser(){
    // Implementar
  }

}
