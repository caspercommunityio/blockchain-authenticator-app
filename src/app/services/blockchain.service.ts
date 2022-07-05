import { Injectable, HostListener } from '@angular/core';
import { DeployUtil, RuntimeArgs, CLString, CLPublicKey, Signer, CasperClient, CLAccountHash, CLList, CasperServiceByJsonRPC } from "casper-js-sdk";
import { from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service'
@Injectable({
  providedIn: 'root'
})
export class BlockchainService {


  constructor(private storageService: StorageService) { }


  /**
   * async storeInBlockchain - description
   *
   * @param  {type} method description
   * @param  {type} data   description
   * @return {type}        description
   */
  async callContract(method, data) {
    const client = new CasperClient(environment.casperRPC);
    const activeKey = await Signer.getActivePublicKey();
    const activePublicKey = CLPublicKey.fromHex(activeKey);

    const clKeyParam = new CLAccountHash(activePublicKey.toAccountHash());

    const fees: number = await this.storageService.getBlockchainFees();
    const namedKey: string = await this.storageService.getNamedKey();

    let dataCLString = [];
    data.map(x => dataCLString.push(new CLString(x)));

    let listToDeploy = null;

    if (data.length == 0) {
      listToDeploy = new CLList<CLString>([new CLString("")]);
      listToDeploy.remove(0);
    } else {
      listToDeploy = new CLList<CLString>(dataCLString);
    }

    const args = RuntimeArgs.fromMap({
      "keys": listToDeploy,
      "method": new CLString(method),
      "named-key": new CLString(namedKey)
    });
    let contents;

    await fetch('assets/contract.wasm')
      .then(response => response.body)
      .then(rb => {
        const reader = rb.getReader();

        return new ReadableStream({
          start(controller) {
            // The following function handles each data chunk
            function push() {
              // "done" is a Boolean and value a "Uint8Array"
              reader.read().then(({ done, value }) => {
                // If there is no more data to read
                if (done) {
                  controller.close();
                  return;
                }
                // Get the data and send it to the browser via the controller
                controller.enqueue(value);
                // Check chunks by logging to the console
                contents = value;
                push();
              })
            }

            push();
          }
        });
      })
      .then(stream => {
        // Respond with our stream
        return new Response(stream, { headers: { "Content-Type": "text/html" } }).text();
      })



    let sessionWasm = new Uint8Array(contents);

    const session = DeployUtil.ExecutableDeployItem.newModuleBytes(
      sessionWasm,
      args
    );

    const payment = DeployUtil.standardPayment(
      (fees * 1000000000)
    );

    const deploy = DeployUtil.makeDeploy(
      new DeployUtil.DeployParams(activePublicKey, environment.casperEnv),
      session,
      payment
    );

    let signedDeployJSON;
    try {
      signedDeployJSON = await Signer.sign(DeployUtil.deployToJson(deploy), activeKey, activeKey);
    } catch (err) {
      alert(err.message);
      return false;
    }
    let signedDeploy = DeployUtil.deployFromJson(signedDeployJSON).unwrap();
    await client.putDeploy(signedDeploy);
    window.open("https://" + (environment.casperEnv == 'casper-test' ? 'testnet.' : '') + "cspr.live/deploy/" + signedDeployJSON.deploy.hash, "_blank");
    console.log("Deploy Hash", signedDeployJSON.deploy.hash)
    return signedDeploy;

  }



  /**
   * async retrieveFromBlockchain - Return the values containing the encrypted data. If there is an error or something like that, return an empty list.
   *
   * @param  {secretCodesKey} method The identification of the property containing the data
   */
  retrieveData(secretCodesKey): Observable<any> {
    const rpc = new CasperServiceByJsonRPC(environment.casperRPC);
    let activePublicKey = undefined;
    let stateRootHash = "";
    return from(this.storageService.getAccountPublicKey()).pipe(switchMap(activeKey => {
      activePublicKey = CLPublicKey.fromHex(activeKey);
      return rpc.getStateRootHash("");
    }), switchMap(r => {
      stateRootHash = r;
      return from(rpc.getBlockState(stateRootHash, activePublicKey.toAccountHashStr(), []))
    }), switchMap((r: any) => {
      let namedKey = r.Account.namedKeys.filter(x => x.name == secretCodesKey);
      if (namedKey.length == 1) {
        return rpc.getBlockState(stateRootHash, namedKey[0].key, []);
      } else {
        return of({ "result": "error" });
      }
    }), map((x: any) => {
      if (x.result == "error") {
        return [];
      } else {
        let result = [];
        x.CLValue.data.map(x => result.push(x.data));
        return result;
      }
    }));
  }


}
