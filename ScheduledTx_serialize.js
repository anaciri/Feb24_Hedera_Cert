const {
    TokenCreateTransaction, TransferTransaction, AccountId,
    Client,  
    ScheduleCreateTransaction,
    TokenSupplyType,
    PrivateKey,
    AccountBalanceQuery, CustomRoyaltyFee, Hbar
} = require("@hashgraph/sdk");

require('dotenv').config({ path: '/Users/ayb/mio/code/hedera-cert-workspace/certTasks/.env' });

// account decl

const account1 = process.env.ACCOUNT_ID1;
const privateKeyAccnt1 = PrivateKey.fromString(process.env.ACCOUNT1_PRIVATE_KEY);

const account2 = process.env.ACCOUNT_ID2;
const privateKeyAccnt2 = PrivateKey.fromString(process.env.ACCOUNT2_PRIVATE_KEY);

const client = Client.forTestnet()
client.setOperator(account1, privateKeyAccnt1);


async function main() {

    const nodeId = [];
    nodeId.push(new AccountId(3));    
    
    const transferTransaction = new TransferTransaction()
        .addHbarTransfer(account1, new Hbar(-10))
        .addHbarTransfer(account2, new Hbar(10))
        .schedule()
        .setScheduleMemo("Febr Scheduled Tx!!")
        .setNodeAccountIds(nodeId);

    const transaction = await transferTransaction.freezeWith(client);

    // encode 1
    const txBinary = transferTransaction.toBytes();
    const txBase64 =  Buffer.from(txBinary).toString('base64');
    console.log("Base64 endoded trx: " + txBase64)


/*
//Create a transaction to schedule
const transaction = new TransferTransaction()
     .addHbarTransfer(account1, new Hbar(-2))
     .addHbarTransfer(account2, new Hbar(2));

 //Schedule a transaction 
 const nodeId = [];
 nodeId.push(new AccountId(3));
 const scheduleTransaction = await new ScheduleCreateTransaction()
     .setScheduledTransaction(transaction)
     .setScheduleMemo("SchdTrx!!"+Math.random().toString())
     .setAdminKey(privateKeyAccnt1)
     .setNodeAccountIds(nodeId)
     .freezeWith(client)  
     //.execute(client);

// Convert the scheduled transaction ID to a byte array
const scheduledTxIdBytes = scheduleTransaction.toBytes();
// Encode the byte array to Base64
const scheduledTxIdBase64 = Buffer.from(scheduledTxIdBytes).toString('base64');
// Log the Base64-encoded scheduled transaction ID
console.log("Serialized and Base64-encoded scheduled transaction ID: " + scheduledTxIdBase64);

*/

 process.exit();
}

main();