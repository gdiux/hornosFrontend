import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/users.model';
import { LoginForm } from '../interfaces/login-form.interface';

// ENVIRONMENT
import { environment } from '../../environments/environment';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { LoadUsers } from '../interfaces/load-users.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  public user!: User;

  constructor(  private http: HttpClient,
                private router: Router) { }

  /** ================================================================
   *   GET TOKEN
  ==================================================================== */
  get token():string {
    return localStorage.getItem('token') || '';
  }

  /** ================================================================
   *   GET HEADERS
  ==================================================================== */
  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  /** ================================================================
   *   GET ROLES
  ==================================================================== */
  get role(): 'ADMIN' | 'STAFF' {
    return this.user.role;
  }

  /** ================================================================
   *   LOGOUT
  ==================================================================== */
  logout(){
    
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');

  }

  /** ================================================================
   *  LOGIN
  ==================================================================== */
  login( formData: any ){
    
    return this.http.post(`${base_url}/login`, formData)
                      .pipe(
                        tap( (resp: any) => {
                          localStorage.setItem('token', resp.token);
                        }),
                        catchError( error => of(false) )
                      );
  }

  /** ================================================================
   *   VALIDATE TOKEN OR RENEW TOKEN
  ==================================================================== */
  validateToken():Observable<boolean>{
    const token = localStorage.getItem('token') || '';
    
    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap( (resp: any) => {
        
        const { usuario, name, role, password, img, status, fecha, uid } = resp.usuario;

        this.user = new User( usuario, name, role, password, img, status, fecha, uid);        

        localStorage.setItem('token', resp.token);

      }),
      map( resp => true ),
      catchError( error => of(false) )
    );

  }

  /** ================================================================
   *  LOAD USERS
  ==================================================================== */
  loadUsers(){
    return this.http.get<LoadUsers>( `${base_url}/users`, this.headers );
  }

  /** ================================================================
   *  LOAD USER BY ID /user/:id'
  ==================================================================== */
  loadUserId(id: string){
    return this.http.get<{ok: boolean, user: User}>(`${base_url}/users/user/${id}`, this.headers);
  }


  /** ================================================================
   *  CREATE USER
  ==================================================================== */
  createUser( formaData: any ){
    return this.http.post<{user: User, ok: boolean}>(`${base_url}/users`, formaData, this.headers);
  }

  /** ================================================================
   *  UPDATE USER
  ==================================================================== */
  updateUser( formData: any, id: string ){
    return this.http.put< { user: User, ok: boolean } >(`${base_url}/users/${id}`, formData, this.headers);
  }

  /** ================================================================
   *  DELETE USER
  ==================================================================== */
  deleteUser( id: string ){
    return this.http.delete< { user: User, ok: boolean } >(`${base_url}/users/${id}`, this.headers);
  }
}
