import { Component } from '@angular/core';
import {NavbarComponent} from '../navbar/navbar.component';
import {HomeComponent} from '../home/home.component';

@Component({
  selector: 'app-landing-page',
  imports: [NavbarComponent , HomeComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
  standalone:true ,
})
export class LandingPageComponent {

}
