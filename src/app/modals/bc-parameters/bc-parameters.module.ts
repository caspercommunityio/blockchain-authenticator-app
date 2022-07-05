import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BcParametersPageRoutingModule } from './bc-parameters-routing.module';

import { BcParametersPage } from './bc-parameters.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BcParametersPageRoutingModule
  ],
  declarations: [BcParametersPage]
})
export class BcParametersPageModule { }
