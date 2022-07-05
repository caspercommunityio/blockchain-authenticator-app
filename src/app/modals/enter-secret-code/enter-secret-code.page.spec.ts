import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';

import { EnterSecretCodePage } from './enter-secret-code.page';

describe('EnterSecretCodePage', () => {
  let component: EnterSecretCodePage;
  let fixture: ComponentFixture<EnterSecretCodePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EnterSecretCodePage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EnterSecretCodePage);
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
  })

  it('should not dismiss when call validate', async () => {
    let modalController = fixture.debugElement.injector.get(ModalController);
    spyOn(modalController, 'dismiss');
    component.validate();
    expect(modalController.dismiss).toHaveBeenCalledTimes(0);
  })
  it('should dismiss when call validate', async () => {
    let modalController = fixture.debugElement.injector.get(ModalController);
    component.name = "TEST";
    component.secretCode = "TEST";
    spyOn(modalController, 'dismiss');
    component.validate();
    expect(modalController.dismiss).toHaveBeenCalled();
  })
});
