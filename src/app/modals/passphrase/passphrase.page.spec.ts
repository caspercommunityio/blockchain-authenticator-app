import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { StorageService } from '../../services/storage.service';
import { UtilsService } from '../../services/utils.service';
import { PassphrasePage } from './passphrase.page';

describe('PassphrasePage', () => {
  let component: PassphrasePage;
  let fixture: ComponentFixture<PassphrasePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PassphrasePage],
      providers: [ModalController, StorageService, UtilsService],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PassphrasePage);

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

  it('should present toast when call validate with no passphrase', async () => {
    let modalController = fixture.debugElement.injector.get(ModalController);
    let storageService = fixture.debugElement.injector.get(StorageService);
    let utilsService = fixture.debugElement.injector.get(UtilsService);
    spyOn(modalController, 'dismiss');
    spyOn(storageService, 'checkPassphrase');
    spyOn(utilsService, 'presentToast');
    component.validate();
    expect(storageService.checkPassphrase).toHaveBeenCalled();
    expect(utilsService.presentToast).toHaveBeenCalled();
    expect(modalController.dismiss).toHaveBeenCalledTimes(0);
  });
  it('should dismiss when call validate with good passphrase', async () => {
    let modalController = fixture.debugElement.injector.get(ModalController);
    let storageService = fixture.debugElement.injector.get(StorageService);
    let utilsService = fixture.debugElement.injector.get(UtilsService);
    spyOn(modalController, 'dismiss');
    spyOn(storageService, 'checkPassphrase').and.returnValue(true);
    spyOn(utilsService, 'presentToast');
    component.validate();
    expect(storageService.checkPassphrase).toHaveBeenCalled();
    expect(utilsService.presentToast).toHaveBeenCalledTimes(0);
    expect(modalController.dismiss).toHaveBeenCalled();
  });

  it('should generate passphrase', async () => {
    let storageService = fixture.debugElement.injector.get(StorageService);
    spyOn(storageService, 'generatePassphrase').and.returnValue("TEST");
    component.generateRandomPassphrase();
    expect(component.passphrase).toEqual("TEST");

  })
});
