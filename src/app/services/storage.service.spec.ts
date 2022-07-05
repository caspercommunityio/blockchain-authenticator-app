import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store namedkey', async () => {
    await service.setNamedKey("TEST");
    let r = await service.getNamedKey();
    expect(r).toEqual("TEST");
  });

  it('should store passphrase', async () => {
    await service.setPassphrase("TESTPASSPHRASE");
    let r = await service.getPassphrase();
    expect(r).toEqual("TESTPASSPHRASE");
  });

  it('should store secretcodes', async () => {
    await service.setSecretCodes([{ "secretCode": "value", "name": "TEST" }]);
    let r = await service.getSecretCodes();
    expect(r).toHaveSize(1);
  });

  it('should store public key', async () => {
    await service.setAccountPublicKey("TESTPUBLICKEY");
    let r = await service.getAccountPublicKey();
    expect(r).toEqual("TESTPUBLICKEY");
  });

  it('should store fees', async () => {
    await service.setBlockchainFees(5);
    let r = await service.getBlockchainFees();
    expect(r).toEqual(5);
  });

  it('should check passphrase (wrong)', async () => {
    let passphrase = "toosimple";
    expect(service.checkPassphrase(passphrase)).toBeFalse();
  })

  it('should check passphrase (OK)', async () => {
    let passphrase = "Com!plex1";
    expect(service.checkPassphrase(passphrase)).toBeTrue();
  })

  it('should add secret codes to empty list', async () => {
    service.addSecretCode({ "secretCode": "TEST", "name": "TEST" });
    spyOn(service, "getSecretCodes").and.returnValue(Promise.resolve([{ "secretCode": "TEST", "name": "TEST" }]));
    let r = await service.getSecretCodes();
    expect(r.length).toEqual(1);
  })
  it('should add secret codes to existing list', async () => {
    spyOn(service, "getSecretCodes").and.returnValue(Promise.resolve([{ "secretCode": "TEST", "name": "TEST" }]));
    service.addSecretCode({ "secretCode": "TEST2", "name": "TEST2" });
    let r = await service.getSecretCodes();
    expect(r.length).toEqual(2);
  })
  it('should update secret name to existing item', async () => {
    spyOn(service, "getSecretCodes").and.returnValue(Promise.resolve([{ "secretCode": "TEST", "name": "TEST" }]));
    service.addSecretCode({ "secretCode": "TEST", "name": "TEST2" });
    let r = await service.getSecretCodes();
    let item = r.filter(x => x.secretCode == 'TEST')[0];
    expect(item.name).toEqual("TEST2");
  })
  it('should generate passphrase', async () => {
    expect(service.generatePassphrase()).toBeDefined();
  })


});
