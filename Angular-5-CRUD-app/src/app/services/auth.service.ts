import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {
  authToken: any;
  user: any;

  constructor(private http : Http) { }

  registerUser(user){
    let headers = new Headers();
    headers.append('Content-Type' , 'application/json');
    //When using map operator we can now subscribe to the observable that
    //will register the user to the backend
    return this.http.post('http://localhost:5000/users/register' , user , {headers: headers})
      .map(res => res.json());
  }

  authenticateUser(user){
    let headers = new Headers();
    headers.append('Content-Type' , 'application/json');
    return this.http.post('http://localhost:5000/users/authenticate' , user , {headers: headers})
      .map(res => res.json());
  }

  getProfile(){
      let headers = new Headers();
      this.loadToken();
      headers.append('Authorization' , this.authToken);
      headers.append('Content-Type' , 'application/json');
      return this.http.get('http://localhost:5000/users/profile' , {headers: headers})
        .map(res => res.json());
  }

  //Store Users data in browsers local storage
  storeUserData(token , user){
      localStorage.setItem('id_token' , token);
      localStorage.setItem('user' , JSON.stringify(user));
      this.authToken = token;
      this.user = user;
  }

  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn(){
     return tokenNotExpired('id_token');
  }

  //Clear the local Storage on logout
  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

}
