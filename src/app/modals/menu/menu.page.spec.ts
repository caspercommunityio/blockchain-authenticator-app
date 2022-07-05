import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ModalController, IonicModule } from '@ionic/angular';
import { MenuPage } from './menu.page';

describe('MenuPage', () => {
  let component: MenuPage;
  let fixture: ComponentFixture<MenuPage>;

  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      declarations: [MenuPage],
      imports: [IonicModule.forRoot()],
      providers: [ModalController,]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuPage);
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

  it('should dismiss when call select menu', async () => {
    let modalController = fixture.debugElement.injector.get(ModalController);
    spyOn(modalController, 'dismiss');

    component.selectMenu("test");
    expect(modalController.dismiss).toHaveBeenCalled();
  })
});
