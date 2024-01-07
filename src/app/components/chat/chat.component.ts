import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiResponse, Message, User } from 'src/app/models/message';
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

  apiResponse: ApiResponse = new ApiResponse();
  usersList: User[] = [];

  messagesList: Message[] = [];


  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private chatService: ChatService,
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.initMessageEntity();
    this.messageService.joinChat(1); // Se conecta al chat
    this.getUsers();
    this.listenerMessage();
  }

  // ---------------- Mensajes ----------------


  test() {
    console.log(this.messagesList);

  }

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

    console.log(JSON.stringify(this.messagesList));
    
  }

  listenerMessage() {
    this.messageService.getMessageSubject().subscribe((messages: any) => {
      this.messagesList = messages.map((item: Message) => ({
        ...item
      }))
    })
  }


  currentSenderUser() { // Obtiene el id del remitente desde su token en localStorage
    return 1;
  }
  currentReceiverUser() { // Obtiene el id del receptor (del chat abierto)
    return this.route.snapshot.params['id'];
  }


  // ---------------- Usuarios ----------------

  getUsers() {
    this.userService.getUsers().subscribe(
      data => {
        this.apiResponse = data;
        this.usersList = this.apiResponse.response;
      },
      err => console.log(err)

    )
  }

}
