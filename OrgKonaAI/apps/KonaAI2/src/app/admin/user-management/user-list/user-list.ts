import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectAll } from '../../../state/admin/users/reducers/users.reducer';
import { UsersActions } from '../../../state/admin/users/actions/users.actions';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList implements OnInit {


  private store = inject(Store);
  users$ = this.store.select(selectAll);

  ngOnInit() {
    this.store.dispatch(UsersActions.loadUsers());
  }

  reload() {
    this.store.dispatch(UsersActions.loadUsers());
  }
}
