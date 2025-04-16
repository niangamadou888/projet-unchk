import { Component, OnInit } from '@angular/core';

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit {
  user: User = {
    firstName: '',
    lastName: '',
    email: ''
  };
  userAvatar: string = '';

  constructor() { }

  ngOnInit(): void {
    // TODO: Fetch user data from your authentication service
    // For now, we'll use mock data
    this.user = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    };
  }

  editProfile(): void {
    // TODO: Implement edit profile functionality
    console.log('Edit profile clicked');
  }

  changePassword(): void {
    // TODO: Implement change password functionality
    console.log('Change password clicked');
  }
}
