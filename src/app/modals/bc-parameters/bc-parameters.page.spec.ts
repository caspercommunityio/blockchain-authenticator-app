import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { StorageService } from '../../services/storage.service';
import { BcParametersPage } from './bc-parameters.page';

describe('BcParametersPage', () => {
  let component: BcParametersPage;
  let fixture: ComponentFixture<BcParametersPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BcParametersPage],
      imports: [IonicModule.forRoot()],
      providers: [ModalController, StorageService]
    }).compileComponents();

    fixture = TestBed.createComponent(BcParametersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dismiss when call dismiss', async () => {
    let modalController = fixture.debugElement.injector.get(ModalController);
    spyOn(modalController, 'dismiss');

    component.dismiss();
    expect(modalController.dismiss).toHaveBeenCalled();
  });
  //
  it('should present toast when call validate with no passphrase', async () => {
    let modalController = fixture.debugElement.injector.get(ModalController);
    spyOn(modalController, 'dismiss');
    component.validate();
    expect(modalController.dismiss).toHaveBeenCalled();
  });
  it('should change fees', async () => {
    let storageService = fixture.debugElement.injector.get(StorageService);
    spyOn(storageService, 'setBlockchainFees').and.callThrough();
    spyOn(storageService, 'getBlockchainFees').and.callThrough();
    component.fees = 5;
    component.feesChanged();
    expect(await storageService.getBlockchainFees()).toEqual(5);
  });
  it('should change named key', async () => {
    let storageService = fixture.debugElement.injector.get(StorageService);
    spyOn(storageService, 'setNamedKey').and.callThrough();
    spyOn(storageService, 'getNamedKey').and.callThrough();
    component.namedKey = "new-named-key";
    component.namedKeyChanged();
    expect(await storageService.getNamedKey()).toEqual(component.namedKey);
  });
  it('should format pin', async () => {
    expect(component.formatPin(5.5)).toEqual(5.5);
  });

});
