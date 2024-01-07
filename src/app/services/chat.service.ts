import { Injectable } from '@angular/core';
import { Environments } from '../environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
  private URL: string = Environments.apiUrl + "/chats";


  constructor(private http: HttpClient) { }


  getChat(chatId: number){
    return this.http.get(this.URL + '/' + chatId);
  }

  getChatByUserIds(user1: number, user2: number): Observable<ApiResponse>{
    return this.http.get<ApiResponse>(this.URL + '/' + user1 + '/' + user2);
  }

}
