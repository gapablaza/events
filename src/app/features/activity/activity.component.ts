import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-activity',
  template: ` <router-outlet></router-outlet> `,
  standalone: true,
  imports: [RouterOutlet],
})
export class ActivityComponent implements OnInit {
  ngOnInit(): void {}
}
