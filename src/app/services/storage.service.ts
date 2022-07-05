import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  /**
   * async setSecretCodes - Store the secrect codes
   *
   * @param  {type} data description
   * @return {type}      description
   */
  async setSecretCodes(data) {
    await Storage.set({
      key: 'secretcodes',
      value: JSON.stringify(data),
    });
  }

  /**
   * async setBlockchainFees - Store the blockchain fees to apply to a transaction
   *
   * @param  {type} data description
   * @return {type}      description
   */
  async setBlockchainFees(data) {
    await Storage.set({
      key: 'blockchainfees',
      value: data,
    });
  }

  /**
   * async setNamedKey - Store the named key
   *
   * @param  {type} data description
   * @return {type}      description
   */
  async setNamedKey(data) {
    await Storage.set({
      key: 'namedkey',
      value: data,
    });
  }

  /**
   * async setPassphrase - Store the passphrase to encode/decode the data
   *
   * @param  {type} data description
   * @return {type}      description
   */
  async setPassphrase(data) {
    await Storage.set({
      key: 'passphrase',
      value: data,
    });
  }

  /**
   * async setAccountPublicKey - Store the public key returned by the wallet
   *
   * @param  {type} data description
   * @return {type}      description
   */
  async setAccountPublicKey(data) {
    await Storage.set({
      key: 'publickey',
      value: data,
    });
  }

  /**
   * async getSecretCodes - Return the stored secret codes
   *
   * @return {type}  description
   */
  async getSecretCodes() {
    const { value } = await Storage.get({
      key: 'secretcodes'
    });
    if (value == null) {
      return [];
    }
    return JSON.parse(value);
  }

  /**
   * async getPassphrase - Return the stored passphrase
   *
   * @return {type}  description
   */
  async getPassphrase() {
    const { value } = await Storage.get({
      key: 'passphrase'
    });
    if (value == null) {
      let passphrase = this.generatePassphrase();
      await this.setPassphrase(passphrase);
      return passphrase;
    }
    return value;
  }

  /**
   * async getBlockchainFees - Return the stored blockchain fees
   *
   * @return {type}  description
   */
  async getBlockchainFees() {
    const { value } = await Storage.get({
      key: 'blockchainfees'
    });
    if (value == null) {
      return environment.bcGasFeesAsDefault;
    }
    return parseFloat(value);
  }

  /**
   * async getNamedKey - Return the stored named key
   *
   * @return {type}  description
   */
  async getNamedKey() {
    const { value } = await Storage.get({
      key: 'namedkey'
    });
    if (value == null) {
      return 'blockchain-authenticator';
    }
    return value;
  }


  /**
   * async getAccountPublicKey - Return the stored public key
   *
   * @return {type}  description
   */
  async getAccountPublicKey() {
    const { value } = await Storage.get({
      key: 'publickey'
    });
    if (value == null) {
      return "";
    }
    return value;
  }


  /**
   * async addSecretCode - Add a secret code to the existing list
   *
   * @param  {type} data description
   * @return {type}      description
   */
  async addSecretCode(data) {
    let secretCodes = await this.getSecretCodes();
    if (secretCodes.filter(x => x.secretCode == data.secretCode).length == 0) {
      data.sync = false;
      secretCodes.push(data);
    } else {
      secretCodes.filter(x => x.secretCode == data.secretCode).map(x => x.name = data.name)
    }
    await this.setSecretCodes(secretCodes);
  }


  /**
   * generatePassphrase - Generate a random valid passphrase
   *
   * @return {type}  description
   */
  generatePassphrase() {
    let passphrase = '';
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

    for (let i = 1; i <= 16; i++) {
      var char = Math.floor(Math.random() * str.length + 1);
      passphrase += str.charAt(char)
    }
    if (!this.checkPassphrase(passphrase)) {
      return this.generatePassphrase();
    }
    return passphrase;
  }

  /**
   * checkPassphrase - Check that a passphrase has the correct format
   *
   * @param  {type} passphrase description
   * @return {type}            description
   */
  checkPassphrase(passphrase) {
    var decimal = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    if (passphrase.match(decimal)) {
      return true;
    }
    else {
      return false;
    }
  }


}
