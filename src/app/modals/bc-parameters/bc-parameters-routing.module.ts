import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BcParametersPage } from './bc-parameters.page';

const routes: Routes = [
  {
    path: '',
    component: BcParametersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BcParametersPageRoutingModule { }
