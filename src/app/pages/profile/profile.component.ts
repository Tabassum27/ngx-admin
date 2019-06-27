import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../../@core/mock/users.service';

@Component({
  selector: 'ngx-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {

  constructor(private userService: UserService) {}

  user: any;
  subscription: Subscription;

  ngOnInit(): void {
    this.subscription = this.userService.getUsers()
    .subscribe((users: any) => this.user = users.nick );
  }

  ngOnDestroy(): void {
  this.subscription.unsubscribe();
  }
}
