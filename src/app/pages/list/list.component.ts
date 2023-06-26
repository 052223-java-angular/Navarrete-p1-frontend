import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { List } from 'src/app/models/list/list';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ListService } from 'src/app/services/list/list.service';
import { ToasterService } from 'src/app/services/toaster/toaster.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  isLoading = false;
  isEditing = false;
  listEditing!: string;
  lists: Array<List> = [];

  constructor(
    private authService: AuthService,
    private listService: ListService,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {
    this.getLists(this.authService.getUserId());
  }

  activateEditMode(id: string) {
    if (this.listEditing != null && this.listEditing != id) {
      this.isEditing = false;
    }
    this.listEditing = id;
    this.isEditing = !this.isEditing;
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

  createList(form: NgForm) {
    // don't submit when form is invalid
    if (form.invalid) {
      return;
    }

    this.isLoading = true;

    this.listService.createMovieList(form.value.name).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.lists.push(res);
        this.toaster.success('Successfully create new movie list.');
      },
      error: (err) => {
        this.isLoading = false;
        delete err.error['timestamp'];
        // render error toaster
        this.toaster.error(err.error);
      },
    });
  }

  deleteMovieList(id: string) {
    this.isLoading = true;

    this.listService.deleteMovieList(id).subscribe({
      next: () => {
        this.isLoading = false;
        this.lists = this.lists.filter((item) => {
          return item.id != id;
        });
        this.toaster.success('Successfully deleted movie list.');
      },
      error: (err) => {
        this.isLoading = false;
        delete err.error['timestamp'];
        // render error toaster
        this.toaster.error(err.error);
      },
    });
  }

  deleteMovieFromList(id: string, movieId: number) {
    this.isLoading = true;

    this.listService.deleteMovieFromList(id, movieId).subscribe({
      next: () => {
        this.isLoading = false;
        this.lists.map((item) => {
          if (item.id == id) {
            item.movies = item.movies.filter((movie) => {
              return movie.id != movieId;
            });
          }
          return item;
        });
        this.toaster.success('Successfully deleted movie list.');
      },
      error: (err) => {
        this.isLoading = false;
        delete err.error['timestamp'];
        // render error toaster
        this.toaster.error(err.error);
      },
    });
  }
}
