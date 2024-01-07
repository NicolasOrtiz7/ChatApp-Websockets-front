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

        // Guarda el mensaje en el array para mostrarlo en el chat de la otra persona
        const messageContent = JSON.parse(messages.body);
        const currentMessages = this.messageSubject.getValue(); // Obtener mensajes actuales
        const updatedMessages = [...currentMessages, messageContent]; // Agregar el nuevo mensaje
        this.messageSubject.next(updatedMessages); // Emitir todos los mensajes
      });
    });
  }
  

  getMessageSubject() {
    return this.messageSubject.asObservable();
  }


  sendMessage(chatId: number, message: Message) {
    // Envía el mensaje
    this.stompClient.send(`/app/chat/${chatId}`, {}, JSON.stringify(message));

    // Guarda el mensaje en el array para mostrarlo en mi chat
    const currentMessages = this.messageSubject.getValue();
    const updatedMessages = [...currentMessages, { ...message }]; // Crear una nueva instancia del mensaje
    this.messageSubject.next(updatedMessages); // Emitir el nuevo array de mensajes
  }


}
