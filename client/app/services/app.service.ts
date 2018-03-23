import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable()
export class AppService {
  constructor(private router: Router) { }

  routeTo(route) {
    this.router.navigate(route);
  }
}
