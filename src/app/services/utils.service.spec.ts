import { TestBed } from '@angular/core/testing';

import { UtilsService } from './utils.service';
import { StorageService } from './storage.service';
import CryptoJS from 'crypto-js';

describe('UtilsService', () => {
  let service: UtilsService;
  let storageService: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilsService);
    storageService = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not decode QRCode', async () => {
    let qrCodeBackup = "WRONGQRCODE";
    let r = await service.decodeQRCodeBackup(qrCodeBackup);
    expect(r).toBeFalse();
  })

  it('should decode QRCode', async () => {

    let data = {
      "publickey": "PUBLICKEY",
      "passphrase": "PASSPHRASE",
      "secretCodes": [{ "s": "ABCDEF", "n": "NAME" }],
      "namedKey": "NAMEDKEY"
    }
    let e = CryptoJS.AES.encrypt(JSON.stringify(data), "qrcodebackup");

    let qrCodeBackup = "bcauthenticator;" + e.toString();
    let r = await service.decodeQRCodeBackup(qrCodeBackup);
    expect(r).toBeTrue();
    let publickey = await storageService.getAccountPublicKey();
    let passphrase = await storageService.getPassphrase();
    let secretCodes = await storageService.getSecretCodes();
    let namedKey = await storageService.getNamedKey();
    expect(publickey).toEqual(data.publickey);
    expect(passphrase).toEqual(data.passphrase);
    expect(namedKey).toEqual(data.namedKey);
  })
});
