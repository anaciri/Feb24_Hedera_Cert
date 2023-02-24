const {
    TopicCreateTransaction,
    TopicMessageSubmitTransaction,
    Client,
    Wallet,
    PrivateKey
} = require("@hashgraph/sdk");

require('dotenv').config({ path: '/Users/ayb/mio/code/hedera-cert-workspace/certTasks/.env' });

const account1 = process.env.ACCOUNT_ID1;
const privateKeyAccnt1 = PrivateKey.fromString(process.env.ACCOUNT1_PRIVATE_KEY);

const client = Client.forTestnet()  
client.setOperator(account1, privateKeyAccnt1);


async function main() {
    //Create a new topic
    let txResponse = await new TopicCreateTransaction().execute(client);

    //Get the topic id
    let receipt = await txResponse.getReceipt(client);
    let topicId = receipt.topicId;

    //Log the topic ID
    console.log(`Your topic ID is: ${topicId}`);

    // Wait 5 seconds between consensus topic creation and subscription
    await new Promise((resolve) => setTimeout(resolve, 5000));

    let sendResponse = await new TopicMessageSubmitTransaction({
        topicId: topicId,
        message: Date.now().toString(),
    }).execute(client);

    //Get the receipt of the transaction
    const getReceipt = await sendResponse.getReceipt(client);
    console.log("The message transaction status: " + getReceipt.status.toString());

    process.exit();
}


void main();