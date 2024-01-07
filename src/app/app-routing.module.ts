import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';

const routes: Routes = [
  {path: 'chat', component: ChatComponent},
  {path: 'chat/:id', component: ChatComponent},
  {path: '**', pathMatch: 'full', redirectTo: 'chat'}

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
