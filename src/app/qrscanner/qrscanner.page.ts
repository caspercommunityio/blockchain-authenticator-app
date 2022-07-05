import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { LoadingController, Platform, NavController } from '@ionic/angular';
import jsQR from 'jsqr';
import { UtilsService } from '../services/utils.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-qrscanner',
  templateUrl: './qrscanner.page.html',
  styleUrls: ['./qrscanner.page.scss'],
})
export class QrscannerPage implements OnInit {

  @ViewChild('video', { static: false }) video: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  @ViewChild('fileinput', { static: false }) fileinput: ElementRef;

  canvasElement: any;
  videoElement: any;
  canvasContext: any;
  scanActive = false;
  scanResult = null;
  loading: HTMLIonLoadingElement = null;

  constructor(
    private loadingCtrl: LoadingController,
    private plt: Platform,
    private navController: NavController,
    private router: Router,
    private utilsService: UtilsService
  ) {
    // const isInStandaloneMode = () =>
    //   'standalone' in window.navigator && window.navigator['standalone'];
    // if (this.plt.is('ios') && isInStandaloneMode()) {
    //   console.log('I am a an iOS PWA!');
    //   // E.g. hide the scan functionality!
    // }
  }

  ngOnInit() {

  }

  /**
   * ngAfterViewInit - Start the scan once the view is initialized
   *
   * @return {type}  description
   */
  ngAfterViewInit() {
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');
    this.videoElement = this.video.nativeElement;
    this.startScan();
  }


  /**
   * reset - Reset(shutdown) the camera
   *
   * @return {type}  description
   */
  reset() {
    this.scanResult = null;
    this.scanActive = false;

    if (this.videoElement.srcObject) {

      const tracks = this.videoElement.srcObject.getVideoTracks();
      tracks.forEach(track => track.stop())
    }
  }

  /**
   * ionViewDidLeave - Reset the scan when leaving the page
   *
   * @return {type}  description
   */
  ionViewDidLeave() {
    this.reset();
  }


  /**
   * async startScan - Start the camera
   *
   * @return {type}  description
   */
  async startScan() {
    // Not working on iOS standalone mode!
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });

    this.videoElement.srcObject = stream;
    // Required for Safari
    this.videoElement.setAttribute('playsinline', true);

    this.loading = await this.loadingCtrl.create({});
    await this.loading.present();

    this.videoElement.play();
    requestAnimationFrame(this.scan.bind(this));
  }


  /**
   * async decodeScan - Decode a scanned QRCode
   *
   * @return {type}  description
   */
  async decodeScan() {
    if (this.scanResult.indexOf("secret=") >= 0) {
      let url = new URL(this.scanResult);
      this.navController.navigateRoot(["home", { "secret": url.searchParams.get("secret") }]);
    } else if (this.scanResult.indexOf("bcauthenticator;") == 0) {
      let decodeResult = await this.utilsService.decodeQRCodeBackup(this.scanResult);
      // if (decodeResult) {
      //   console.log("MGR", decodeResult)
      //   this.navController.navigateRoot(["home", { "d": new Date().getTime() }]);
      // } else {
      //   console.log("\n\n\nMGR", decodeResult, "la")
      //   this.utilsService.presentToast("Error while retrieving your data. Please check the passphrase.", "error");
      this.navController.navigateRoot(["home"]);
      // }
    }
  }

  /**
   * async scan - Event triggered when a qrcode is scanned
   *
   * @return {type}  description
   */
  async scan() {
    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
      if (this.loading) {
        await this.loading.dismiss();
        this.loading = null;
        this.scanActive = true;
      }

      this.canvasElement.height = this.videoElement.videoHeight;
      this.canvasElement.width = this.videoElement.videoWidth;

      this.canvasContext.drawImage(
        this.videoElement,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });
      if (code) {
        this.scanActive = false;
        this.scanResult = code.data;

        this.decodeScan();
        this.reset()

      } else {
        if (this.scanActive) {
          requestAnimationFrame(this.scan.bind(this));
        }
      }
    } else {
      requestAnimationFrame(this.scan.bind(this));
    }
  }

}
