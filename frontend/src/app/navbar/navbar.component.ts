import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  standalone: true ,
})
export class NavbarComponent {
  constructor(private router: Router) {}
  ToAuth(): void {
    this.router.navigate(['/auth']);
  }
}
