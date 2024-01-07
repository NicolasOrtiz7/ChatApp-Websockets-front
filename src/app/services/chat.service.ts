import { Injectable } from '@angular/core';
import { Environments } from '../environments';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
  private URL: string = Environments.apiUrl + "/chats";


  constructor(private http: HttpClient) { }


  getChat(chatId: number){
    return this.http.get(this.URL + '/' + chatId);
  }

}
