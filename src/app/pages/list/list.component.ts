import { Component, OnInit } from '@angular/core';
import { List } from 'src/app/models/list/list';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ListService } from 'src/app/services/list/list.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  isLoading = false;
  lists: Array<List> = [];

  constructor(
    private authService: AuthService,
    private listService: ListService
  ) {}

  ngOnInit(): void {
    this.getLists(this.authService.getUserId());
  }

  getLists(userId: string) {
    this.isLoading = true;

    this.listService.getLists(userId).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.lists = res;
        console.log(res);
      },
      error: (err) => {
        this.isLoading = false;
        console.log(err);
      },
    });
  }
}
