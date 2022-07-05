import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-enter-secret-code',
  templateUrl: './enter-secret-code.page.html',
  styleUrls: ['./enter-secret-code.page.scss'],
})
export class EnterSecretCodePage implements OnInit {

  @Input() name: string;
  @Input() secretCode: string;
  @Input() mode: string;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  /**
   * validate - Validate the values. If everything is OK, close the modal
   *
   * @return {type}  description
   */
  validate() {
    if (this.name !== undefined && this.secretCode !== undefined && this.name != "" && this.secretCode != "") {
      this.modalController.dismiss({
        'n': this.name,
        's': this.secretCode,
        'id': Date.now()
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
