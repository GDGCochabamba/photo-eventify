import { Component } from '@angular/core';

@Component({
  selector: 'gdg-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gdg works!';

  getHeight(el: HTMLElement) {
    return `${el.clientHeight}px`;
  }
}
