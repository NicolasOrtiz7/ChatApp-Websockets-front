import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiResponse, Message, User } from 'src/app/models/message';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit{

  message: Message = new Message();
  senderUser: User = new User();
  receiverUser: User = new User();

  apiResponse: ApiResponse = new ApiResponse();
  usersList: User[] = [];


  constructor(private chatService: ChatService, private userService: UserService){
  }

  ngOnInit(): void {
    this.chatService.joinChat(1); // Se conecta al chat
    this.initMessageEntity();
    this.getUsers()
  }

  // ---------------- Mensajes ----------------

  initMessageEntity(){
    this.message.senderUser = this.senderUser;
    this.message.receiverUser = this.receiverUser;
  }

  sendMessage(){
    this.senderUser.id = this.currentSenderUser();
    this.receiverUser.id = this.currentReceiverUser();

    this.chatService.sendMessage(this.currentReceiverUser(), this.message);
    this.message.content = ""
  }

  currentSenderUser(){ // Obtiene el id del remitente desde su token en localStorage
    return 1;
  }
  currentReceiverUser(){ // Obtiene el id del receptor (del chat abierto)
    return 2;
  }
  

  // ---------------- Usuarios ----------------

  getUsers(){
    this.userService.getUsers().subscribe(
      data => {
        this.apiResponse = data;
        this.usersList = this.apiResponse.response;
      },
      err => console.log(err)
      
    )
  }

}
