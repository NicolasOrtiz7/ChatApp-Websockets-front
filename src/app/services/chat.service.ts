import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { Message } from '../models/message';
import { Stomp } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private stompClient: any;

  constructor() { 
    this.connectSocket();
  }

  connectSocket(){
    const url = "http://localhost:8080/chat-socket";
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket);
  }

  joinChat(receiver: number){
    this.stompClient.connect({}, ()=>{
      this.stompClient.subscribe(`/topic/${receiver}`, (messages: any)=>{
        const messageContent = JSON.parse(messages.body);
        console.log(messageContent);
      })
    })
  }

  sendMessage(receiverId: number, message: Message){
    this.stompClient.send(`/app/chat/${receiverId}`, {}, JSON.stringify(message))
  }

}
