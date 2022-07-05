import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PassphrasePageRoutingModule } from './passphrase-routing.module';

import { PassphrasePage } from './passphrase.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PassphrasePageRoutingModule
  ],
  declarations: [PassphrasePage]
})
export class PassphrasePageModule {}
