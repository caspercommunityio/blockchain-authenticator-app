import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrcodeExportPageRoutingModule } from './qrcode-export-routing.module';

import { QrcodeExportPage } from './qrcode-export.page';
import { QRCodeModule } from 'angular2-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QrcodeExportPageRoutingModule,
    QRCodeModule,
  ],
  declarations: [QrcodeExportPage]
})
export class QrcodeExportPageModule { }
