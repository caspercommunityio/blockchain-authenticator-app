import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { HomePage } from './home.page';
import { ModalController, AngularDelegate, AlertController, Platform, NavController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { BlockchainService } from '../services/blockchain.service';
import { UtilsService } from '../services/utils.service';
import { of } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { Clipboard } from '@capacitor/clipboard';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let modalController: ModalController;
  let alertController: AlertController;


  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [RouterTestingModule],
      providers: [ModalController, AngularDelegate, StorageService, AlertController, BlockchainService, UtilsService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    modalController = fixture.debugElement.injector.get(ModalController);
    alertController = fixture.debugElement.injector.get(AlertController);
    spyOn(alertController, 'create');
    spyOn(modalController, 'create');
    fixture.detectChanges();
  });

  afterEach(() => {
    modalController = undefined;
    alertController = undefined;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize variables', () => {
    expect(component.secretCodesKey).toEqual("blockchain-authenticator");
    expect(component.passphrase).toEqual("");
    expect(component.status).toEqual("normal");
    expect(component.secretCodes.length).toEqual(0);
  });

  it('should change mode', () => {
    component.setMode("edit")
    expect(component.status).toEqual("edit");
    component.setMode("edit")
    expect(component.status).toEqual("normal");
    component.setMode("sync")
    expect(component.status).toEqual("sync");
    component.setMode("sync")
    expect(component.status).toEqual("normal");
    component.setMode("ABC")
    expect(component.status).toEqual("normal");
    component.setMode("normal")
    expect(component.status).toEqual("normal");
  });

  it('should call menu', async () => {
    component.showMenu();
    expect(modalController.create).toHaveBeenCalled();
  })

  it('should call addSecretCode', async () => {
    component.addSecretCode("", "", "");
    expect(modalController.create).toHaveBeenCalled();
  })
  // it('should call setBlockchainParams', async () => {
  //   component.setBlockchainParams();
  //   expect(modalController.create).toHaveBeenCalled();
  // })
  // it('should call setPassphrase', async () => {
  //   component.setPassphrase();
  //   expect(modalController.create).toHaveBeenCalled();
  // })
  it('should call removeSecretCode', async () => {
    component.removeSecretCode("test");
    expect(alertController.create).toHaveBeenCalled();
  })
  it('should call desyncAllData', async () => {
    component.desyncAllData();
    expect(alertController.create).toHaveBeenCalled();
  })
  it('should return mobile true', async () => {
    let platform: Platform = fixture.debugElement.injector.get(Platform);
    spyOn(platform, "platforms").and.returnValue(["mobile"]);
    spyOn(platform, "is").and.returnValue(true);
    expect(component.isMobile()).toBeTrue();
  })
  it('should return mobile false', async () => {
    let platform: Platform = fixture.debugElement.injector.get(Platform);
    spyOn(platform, "platforms").and.returnValue(["mobile"]);
    spyOn(platform, "is").and.returnValue(false);
    expect(component.isMobile()).toBeFalse();
  })
  it('should return data from blockchain', async () => {
    let blockchainService = fixture.debugElement.injector.get(BlockchainService);
    spyOn(blockchainService, 'retrieveData').and.returnValue(of([]));
    await component.retrieveFromBlockchain();
    expect(component.secretCodes.length).toEqual(0);
  })
  it('should return data from blockchain', async () => {
    component.passphrase = "TEST";
    let e = CryptoJS.AES.encrypt("NAME;VALUE", component.passphrase);
    let blockchainService = fixture.debugElement.injector.get(BlockchainService);
    spyOn(blockchainService, 'retrieveData').and.returnValue(of(["1;" + e.toString()]));
    await component.retrieveFromBlockchain();
    expect(component.secretCodes.length).toEqual(1);
  })


  it('should update the signer', () => {
    let event = {
      detail: {
        activeKey: "014d8c494ae85bda4288d0ed02c6bb180ec84efd3d7af0ed6ab9092d8757441427",
        isConnected: true,
        isUnlocked: true,
      }
    };

    component.updateSignerStatus(event);
    expect(component.signerStatus.activeKey).toEqual("014d8c494ae85bda4288d0ed02c6bb180ec84efd3d7af0ed6ab9092d8757441427");
    expect(component.signerStatus.isConnected).toEqual(true);
    expect(component.signerStatus.isUnlocked).toEqual(true);
  })
  it('should the signer locked', () => {
    let event = {
      detail: {
        activeKey: "014d8c494ae85bda4288d0ed02c6bb180ec84efd3d7af0ed6ab9092d8757441427",
        isConnected: true,
        isUnlocked: false,
      }
    };

    component.updateSignerStatus(event);
    expect(component.signerStatus.activeKey).toEqual("014d8c494ae85bda4288d0ed02c6bb180ec84efd3d7af0ed6ab9092d8757441427");
    expect(component.signerStatus.isConnected).toEqual(true);
    expect(component.signerStatus.isUnlocked).toEqual(false);
  })
  it('should the signer disconnected', () => {
    let event = {
      detail: {
        activeKey: "014d8c494ae85bda4288d0ed02c6bb180ec84efd3d7af0ed6ab9092d8757441427",
        isConnected: false,
        isUnlocked: true,
      }
    };

    component.updateSignerStatus(event);
    expect(component.signerStatus.activeKey).toEqual("014d8c494ae85bda4288d0ed02c6bb180ec84efd3d7af0ed6ab9092d8757441427");
    expect(component.signerStatus.isConnected).toEqual(false);
    expect(component.signerStatus.isUnlocked).toEqual(true);
  })

  it('should the signer event signerInitialState', () => {
    let event = {
      detail: {
        activeKey: "014d8c494ae85bda4288d0ed02c6bb180ec84efd3d7af0ed6ab9092d8757441427",
        isConnected: false,
        isUnlocked: true,
      }
    };

    component.signerInitialState(event);
    expect(component.signerStatus.activeKey).toEqual("014d8c494ae85bda4288d0ed02c6bb180ec84efd3d7af0ed6ab9092d8757441427");
    expect(component.signerStatus.isConnected).toEqual(false);
    expect(component.signerStatus.isUnlocked).toEqual(true);
  })
  it('should the signer event signerLocked', () => {
    let event = {
      detail: {
        activeKey: "014d8c494ae85bda4288d0ed02c6bb180ec84efd3d7af0ed6ab9092d8757441427",
        isConnected: false,
        isUnlocked: true,
      }
    };

    component.signerLocked(event);
    expect(component.signerStatus.activeKey).toEqual("014d8c494ae85bda4288d0ed02c6bb180ec84efd3d7af0ed6ab9092d8757441427");
    expect(component.signerStatus.isConnected).toEqual(false);
    expect(component.signerStatus.isUnlocked).toEqual(true);
  })
  it('should the signer event signerUnlocked', () => {
    let event = {
      detail: {
        activeKey: "014d8c494ae85bda4288d0ed02c6bb180ec84efd3d7af0ed6ab9092d8757441427",
        isConnected: false,
        isUnlocked: true,
      }
    };

    component.signerUnlocked(event);
    expect(component.signerStatus.activeKey).toEqual("014d8c494ae85bda4288d0ed02c6bb180ec84efd3d7af0ed6ab9092d8757441427");
    expect(component.signerStatus.isConnected).toEqual(false);
    expect(component.signerStatus.isUnlocked).toEqual(true);
  })
  it('should the signer event signerConnected', () => {
    let event = {
      detail: {
        activeKey: "014d8c494ae85bda4288d0ed02c6bb180ec84efd3d7af0ed6ab9092d8757441427",
        isConnected: false,
        isUnlocked: true,
      }
    };

    component.signerConnected(event);
    expect(component.signerStatus.activeKey).toEqual("014d8c494ae85bda4288d0ed02c6bb180ec84efd3d7af0ed6ab9092d8757441427");
    expect(component.signerStatus.isConnected).toEqual(false);
    expect(component.signerStatus.isUnlocked).toEqual(true);
  })

  it('should the signer event signedDisconnected', () => {
    let event = {
      detail: {
        activeKey: "014d8c494ae85bda4288d0ed02c6bb180ec84efd3d7af0ed6ab9092d8757441427",
        isConnected: false,
        isUnlocked: true,
      }
    };

    component.signedDisconnected(event);
    expect(component.signerStatus.activeKey).toEqual("014d8c494ae85bda4288d0ed02c6bb180ec84efd3d7af0ed6ab9092d8757441427");
    expect(component.signerStatus.isConnected).toEqual(false);
    expect(component.signerStatus.isUnlocked).toEqual(true);
  })
  it('should the signer event signedTabUpdated', () => {
    let event = {
      detail: {
        activeKey: "014d8c494ae85bda4288d0ed02c6bb180ec84efd3d7af0ed6ab9092d8757441427",
        isConnected: false,
        isUnlocked: true,
      }
    };

    component.signedTabUpdated(event);
    expect(component.signerStatus.activeKey).toEqual("014d8c494ae85bda4288d0ed02c6bb180ec84efd3d7af0ed6ab9092d8757441427");
    expect(component.signerStatus.isConnected).toEqual(false);
    expect(component.signerStatus.isUnlocked).toEqual(true);
  })
  it('should the signer event signedActiveKeyChanged', () => {
    let event = {
      detail: {
        activeKey: "014d8c494ae85bda4288d0ed02c6bb180ec84efd3d7af0ed6ab9092d8757441427",
        isConnected: false,
        isUnlocked: true,
      }
    };

    component.signedActiveKeyChanged(event);
    expect(component.signerStatus.activeKey).toEqual("014d8c494ae85bda4288d0ed02c6bb180ec84efd3d7af0ed6ab9092d8757441427");
    expect(component.signerStatus.isConnected).toEqual(false);
    expect(component.signerStatus.isUnlocked).toEqual(true);
  })


  it('should redirect to qrscanner', () => {
    let navController = fixture.debugElement.injector.get(NavController);
    spyOn(navController, 'navigateForward');
    component.scanQRCode();
    expect(navController.navigateForward).toHaveBeenCalled();
  })
  it('should redirect to generateQRCode', () => {
    let navController = fixture.debugElement.injector.get(NavController);
    spyOn(navController, 'navigateForward');
    component.generateQRCode();
    expect(navController.navigateForward).toHaveBeenCalled();
  })

  // it('should copy to clipboard', async () => {
  //   let utilService = fixture.debugElement.injector.get(UtilsService);
  //   spyOn(utilService, 'presentToast');
  //   component.copyOTP("TEST");
  //   expect((await Clipboard.read()).value).toEqual("TEST");
  //   expect(utilService.presentToast).toHaveBeenCalled();
  // })

  it('should reorder secretcodes', () => {
    let storageService = fixture.debugElement.injector.get(StorageService);
    spyOn(storageService, 'setSecretCodes');
    component.doReorder({ "detail": { "from": 0, "to": 1, complete: () => true } });
    expect(storageService.setSecretCodes).toHaveBeenCalled();

  })

  it('should select menu', () => {
    spyOn(component, 'scanQRCode');
    component.selectMenu("scanqrcode");
    expect(component.scanQRCode).toHaveBeenCalled();

  })
  it('should select menu getblockchain', () => {
    spyOn(component, 'retrieveFromBlockchain');
    component.selectMenu("getblockchain");
    expect(component.retrieveFromBlockchain).toHaveBeenCalled();

  })
  it('should select menu delblockchain', () => {
    spyOn(component, 'syncToBlockchain');
    component.selectMenu("delblockchain");
    expect(component.syncToBlockchain).toHaveBeenCalled();

  })
  it('should select menu syncblockchain', () => {
    spyOn(component, 'syncToBlockchain');
    component.selectMenu("syncblockchain");
    expect(component.syncToBlockchain).toHaveBeenCalled();
  })
  it('should select menu editmode', () => {
    spyOn(component, 'setMode');
    component.selectMenu("editmode");
    expect(component.setMode).toHaveBeenCalled();
  })
  it('should select menu setPassphrase', () => {
    spyOn(component, 'setPassphrase');
    component.selectMenu("setpassphrase");
    expect(component.setPassphrase).toHaveBeenCalled();
  })
  it('should select menu addSecretCode', () => {
    spyOn(component, 'addSecretCode');
    component.selectMenu("addsecretcode");
    expect(component.addSecretCode).toHaveBeenCalled();
  })
  it('should select menu generateqrcode', () => {
    spyOn(component, 'generateQRCode');
    component.selectMenu("generateqrcode");
    expect(component.generateQRCode).toHaveBeenCalled();
  })
  it('should select menu activatesyncblockchain', () => {
    spyOn(component, 'setMode');
    component.selectMenu("activatesyncblockchain");
    expect(component.setMode).toHaveBeenCalled();

  })

  it('should add secret code', () => {
    component.onAddSecretCode({
      data: {
        s: "SECRET",
        n: "NAME"
      }
    });

    expect(component.secretCodes.filter(x => x.s == "SECRET").length).toEqual(1);

  });
  it('should not add secret code', () => {
    component.onAddSecretCode({
      data: {
      }
    });
    expect(component.secretCodes.filter(x => x.s == "SECRET").length).toEqual(0);

  });

  it('should present toast when nothing to be sync', async () => {
    let utilService = fixture.debugElement.injector.get(UtilsService);
    spyOn(utilService, 'presentToast');
    component.syncToBlockchain("add");
    expect(utilService.presentToast).toHaveBeenCalled();
  })
  it('should present toast when too many to be sync', async () => {
    component.secretCodes = [{ "s": "TEST1", "name": "TEST1", "isChecked": true }, { "s": "TEST2", "name": "TEST2", "isChecked": true }, { "s": "TEST3", "name": "TEST3", "isChecked": true }, { "s": "TEST4", "name": "TEST4", "isChecked": true }, { "s": "TEST5", "name": "TEST5", "isChecked": true }, { "s": "TEST6", "name": "TEST6", "isChecked": true }]
    let utilService = fixture.debugElement.injector.get(UtilsService);
    spyOn(utilService, 'presentToast');
    component.syncToBlockchain("add");
    expect(utilService.presentToast).toHaveBeenCalled();
  })
  it('should sync false', async () => {
    component.secretCodes = [{ "s": "TEST1", "name": "TEST1", "isChecked": false }, { "s": "TEST2", "name": "TEST2", "isChecked": false }, { "s": "TEST3", "name": "TEST3", "isChecked": true }, { "s": "TEST4", "name": "TEST4", "isChecked": true }, { "s": "TEST5", "name": "TEST5", "isChecked": true }, { "s": "TEST6", "name": "TEST6", "isChecked": true }]
    let utilService = fixture.debugElement.injector.get(UtilsService);
    let blockchainService = fixture.debugElement.injector.get(BlockchainService);
    spyOn(utilService, 'presentToast');
    spyOn(blockchainService, 'callContract').and.returnValue(Promise.resolve(false));
    component.syncToBlockchain("add");
    expect(blockchainService.callContract).toHaveBeenCalled();
  })
  it('should sync true', async () => {
    component.secretCodes = [{ "s": "TEST1", "name": "TEST1", "isChecked": false }, { "s": "TEST2", "name": "TEST2", "isChecked": false }, { "s": "TEST3", "name": "TEST3", "isChecked": true }, { "s": "TEST4", "name": "TEST4", "isChecked": true }, { "s": "TEST5", "name": "TEST5", "isChecked": true }, { "s": "TEST6", "name": "TEST6", "isChecked": true }]
    let utilService = fixture.debugElement.injector.get(UtilsService);
    let blockchainService = fixture.debugElement.injector.get(BlockchainService);
    spyOn(utilService, 'presentToast');
    spyOn(blockchainService, 'callContract').and.returnValue({} as any);
    component.syncToBlockchain("add");
    expect(blockchainService.callContract).toHaveBeenCalled();
  })
});
