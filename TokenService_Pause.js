const {
    TransferTransaction, TokenPauseTransaction, TokenUnfreezeTransaction,
    Client, TokenInfoQuery,TokenUnpauseTransaction,
    TokenAssociateTransaction,
    Wallet,
    PrivateKey
} = require("@hashgraph/sdk");

require('dotenv').config({ path: '/Users/ayb/mio/code/hedera-cert-workspace/certTasks/.env' });


const account1 = process.env.ACCOUNT_ID1;
const privateKeyAccnt1 = PrivateKey.fromString(process.env.ACCOUNT1_PRIVATE_KEY);

const account3 = process.env.ACCOUNT_ID3;
const privateKeyAccnt3 = PrivateKey.fromString(process.env.ACCOUNT3_PRIVATE_KEY);

const account4 = process.env.ACCOUNT_ID4;
const privateKeyAccnt4 = PrivateKey.fromString(process.env.ACCOUNT4_PRIVATE_KEY);

const tokenId = process.env.TOKEN_ID;

const client = Client.forTestnet();
client.setOperator(account1, privateKeyAccnt1);

const wallet3 = new Wallet( account3,  privateKeyAccnt3 );
const wallet4 = new Wallet( account4,  privateKeyAccnt4 );

async function main() {

// PAUSE ALL TOKEN OEPRATIONS
let tokenPauseTx = await new TokenPauseTransaction()
    .setTokenId(tokenId)
    .freezeWith(client)
    .sign(privateKeyAccnt1);
   let tokenPauseSubmitTx = await tokenPauseTx.execute(client);
   let tokenPauseRx = await tokenPauseSubmitTx.getReceipt(client);
   console.log(`- Token pause: ${tokenPauseRx.status.toString()}`);
  

   // TEST THE TOKEN PAUSE 
   let tokenTransferTx3 = await new TransferTransaction()
   .addTokenTransferWithDecimals(tokenId, account1, -135,2)
   .addTokenTransferWithDecimals(tokenId, account3, 135,2)
   .freezeWith(client)
       .sign(privateKeyAccnt1);
   let tokenTransferSubmit3 = await tokenTransferTx3.execute(client);
   try {
       let tokenTransferRx3 = await tokenTransferSubmit3.getReceipt(client);
       console.log(
           `\n-transfer Account1->Account 3 status: ${tokenTransferRx3.status.toString()} \n`
       );
   } catch {
       // TOKEN QUERY TO CHECK PAUSE
       tokenInfo = await tQueryFcn();
       console.log(
           `- Fungible CTT transfer unsuccessful: Token ${tokenId.toString()} is paused (${tokenInfo.pauseStatus.toString()})`
       );
   }

   // UNPAUSE 
   let tokenUnpauseTx = await new TokenUnpauseTransaction()
   .setTokenId(tokenId)
   .freezeWith(client)
   .sign(privateKeyAccnt1);
let tokenUnpauseSubmitTx = await tokenUnpauseTx.execute(client);
let tokenUnpauseRx = await tokenUnpauseSubmitTx.getReceipt(client);
console.log(`- Token unpause: ${tokenUnpauseRx.status.toString()}\n`);

// RETRY TXFER 
let txfer2 = await new TransferTransaction()
   .addTokenTransferWithDecimals(tokenId, account1, -135,2)
   .addTokenTransferWithDecimals(tokenId, account3, 135,2)
   .freezeWith(client)
    .sign(privateKeyAccnt1);

let txferResp = await txfer2.execute(client);    
let xfer = await txferResp
.getReceipt(client);
console.log( "-transfer Account1->Account3 status: " + xfer.status.toString())
   process.exit();
}
async function tQueryFcn() {
   return new TokenInfoQuery().setTokenId(tokenId).execute(client);
}
main()




   
   
   