import { Component } from '@angular/core';
import { SpaceComponent } from "../space/space.component";
import { ToolboxComponent } from '../toolbox/toolbox.component';

@Component({
  selector: 'app-layout',
  imports: [SpaceComponent,ToolboxComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {

}
