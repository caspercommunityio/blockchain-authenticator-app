import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import CryptoJS from 'crypto-js';

@Component({
  selector: 'app-qrcode-export',
  templateUrl: './qrcode-export.page.html',
  styleUrls: ['./qrcode-export.page.scss'],
})
export class QrcodeExportPage implements OnInit {
  qrcodevalue: string;

  constructor(private storageService: StorageService) { }

  /**
   * async ngOnInit - Generate the QRCode with the backup's informations
   *
   * @return {type}  description
   */
  async ngOnInit() {
    let passphrase = await this.storageService.getPassphrase();
    let publickey = await this.storageService.getAccountPublicKey();
    let secretCodes = await this.storageService.getSecretCodes();
    let namedKey = await this.storageService.getNamedKey();

    secretCodes.map(x => {
      delete x.token;
      delete x.sync;
      delete x.isChecked;
    })
    let output = {
      "publickey": publickey,
      "passphrase": passphrase,
      "secretCodes": secretCodes,
      "namedKey": namedKey
    }
    let e = CryptoJS.AES.encrypt(JSON.stringify(output), "qrcodebackup");
    this.qrcodevalue = "bcauthenticator;" + e.toString();
  }

}
