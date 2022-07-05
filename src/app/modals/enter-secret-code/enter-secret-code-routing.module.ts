import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnterSecretCodePage } from './enter-secret-code.page';

const routes: Routes = [
  {
    path: '',
    component: EnterSecretCodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnterSecretCodePageRoutingModule {}
