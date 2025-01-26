import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VideoboxComponent } from './videobox/videobox.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet , VideoboxComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
