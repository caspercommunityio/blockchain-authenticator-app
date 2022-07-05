import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { QrcodeExportPage } from './qrcode-export.page';
import { RouterTestingModule } from '@angular/router/testing'
describe('QrcodeExportPage', () => {
  let component: QrcodeExportPage;
  let fixture: ComponentFixture<QrcodeExportPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [QrcodeExportPage],
      providers: [NavController],
      imports: [IonicModule.forRoot(), RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(QrcodeExportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
