const {
    TokenCreateTransaction, TransferTransaction,TransactionId, ScheduleSignTransaction,
    Client,  
    ScheduleCreateTransaction,
    TokenSupplyType,
    PrivateKey,
    AccountBalanceQuery, CustomRoyaltyFee, Hbar, PublicKey
} = require("@hashgraph/sdk");

require('dotenv').config({ path: '/Users/ayb/mio/code/hedera-cert-workspace/certTasks/.env' });

// account decl
const account1 = process.env.ACCOUNT_ID1;
const account2 = process.env.ACCOUNT_ID2;

const privateKeyAccnt1 = PrivateKey.fromString(process.env.ACCOUNT1_PRIVATE_KEY);
const publicKeyBytes = privateKeyAccnt1.publicKey.toBytes();
// Create a new PublicKey instance from the raw bytes
//const publicKey = PublicKey.fromBytes(publicKeyBytes);

//const publicKeyAccnt1 = PublicKey.fromString(process.env.ACCOUNT1_PUBLIC_KEY); 

const privateKeyAccnt2 = PrivateKey.fromString(process.env.ACCOUNT2_PRIVATE_KEY);

const client = Client.forTestnet()
client.setOperator(account1, privateKeyAccnt1);

const serializedTrx = process.env.SERIALIZED_TX;


async function main() {
 
// Deserialize the Base64-encoded scheduled transaction ID to a TransactionId object
const scheduledTxIdBytes = Buffer.from(serializedTrx, 'base64');
const deSerializedTx = TransferTransaction.fromBytes(scheduledTxIdBytes);  
const signedTransaction1 = deSerializedTx.addSignature(publicKeyAccnt1, privateKeyAccnt1.signTransaction(deSerializedTx));

const txResponse = await signedTransaction1.execute(client);
const receipt = await txResponse.getReceipt(client);

console.log(`TX ${txResponse.transactionId.toString()} status: ${receipt.status}`);

 //Get the schedule ID
 console.log("Deserialized trx status " + receipt.status.toString());
 console.log("The schedule ID is " + receipt.scheduleId);

     
 process.exit();
}

main();
