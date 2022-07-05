import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { StorageService } from '../../services/storage.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-passphrase',
  templateUrl: './passphrase.page.html',
  styleUrls: ['./passphrase.page.scss'],
})
export class PassphrasePage implements OnInit {
  @Input() passphrase: string;
  constructor(private modalController: ModalController, private storageService: StorageService, private utilsService: UtilsService) { }

  ngOnInit() {
  }

  /**
   * generateRandomPassphrase - Generate a valid random passphrase
   *
   * @return {type}  description
   */
  generateRandomPassphrase() {
    this.passphrase = this.storageService.generatePassphrase();
  }

  /**
   * validate - Validate the passphrase. If everything is OK, dismiss the modal
   *
   * @return {type}  description
   */
  validate() {
    if (!this.storageService.checkPassphrase(this.passphrase)) {
      this.utilsService.presentToast("Your passphrase needs to contain at least 8 char. with 1 upper, 1 lower and 1 special character.", "warning");
    } else {

      this.modalController.dismiss({
        'passphrase': this.passphrase
      });
    }
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
