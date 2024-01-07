import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from '../environments';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  URL: string = Environments.apiUrl + "/users";


  getUsers(): Observable<ApiResponse>{
    return this.http.get<ApiResponse>(this.URL)
  }

}
