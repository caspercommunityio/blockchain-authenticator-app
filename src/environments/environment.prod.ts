export const environment = {
  production: true,
  casperRPC: 'https://rpc.caspercommunity.io/',
  casperEnv: 'casper',
  bcGasFeesMin: 0, //minimum fees for the transaction with the blockchain
  bcGasFeesMax: 10, //maximum fees for the transaction with the blockchain
  bcGasFeesAsDefault: 5, // default fees for the transaction with the blockchain (can be changed within the app)
  version: "bdbcda8" // Version of the app, autogenerated when calling the build --prod
};
