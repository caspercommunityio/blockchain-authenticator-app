// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  casperRPC: 'https://rpc.caspercommunity.io?env=testnet', //RPC url to retrieve and send data on the blockchain
  casperEnv: 'casper-test', //casper (for mainnet) or casper-test (for testnet)
  bcGasFeesMin: 0, //minimum fees for the transaction with the blockchain
  bcGasFeesMax: 10, //maximum fees for the transaction with the blockchain
  bcGasFeesAsDefault: 3.5, // default fees for the transaction with the blockchain (can be changed within the app)
  version: "local"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
