import { Component, HostListener } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ModalController, NavController, PopoverController, AlertController } from '@ionic/angular';
import { EnterSecretCodePage } from '../modals/enter-secret-code/enter-secret-code.page';
import { PassphrasePage } from '../modals/passphrase/passphrase.page';
import { BcParametersPage } from '../modals/bc-parameters/bc-parameters.page';
import { MenuPage } from '../modals/menu/menu.page';
import { authenticator } from 'otplib';
import { BlockchainService } from '../services/blockchain.service';
import { StorageService } from '../services/storage.service';
import { UtilsService } from '../services/utils.service';
import * as CryptoJS from 'crypto-js';
import lzwCompress from 'lzwcompress';
import { DeployUtil, RuntimeArgs, CLValueBytesParsers, CLU32, CLI32, CLI64, CLU128, CLU256, CLU64Type, ToBytesResult, CLString, ResultAndRemainder, resultHelper, CLErrorCodes, CLPublicKey, CLType, CLTypeTag, Signer, CLValueParsers, CLTypeBuilder, CasperClient, CLByteArray, CLValue, CLURef, CLU64, CLBool, CLKey, CLAccountHash, CLMap, CLU8, CLU512, CLList, CasperServiceByJsonRPC } from "casper-js-sdk";
import { IonReorderGroup, Platform } from '@ionic/angular';
import { ItemReorderEventDetail } from '@ionic/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Clipboard } from '@capacitor/clipboard';

