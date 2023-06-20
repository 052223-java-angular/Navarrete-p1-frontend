import { Component } from '@angular/core';
import { ToasterService } from 'src/app/services/toaster/toaster.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.css'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('0.5s ease-in', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class ToasterComponent {
  errors: { [key: string]: string } | null = null;
  success: string | null = null;
  timeout!: ReturnType<typeof setTimeout>;

  constructor(private toasterService: ToasterService) {}

  ngOnInit() {
    this.toasterService.initSuccess(this.successFn.bind(this));
    this.toasterService.initError(this.errorFn.bind(this));
  }

  successFn(message: string) {
    // clear previous timer
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.errors = null;
      this.success = null;
    }

    // display success toaster
    this.success = message;

    // remove toaster
    setTimeout(() => {
      this.success = null;
    }, 6000);
  }

  errorFn(errors: { [key: string]: string }) {
    // clear previous timer
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.errors = null;
      this.success = null;
    }

    // display error toaster
    this.errors = errors;

    // remove toaster
    this.timeout = setTimeout(() => {
      this.errors = null;
    }, 6000);
  }

  onClick(): void {
    clearTimeout(this.timeout);
    this.errors = null;
    this.success = null;
  }
}
