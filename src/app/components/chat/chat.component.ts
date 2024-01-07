import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from 'src/app/models/api-response';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user';
import { ChatService } from 'src/app/services/chat.service';
import { MessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  message: Message = new Message();
  senderUser: User = new User();
  receiverUser: User = new User();

  usersList: User[] = [];

  messagesList: Message[] = [];


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private chatService: ChatService,
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.initMessageEntity();
    this.messageService.joinChat(this.currentSenderUser()); // Se conecta al chat
    this.getUsers();
    this.listenerMessage();
  }

  // ---------------- Mensajes ----------------


  initMessageEntity() {
    this.message.senderUser = this.senderUser;
    this.message.receiverUser = this.receiverUser;
  }



  sendMessage() {
    this.senderUser.id = this.currentSenderUser();
    this.receiverUser.id = this.currentReceiverUser();
    this.message.content = this.message.content;

    this.messageService.sendMessage(this.currentReceiverUser(), this.message);
    this.message.content = "";
  }

  listenerMessage() {
    this.messageService.getMessageSubject().subscribe((messages: any) => {
      this.messagesList = messages.map((item: Message) => ({
        ...item
      }))
    })
  }

  getChat(userId: number) {
    // Borra los mensajes del array
    this.messagesList = [];

    this.router.navigate(['/chat', userId]).then(()=>{
      // Obtiene los mensajes de base de datos
      this.chatService.getChatByUserIds(this.currentSenderUser(), this.currentReceiverUser()).subscribe(
        data => this.messagesList = data.response.messages,
        err => console.log(err))
    });

  }


  currentSenderUser(): number { // Obtiene el id del remitente desde su token en localStorage
    const userId = localStorage.getItem('user');
    const userIdInt = userId ? parseInt(userId) : 0;
    return Number.isNaN(userIdInt) ? 0 : userIdInt;
  }
  
  currentReceiverUser() { // Obtiene el id del receptor (del chat abierto)
    return this.route.snapshot.params['id'];
  }


  // ---------------- Usuarios ----------------

  getUsers() {
    this.userService.getUsers().subscribe(
      data => this.usersList = data.response,
      err => console.log(err)
    )
  }

}
