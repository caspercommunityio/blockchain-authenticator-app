import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { StorageService } from './storage.service';
import CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private toastController: ToastController, private storageService: StorageService) { }


  /**
   * async presentToast - Present a toast
   *
   * @param  {type} message message to be displayed
   * @param  {type} color   color of the toast
   * @return {type}         description
   */
  async presentToast(message, color) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color
    });
    toast.present();
  }


  /**
   * async decodeQRCodeBackup - Decode a backup QRCode
   *
   * @param  {type} qrcode qrCode string
   * @return {type}        description
   */
  async decodeQRCodeBackup(qrcode) {
    let secretCodes = await this.storageService.getSecretCodes();

    let d = CryptoJS.AES.decrypt(qrcode.replace("bcauthenticator;", ""), "qrcodebackup");

    try {
      let barcodeData = JSON.parse(d.toString(CryptoJS.enc.Utf8));
      barcodeData.secretCodes.map(x => {
        if (secretCodes.filter(y => y.s == x.s).length == 0) {
          secretCodes.push(x);
        }
      });
      await this.storageService.setAccountPublicKey(barcodeData.publickey);
      await this.storageService.setSecretCodes(secretCodes);
      await this.storageService.setPassphrase(barcodeData.passphrase);
      await this.storageService.setNamedKey(barcodeData.namedKey);
      return Promise.resolve(true);
    } catch (err) {
      console.log(err);
      return Promise.resolve(false);
    }
  }

}
