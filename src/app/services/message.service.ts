import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { Message } from '../models/message';
import { Stomp } from '@stomp/stompjs';
import { ChatService } from './chat.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private stompClient: any;

  // Para escuchar y guardar los mensajes enviados del chat
  private messageSubject: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);


  constructor(private chatService: ChatService) {
    this.connectSocket();
  }


  connectSocket() {
    const url = "http://localhost:8080/chat-socket";
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket);
  }


  joinChat(chatId: number) {
    this.stompClient.connect({}, () => {
      this.stompClient.subscribe(`/topic/${chatId}`, (messages: any) => {
        const messageContent = JSON.parse(messages.body);
      })
    })
  }

  getMessageSubject() {
    return this.messageSubject.asObservable();
  }


  sendMessage(chatId: number, message: Message) {
    // Envía el mensaje
    this.stompClient.send(`/app/chat/${chatId}`, {}, JSON.stringify(message));

    // Guarda el mensaje en un array para mostrarlo
    const currentMessages = this.messageSubject.getValue();
    const updatedMessages = [...currentMessages, { ...message }]; // Crear una nueva instancia del mensaje
    this.messageSubject.next(updatedMessages); // Emitir el nuevo array de mensajes
  }


  getCurrentChatId() {
    if (localStorage.getItem("currentChatId")) {
      return localStorage.getItem("currentChatId")
    } else return 0;
  }

}