let casperWallet = undefined;// (window as any).CasperWalletProvider();
try {
  casperWallet = (window as any).CasperWalletProvider();
} catch (e) {
  console.log("e")
}
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  secretCodesKey = "blockchain-authenticator";
  passphrase = "";
  secretCodes = [];
  status: string = 'normal';

  tokenTimer = 30;
  currentTimer = 0;

  public signerStatus = {
    isConnected: false,
    isUnlocked: false,
    activeKey: undefined,
    label: "Locked"
  };
  constructor(private platform: Platform, private alertController: AlertController, private route: ActivatedRoute, private navController: NavController, private modalController: ModalController, private blockchainService: BlockchainService, private storageService: StorageService, private utilsService: UtilsService) { }

  /**
   * async ngOnInit - Trigger when the page is called for the first time
   *
   * @return {type}  description
   */
  async ngOnInit() {
    //Retrieve data stored locally
    this.secretCodes = await this.storageService.getSecretCodes();
    this.passphrase = await this.storageService.getPassphrase();
    this.secretCodesKey = await this.storageService.getNamedKey();
    //When the timer is reached (30s), we generate the OTP for each code and retrieve the data from the blockchain
    setInterval(() => {
      this.currentTimer++;
      if (this.currentTimer == this.tokenTimer) {
        this.generateTokens();
        this.retrieveFromBlockchain();
      }
    }, 1000);
    //If we come back to the home page with a query parameter, we open the popup to manage secret code
    if (this.route.snapshot.params.secret) {
      this.addSecretCode("", this.route.snapshot.params.secret, 'add');
    }
    //Generate fresh new tokens
    this.generateTokens();

    //Casper wallet
    // console.log(casperWallet);
    setTimeout(() => {
      casperWallet.isConnected().then(c => {
        if (!c) {
          casperWallet.requestConnection();
        }
      });
    }, 2000)
  }

  /**
   * ionViewDidEnter - Trigger when we enter the page
   *
   * @return {type}  description
   */
  async ionViewDidEnter() {
    this.secretCodes = await this.storageService.getSecretCodes();
    //Retrieve the data from the blockchain
    this.retrieveFromBlockchain();
  }

  /**
   * isMobile - Check if we are on mobile (smartphone, table, etc). Used to disabled some functionalities when we are on mobile
   *
   * @return {type}  description
   */
  isMobile() {
    return this.platform.is("mobile")
  }

  /**
   * scanQRCode - Redirect to the page to scan a QRCode
   *
   * @return {type}  description
   */
  scanQRCode() {
    this.navController.navigateForward(["qrscanner"]);
  }

  /**
   * generateQRCode - Redirect to the page to generate the Export QRCode
   *
   * @return {type}  description
   */
  generateQRCode() {
    this.navController.navigateForward(["qrcode-export"]);
  }

  /**
   * async copyOTP - Copy a value to the clipboad
   *
   * @param  {type} value value to copy to the clipboard
   * @return {type}       description
   */
  async copyOTP(value) {
    await Clipboard.write({
      string: value
    });
    this.utilsService.presentToast("The selected OTP's code was copied to clipboard", "success");
  }

  /**
   * generateTokens - Generate new OTP for each secret code
   *
   * @return {type}  description
   */
  async generateTokens() {
    this.currentTimer = 0;
    this.secretCodes.map(x => this.generateToken(x));
  }

  /**
   * generateToken - Generate a new OTP for a specific secret code
   *
   * @param  {type} data secret code
   * @return {type}      description
   */
  generateToken(data) {
    const token = authenticator.generate(data.s);
    data.token = token;
  }

  /**
   * setMode - Set the mode of the page (edit, sync, normal)
   *
   * @param  {type} mode One of the recognize mode (edit, sync, normal)
   * @return {type}      description
   */
  setMode(mode) {
    if (mode == 'edit') {
      this.status = (this.status == 'edit' ? 'normal' : 'edit');
    } else if (mode == 'sync') {
      this.status = (this.status == 'sync' ? 'normal' : 'sync');
      this.secretCodes.map(x => x.isChecked = false);
    } else {
      this.status = 'normal';
    }

    this.generateTokens();
  }

  /**
   * doReorder - Method called when you reorder the list of secret codes
   *
   * @param  {type} ev Event containing the new positions
   * @return {type}    description
   */
  doReorder(ev) {
    this.secretCodes = ev.detail.complete(this.secretCodes);
    this.storageService.setSecretCodes(this.secretCodes);
  }

  /**
   * async retrieveFromBlockchain - Retrieve all the data from the blockchain then decrypt and update the list of secret codes
   *
   * @return {type}  description
   */
  async retrieveFromBlockchain() {
    this.blockchainService.retrieveData(this.secretCodesKey).subscribe(v => {
      try {
        let tmpSecretCodes = [];
        v.map(x => {
          let v = x.replaceAll("\"", "").split(";");
          let d = CryptoJS.AES.decrypt(v[1], this.passphrase);
          let o = d.toString(CryptoJS.enc.Utf8).split(";");
          if (o[0] != "" && o[1] != "" && x.data != "") {
            tmpSecretCodes.push({ n: o[0], s: o[1], id: v[0] });
          } else if (o[0] == "" && x.data != "") {
            this.utilsService.presentToast('Error while retrieving your data. Please check the passphrase.', 'danger');
          }
        })
        //Add new secret codes to the existing list or update the "sync" property
        tmpSecretCodes.map(x => {
          if (this.secretCodes.filter(y => y.s == x.s).length == 0) {
            x.sync = true;
            this.secretCodes.push(x);
          }
          this.secretCodes.filter(y => y.s == x.s).map(y => { y.sync = true; });
        });
        //If a secret code is no more sync on the blockchain, disable the sync property
        this.secretCodes.map(x => {
          if (tmpSecretCodes.filter(y => y.s == x.s).length == 0) {
            x.sync = false;
          }
        })
        //Store this secret codes locally
        this.storageService.setSecretCodes(this.secretCodes).then(x => {
          //Generate a new tokens
          this.generateTokens();
        });
      } catch (err) {
        console.log(err)
        this.utilsService.presentToast('Error while retrieving your data. Please check the passphrase.', 'danger');
      }

    });

  }

  /**
   * async showMenu - Display the menu modal
   *
   * @return {type}  description
   */
  async showMenu() {
    const modal = await this.modalController.create({
      component: MenuPage,
      componentProps: {

      },
      swipeToClose: true,
      showBackdrop: true,
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.5, 1]
    });
    //Trigger the correct method after a menu item is selected
    modal.onWillDismiss().then((event) => {
      if (event.data !== undefined) {
        this.selectMenu(event.data.menu)
      }
    });
    return await modal.present();
  }


  /**
   * selectMenu - Open the correct menu element
   *
   * @param  {type} menu menu selected
   * @return {type}      description
   */
  selectMenu(menu) {
    if (menu === 'scanqrcode') {
      this.scanQRCode();
    } else if (menu === 'generateqrcode') {
      this.generateQRCode();
    } else if (menu === 'addsecretcode') {
      this.addSecretCode('', '', 'add');
    } else if (menu === 'setpassphrase') {
      this.setPassphrase();
    } else if (menu === 'editmode') {
      this.setMode("edit");
    } else if (menu === 'syncblockchain') {
      this.syncToBlockchain('add');
    } else if (menu === 'delblockchain') {
      this.syncToBlockchain('del');
    } else if (menu === 'getblockchain') {
      this.retrieveFromBlockchain();
    } else if (menu === 'activatesyncblockchain') {
      this.setMode("sync");
    }
  }

  /**
   * async setPassphrase - Modal to edit the passphrase
   *
   * @return {type}  description
   */
  async setPassphrase() {
    let passphrase = await this.storageService.getPassphrase();
    const modal = await this.modalController.create({
      component: PassphrasePage,
      componentProps: {
        passphrase: passphrase
      },
      swipeToClose: true,
      showBackdrop: true,
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.5, 1]
    });
    modal.onWillDismiss().then((result) => {
      if (result.data !== undefined) {
        this.storageService.setPassphrase(result.data.passphrase);
        this.passphrase = result.data.passphrase;
      }
    });
    return await modal.present();
  }



  /**
   * async addSecretCode - Display the secret code modal to add or edit a secret code
   *
   * @param  {type} name       the name of the secret code
   * @param  {type} secretCode the secret code that will be used to generate the OTP
   * @param  {type} mode       edit or add
   * @return {type}            description
   */
  async addSecretCode(name, secretCode, mode) {

    const modal = await this.modalController.create({
      component: EnterSecretCodePage,
      componentProps: {
        name: name,
        secretCode: secretCode,
        mode: mode
      },
      swipeToClose: true,
      showBackdrop: true,
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.5, 1]
    });
    modal.onWillDismiss().then((result) => {
      this.onAddSecretCode(result)
    });
    return await modal.present();
  }


  /**
   * onAddSecretCode - Method called after validate the addSecretCode popup
   *
   * @param  {type} result: any description
   * @return {type}             description
   */
  onAddSecretCode(result: any) {

    if (result.data !== undefined) {

      if (this.secretCodes.filter(x => x.s == result.data.s).length == 0) {
        result.data.sync = false;
        this.secretCodes.push(result.data);
      } else {
        this.secretCodes.filter(x => x.s == result.data.s).map(x => x.n = result.data.n)
      }
      this.storageService.setSecretCodes(this.secretCodes);
      // this.normalMode = false;
      this.status = 'undefined';
      setTimeout(() => {
        this.generateTokens();
        this.status = 'normal';
      }, 200)
    }
  }

  /**
   * async setBlockchainParams - Modal to edit the blockchain parameters
   *
   * @return {type}  description
   */
  async setBlockchainParams() {
    let fees = await this.storageService.getBlockchainFees();
    const modal = await this.modalController.create({
      component: BcParametersPage,
      componentProps: {
        fees: fees,
        namedKey: this.secretCodesKey
      },
      swipeToClose: true,
      showBackdrop: true,
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.5, 1]
    });
    modal.onWillDismiss().then((result) => {
      if (result.data !== undefined) {
        this.secretCodesKey = result.data.namedKey;
      }
    });
    return await modal.present();
  }


  /**
   * async removeSecretCode - Popup "are-you sure ?" before deleting a secret code
   *
   * @param  {type} element description
   * @return {type}         description
   */
  async removeSecretCode(element) {
    const alert = await this.alertController.create({
      header: 'Please confirm',
      message: 'Are you sure you want to delete this entry ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button'
        }, {
          text: 'Yes',
          id: 'confirm-button',
          handler: () => {
            this.secretCodes = this.secretCodes.filter(x => x.s != element.s);
            this.storageService.setSecretCodes(this.secretCodes);
          }
        }
      ]
    });

    await alert.present();

  }

  /**
   * async syncToBlockchain - Open the wallet to validate the deployment of the contract
   *
   * @param  {type} method description
   * @return {type}        description
   */
  async syncToBlockchain(method) {
    if (this.secretCodes.filter(x => x.isChecked).length > 5) {
      this.utilsService.presentToast('You can only sync. up to 5 elements at a time.', 'warning');
    } else if (this.secretCodes.filter(x => x.isChecked).length == 0) {
      this.utilsService.presentToast('Please select at least one element.', 'warning');
    } else {

      try {
        let dataToStore = [];
        let tmp = JSON.parse(JSON.stringify(this.secretCodes));
        tmp.filter(x => x.isChecked).map(x => {
          delete x.token;
          delete x.sync;
          delete x.isChecked;
          let e = CryptoJS.AES.encrypt(x.n + ";" + x.s, this.passphrase);
          dataToStore.push(x.id + ";" + e.toString());
        })

        let r = await this.blockchainService.callContract(method, dataToStore);
        if (r !== false) {
          this.utilsService.presentToast('Synchronisation with the blockchain send.', 'light');
        }
        this.storageService.setSecretCodes(this.secretCodes);
      } catch (err) {
        console.log(err);
        this.utilsService.presentToast('Please check that the \'Casper Wallet\' is unlocked and connected.', 'danger');
      }
    }
  }

  /**
   * async desyncAllData - popup "are-you sure?" before desync. all the data from the blockchain
   *
   * @return {type}  description
   */
  async desyncAllData() {
    const alert = await this.alertController.create({
      header: 'Please confirm',
      message: 'Are you sure you want to delete all entries ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button'
        }, {
          text: 'Yes',
          id: 'confirm-button',
          handler: () => {
            this.blockchainService.callContract("delall", []);
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * async selectWalletPublicKey - Get the public key associated to the Casper Wallet
   *
   * @return {type}  description
   */
  async selectWalletPublicKey() {
    if (!await casperWallet.isConnected()) {
      try {
        await casperWallet.requestConnection();
      } catch (err) {
        this.utilsService.presentToast('Check that the Casper\'s extension is installed', 'danger');
      }
    } else {
      let publicKey = await casperWallet.getActivePublicKey();
      await this.storageService.setAccountPublicKey(publicKey);
      this.signerStatus.activeKey = publicKey;
      this.utilsService.presentToast("The selected Public Key (" + this.signerStatus.activeKey.substr(0, 4) + "..." + this.signerStatus.activeKey.substr(-4) + ") from your wallet is stored ", "success");
    }
  }
  /**
   * initSignerLabel - Init the CasperSigner label
   *
   * @return {type}  description
   */
  initSignerLabel() {
    if (this.signerStatus.isUnlocked && this.signerStatus.isConnected && this.signerStatus.activeKey !== undefined) {
      this.signerStatus.label = this.signerStatus.activeKey.substr(0, 5) + '...' + this.signerStatus.activeKey.substr(-5);
    }
    if (this.signerStatus.isUnlocked && !this.signerStatus.isConnected) {
      this.signerStatus.label = "DISCONNECTED";
    }

    if (!this.signerStatus.isUnlocked) {
      this.signerStatus.label = "LOCKED";
    }
  }

  /**
   * updateSignerStatus - Update the Casper Wallet Object
   *
   * @param  {type} newStatus new status of the Casper Wallet returned by the chrome extension
   * @return {type}           description
   */
  updateSignerStatus(newStatus, wallet?) {
    if (wallet == "casperwallet") {
      let details = JSON.parse(newStatus.detail);
      this.signerStatus.isUnlocked = !details.isUnlocked;
      this.signerStatus.activeKey = details.activeKey;
      this.signerStatus.isConnected = details.isConnected;

    } else {
      this.signerStatus.isUnlocked = newStatus.detail.isUnlocked;
      this.signerStatus.activeKey = newStatus.detail.activeKey;
      this.signerStatus.isConnected = newStatus.detail.isConnected;

    }

    this.initSignerLabel();
    this.storageService.setAccountPublicKey(this.signerStatus.activeKey);
  }


  /**
   * Events from the Casper Wallet where we are listening at
   */
  @HostListener('window:casper-wallet:connected', ['$event'])
  CasperWalletInitialState(event: any) {
    this.updateSignerStatus(event, "casperwallet");
  }
  @HostListener('window:casper-wallet:locked', ['$event'])
  CasperWalletLocked(event: any) {
    this.updateSignerStatus(event, "casperwallet");
  }
  @HostListener('window:casper-wallet:unlocked', ['$event'])
  CasperWalletUnlocked(event: any) {
    this.updateSignerStatus(event, "casperwallet");
  }
  @HostListener('window:casper-wallet:disconnected', ['$event'])
  CasperWalletDisconnected(event: any) {
    this.updateSignerStatus(event, "casperwallet");
  }
  @HostListener('window:casper-wallet:tabUpdated', ['$event'])
  CasperWalletTabUpdated(event: any) {
    this.updateSignerStatus(event, "casperwallet");
  }
  @HostListener('window:casper-wallet:activeKeyChanged', ['$event'])
  CasperWalletActiveKeyChanged(event: any) {
    this.updateSignerStatus(event, "casperwallet");
  }



  @HostListener('window:signer:initialState', ['$event'])
  signerInitialState(event: any) {
    this.updateSignerStatus(event);
  }
  @HostListener('window:signer:locked', ['$event'])
  signerLocked(event: any) {
    this.updateSignerStatus(event);
  }
  @HostListener('window:signer:unlocked', ['$event'])
  signerUnlocked(event: any) {
    this.updateSignerStatus(event);
  }
  @HostListener('window:signer:connected', ['$event'])
  signerConnected(event: any) {
    this.updateSignerStatus(event);
  }
  @HostListener('window:signer:disconnected', ['$event'])
  signedDisconnected(event: any) {
    this.updateSignerStatus(event);
  }
  @HostListener('window:signer:tabUpdated', ['$event'])
  signedTabUpdated(event: any) {
    this.updateSignerStatus(event);
  }
  @HostListener('window:signer:activeKeyChanged', ['$event'])
  signedActiveKeyChanged(event: any) {
    this.updateSignerStatus(event);
  }

}
