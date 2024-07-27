import { Component } from '@angular/core';
import { desktopOutline, cameraOutline, imageOutline, closeOutline } from 'ionicons/icons'
import { addIcons } from 'ionicons'
import { MENU_ITEMS } from './pages-menu';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {

  menu = MENU_ITEMS;
  icons = {
    desktopOutline
  }

  constructor() {
    addIcons(this.icons)
  }
  /**
   * 
   *   <div myMenu class="main-container main-container-fixed">
        <div class="scrollable">
          <ul class="menu-items">
            <li class="menu-item">
            <a  [routerLink]="['/pages/dashboard']"  title="E-commerce">
              <nb-icon icon="desktop-outline" pack="ion"></nb-icon>
              <span class="menu-title">E-commerce</span>
            </a>
            </li>
          </ul>
        </div>
      </div>
   */
}
