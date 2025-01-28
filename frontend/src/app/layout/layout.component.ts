import { Component, inject, OnInit } from '@angular/core';
import { SpaceComponent } from '../space/space.component';
import { ToolboxComponent } from '../toolbox/toolbox.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [SpaceComponent, ToolboxComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  spaceKey: string | null = null;
  route: ActivatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.spaceKey = this.route.snapshot.paramMap.get('spaceKey');
  }
}
