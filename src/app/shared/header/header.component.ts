import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/models/users.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  public user!: User;

  constructor(  private usersService: UsersService,
                private fb: FormBuilder){
                  // CARGAR USER
                  this.user = usersService.user;
                                    
                }

  ngOnInit(): void {
    // CARGAR USUARIOS
    this.loadUsers();

  }

  /** ==============================================================================
   * CARGAR USUARIOS
  ================================================================================*/
  public users: User[] = [];
  loadUsers(){

    this.usersService.loadUsers()
        .subscribe( ({users}) => {

          users = users.filter(usuario => usuario.status === true );
          this.users = users;          

        }, (err) => {
          console.log(err);          
        })

  }

  /** ==============================================================================
   * LOGOUT
  ================================================================================*/

  logout(){
    this.usersService.logout();
  }

}
