import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { QrscannerPage } from './qrscanner.page';
import { RouterTestingModule } from '@angular/router/testing'
import { UtilsService } from '../services/utils.service';
describe('QrscannerPage', () => {
  let component: QrscannerPage;
  let fixture: ComponentFixture<QrscannerPage>;
  let navController: NavController;



  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [QrscannerPage],
      imports: [IonicModule.forRoot(), RouterTestingModule],
      providers: [NavController, UtilsService]
    }).compileComponents();

    fixture = TestBed.createComponent(QrscannerPage);
    navController = fixture.debugElement.injector.get(NavController);
    spyOn(navController, 'navigateRoot');
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });




  it('should scan and redirect', () => {

    component.scanResult = "otpauth://totp/otplib-website:otplib-demo-user?secret=ABCDEF";
    component.decodeScan();
    expect(navController.navigateRoot).toHaveBeenCalled();
  })

  it('should scan and success', async () => {
    let utilService = fixture.debugElement.injector.get(UtilsService);
    spyOn(utilService, 'decodeQRCodeBackup').and.returnValue(Promise.resolve(true));
    component.scanResult = "bcauthenticator;success";
    component.decodeScan();
    expect(utilService.decodeQRCodeBackup).toHaveBeenCalled();

  })
  it('should scan and error', async () => {
    let utilService = fixture.debugElement.injector.get(UtilsService);
    spyOn(utilService, 'decodeQRCodeBackup').and.returnValue(Promise.resolve(false));
    component.scanResult = "bcauthenticator;error";
    component.decodeScan();
    expect(utilService.decodeQRCodeBackup).toHaveBeenCalled();
  })
  it('should reset', () => {
    component.reset();
    expect(component.scanResult).toBeNull();
    expect(component.scanActive).toBeFalse();
  });

});
