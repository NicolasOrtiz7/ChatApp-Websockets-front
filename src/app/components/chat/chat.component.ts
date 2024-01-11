import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  myUserId: number;

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
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.myUserId = this.currentSenderUser(); // Obtiene el id de mi usuario
    this.initMessageEntity(); // Inicia el objeto Message
    this.messageService.joinChat(this.currentSenderUser()); // Suscribirse a mi propio canal para escuchar mensajes
    this.getChatOnInit(); // Obtiene los mensajes de la url al cargar la página
    this.getUsers(); // Obtiene los usuarios con los que se puede chatear
    this.messageListener(); // Está a la escucha de mensajes para mostrarlos en el chat
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


  // Escucha los nuevos mensajes recibidos a través del servicio de mensajes.
  // Cuando se recibe un nuevo mensaje, se agrega al array de mensajes existente
  messageListener() {
    // Suscribe la función al observable del servicio de mensajes
    this.messageService.getMessageSubject().subscribe((newMessages: Message[]) => {
      // Obtiene el último mensaje recibido
      const lastMessage = newMessages[newMessages.length - 1];

      // Verifica si hay un último mensaje
      if (lastMessage) {
        // Crea una copia del array actual de mensajes
        const currentMessages = [...this.messagesList];

        // Agrega el último mensaje a la lista de mensajes existente
        currentMessages.push(lastMessage);

        // Actualiza la lista de mensajes con el nuevo mensaje incluido
        this.messagesList = currentMessages;
      }
    });
  }


  getChat(userId: number) {
    // Evita que se cargue nuevamente el chat que ya está cargado
    if (userId == this.route.snapshot.params['id']) return

    // Borra los mensajes precargados del array
    this.messagesList = [];

    // Navega a la url con el id del otro usuario
    this.router.navigate(['/chat', userId]).then(() => {
      // Obtiene los mensajes de la base de datos y los guarda en el array messagesList
      this.chatService.getChatByUserIds(this.currentSenderUser(), this.currentReceiverUser()).subscribe(
        data => {this.messagesList = data.messages; console.log(data)},
        err => console.log(err))
    });

  }

  // Carga los mensajes al iniciar la página
  getChatOnInit() {
    // Evita hacer una solicitud si no existe parámetro en url
    if (null == this.route.snapshot.params['id'] || undefined == this.route.snapshot.params['id']) return

    this.chatService.getChatByUserIds(this.currentSenderUser(), this.currentReceiverUser()).subscribe(
      data => {
        this.messagesList = data.messages;
      },
      err => console.log(err))
  }


  // Obtiene el id del remitente desde su token en localStorage
  currentSenderUser(): number {
    const userId = localStorage.getItem('user');
    const userIdInt = userId ? parseInt(userId) : 0;
    return Number.isNaN(userIdInt) ? 0 : userIdInt;
  }

  // Obtiene el id del receptor (del chat abierto)
  currentReceiverUser() {
    return this.route.snapshot.params['id'];
  }


  // ---------------- Usuarios ----------------

  getUsers() {
    this.userService.getUsers().subscribe(
      data => {
        // Guarda todos los usuarios excepto el que tiene mi propio id
        this.usersList = data.filter((u: { id: number; })  => u.id != this.myUserId);
      },
      err => console.log(err)
    )
  }

  selectUser() {
    this.router.navigate(['/login'])
  }

  logout() {
    localStorage.removeItem('user');
    alert("Sesión cerrada, selecciona un usuario para empezar a chatear");
    this.selectUser();
  }

// ---------------- DOM ----------------

// Generar función para bajar el scroll del chat automáticamente

}
