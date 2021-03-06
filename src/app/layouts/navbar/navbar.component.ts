import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { filter } from 'rxjs/operators';

import { AsyncService } from '../../shared/services/async.service';
import { AuthService } from '../../../app/auth/auth.service';
import { AuthUser } from '../../../app/models/auth-user.model';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Output() toggle = new EventEmitter<any>();

  constructor(public asynService: AsyncService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(
          event =>
            event instanceof NavigationStart ||
            event instanceof NavigationEnd ||
            event instanceof NavigationCancel ||
            event instanceof NavigationError
        )
      )
      .subscribe(event => {
        if (event instanceof NavigationStart) {
          this.asynService.start();
          return;
        }
        this.asynService.finish();
      });
  }

  onToggle(): void {
    this.toggle.emit();
  }

  logout(): void {
    this.authService.logout().subscribe();
  }

  get authUser(): AuthUser {
    return this.authService.authUser;
  }
}
