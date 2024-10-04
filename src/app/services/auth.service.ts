import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private activeUser: any = null;

  setActiveUser(user: any) {
    this.activeUser = user;
  }

  getActiveUser() {
    return this.activeUser;
  }
}
