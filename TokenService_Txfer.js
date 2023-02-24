const {
    TransferTransaction, TokenPauseTransaction, TokenUnfreezeTransaction,
    Client,
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

// ----- ASSOCIATE ACCOUNTS 3,4
    let associateWallet3Tx = await new TokenAssociateTransaction()
        .setAccountId(wallet3.accountId)
        .setTokenIds([tokenId])
        .freezeWith(client)
        .sign(privateKeyAccnt3)
    
    let assocWallet3TxResp = await associateWallet3Tx.execute(client);
    let receipt3 = await assocWallet3TxResp.getReceipt(client);
    console.log(`- Token association with the users account 3: ${receipt3.status} \n`);

    //--
    let associateWallet4Tx = await new TokenAssociateTransaction()
    .setAccountId(wallet4.accountId)
    .setTokenIds([tokenId])
    .freezeWith(client)
    .sign(privateKeyAccnt4)

let assocWallet4TxResp = await associateWallet4Tx.execute(client);
let receipt4 = await assocWallet4TxResp.getReceipt(client);
console.log(`- Token association with the users account 4: ${receipt4.status} \n`);

 // ------- ASSOCIATION COMPLETE

//Create the transfer transaction to account3
 const transaction3 = await new TransferTransaction()
    .addTokenTransferWithDecimals(tokenId, account1, -2525,2)
    .addTokenTransferWithDecimals(tokenId, wallet3.accountId, 2525,2)
    .freezeWith(client);

    //Sign with the sender account private key
    const signTx3 =  await transaction3.sign(privateKeyAccnt1);
    const txResponse3 = await signTx3.execute(client);

    const rct3 = await txResponse3.getReceipt(client);
    let transactionStatus = rct3.status;

    console.log("The transaction consensus status to Account3" +transactionStatus.toString());

    //Create the transfer transaction to account4
 const transaction4 = await new TransferTransaction()
 .addTokenTransferWithDecimals(tokenId, account1, -2525,2)
 .addTokenTransferWithDecimals(tokenId, wallet4.accountId, 2525,2)
 .freezeWith(client);

 //Sign with the sender account private key
 const signTx4 =  await transaction4.sign(privateKeyAccnt1);
 const txResponse4 = await signTx4.execute(client);

 const rct4 = await txResponse4.getReceipt(client);
 transactionStatus = rct4.status;

 console.log("The transaction consensus status to Account4" +transactionStatus.toString());


    process.exit();
}

main();
