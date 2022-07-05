import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QrcodeExportPage } from './qrcode-export.page';

const routes: Routes = [
  {
    path: '',
    component: QrcodeExportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrcodeExportPageRoutingModule {}
