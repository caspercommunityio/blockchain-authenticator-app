import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { environment } from '../../../environments/environment'
@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  version = environment.version;

  constructor(private modalController: ModalController, private platform: Platform) { }

  ngOnInit() {
  }

  /**
   * isMobile - Check if the current device is a mobile or not. Used  to enabled/disables some menus.
   *
   * @return {type}  description
   */
  isMobile() {
    return this.platform.is('mobile');
  }

  /**
   * selectMenu - Select a menu item
   *
   * @param  {type} menu menu element
   * @return {type}      description
   */
  selectMenu(menu) {
    this.modalController.dismiss({ menu: menu });
  }

  /**
   * dismiss - dismiss the modal
   *
   * @return {type}  description
   */
  dismiss() {
    this.modalController.dismiss();
  }

}
