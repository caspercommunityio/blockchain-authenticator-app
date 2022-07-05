import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnterSecretCodePageRoutingModule } from './enter-secret-code-routing.module';

import { EnterSecretCodePage } from './enter-secret-code.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnterSecretCodePageRoutingModule
  ],
  declarations: [EnterSecretCodePage]
})
export class EnterSecretCodePageModule {}
