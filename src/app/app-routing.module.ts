import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'enter-secret-code',
    loadChildren: () => import('./modals/enter-secret-code/enter-secret-code.module').then(m => m.EnterSecretCodePageModule)
  },
  {
    path: 'passphrase',
    loadChildren: () => import('./modals/passphrase/passphrase.module').then(m => m.PassphrasePageModule)
  },
  {
    path: 'qrscanner',
    loadChildren: () => import('./qrscanner/qrscanner.module').then(m => m.QrscannerPageModule)
  },
  {
    path: 'qrcode-export',
    loadChildren: () => import('./qrcode-export/qrcode-export.module').then(m => m.QrcodeExportPageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./modals/menu/menu.module').then(m => m.MenuPageModule)
  },
  {
    path: 'fees',
    loadChildren: () => import('./modals/bc-parameters/bc-parameters.module').then(m => m.BcParametersPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
