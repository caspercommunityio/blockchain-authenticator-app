import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { StorageService } from '../../services/storage.service';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-bc-parameters',
  templateUrl: './bc-parameters.page.html',
  styleUrls: ['./bc-parameters.page.scss'],
})
export class BcParametersPage implements OnInit {
  @Input() fees: number;
  @Input() namedKey: string;

  gasFeesMin = environment.bcGasFeesMin;
  gasFeesMax = environment.bcGasFeesMax;
  constructor(private modalController: ModalController, private storageService: StorageService) { }

  ngOnInit() {
  }

  /**
   * validate - Validate the data, in that case, no validation. We dismiss the modal directly
   *
   * @return {type}  description
   */
  validate() {
    this.modalController.dismiss({
      'fees': this.fees,
      'namedKey': this.namedKey
    });
  }


  /**
   * dismiss - dimiss the modal
   *
   * @return {type}  description
   */
  dismiss() {
    this.modalController.dismiss({
      'namedKey': this.namedKey
    });
  }
  /**
   * formatPin - Format the value displayed in the pin
   *
   * @param  {type} value: number value to format
   * @return {type}               description
   */
  formatPin(value: number) {
    return value;
  }
  /**
   * async feesChanged - Store the fees when changed
   *
   * @return {type}  description
   */
  async feesChanged() {
    await this.storageService.setBlockchainFees(this.fees);
  }

  /**
   * async namedKeyChanged - Store the named key when changed
   *
   * @return {type}  description
   */
  async namedKeyChanged() {
    await this.storageService.setNamedKey(this.namedKey);
  }

}
