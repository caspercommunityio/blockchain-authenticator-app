import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QrscannerPage } from './qrscanner.page';

const routes: Routes = [
  {
    path: '',
    component: QrscannerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrscannerPageRoutingModule {}
