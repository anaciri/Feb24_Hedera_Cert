const {
    TokenCreateTransaction,
    TokenSupplyType,
    Client,
    TokenType,
    TokenInfoQuery,
    AccountBalanceQuery, PrivateKey, Wallet
} = require("@hashgraph/sdk");

require('dotenv').config({ path: '/Users/ayb/mio/code/hedera-cert-workspace/certTasks/.env' });

// account decl
const account1 = process.env.ACCOUNT_ID1;
const privateKeyAccnt1 = PrivateKey.fromString(process.env.ACCOUNT1_PRIVATE_KEY);

const account2 = process.env.ACCOUNT_ID2;
const privateKeyAccnt2 = PrivateKey.fromString(process.env.ACCOUNT2_PRIVATE_KEY);

const account3 = process.env.ACCOUNT_ID3;
const privateKeyAccnt3 = PrivateKey.fromString(process.env.ACCOUNT3_PRIVATE_KEY);

const account4 = process.env.ACCOUNT_ID4;
const privateKeyAccnt4 = PrivateKey.fromString(process.env.ACCOUNT4_PRIVATE_KEY);

const client = Client.forTestnet()  
client.setOperator(account1, privateKeyAccnt1);

const supplyUser = new Wallet(
account2, privateKeyAccnt2
)

async function main() {
    //Create the transaction and freeze for manual signing
    const transaction = await new TokenCreateTransaction()
    .setTokenName("Ayoub Token" + Math.random().toString())
    .setTokenSymbol("AYB"+ Math.random().toString())
    .setTokenType(TokenType.FungibleCommon)
    .setSupplyType(TokenSupplyType.Finite)
    .setMaxSupply(50000)
    .setDecimals(2)
    .setInitialSupply(35050)
    .setPauseKey(privateKeyAccnt1)
    .setTreasuryAccountId(account1)
    .setAdminKey(privateKeyAccnt1)
    .setSupplyKey(supplyUser.publicKey)
    .freezeWith(client);

     //Sign the transaction with the client, who is set as admin and treasury account
    const signTx =  await transaction.sign(privateKeyAccnt1);

    //Submit to a Hedera network
    const txResponse = await signTx.execute(client);

    //Get the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the token ID from the receipt
    const tokenId = receipt.tokenId;

    console.log("The new token ID is " + tokenId);

    //Sign with the client operator private key, submit the query to the network and get the token supply

    const name = await queryTokenFunction("name", tokenId);
    const symbol = await queryTokenFunction("symbol", tokenId);
    const tokenSupply = await queryTokenFunction("totalSupply", tokenId);
    console.log('The total supply of the ' + name + ' token is ' + tokenSupply + ' of ' + symbol);

    //Create the query
    const balanceQuery = new AccountBalanceQuery()
        .setAccountId(account1);

    //Sign with the client operator private key and submit to a Hedera network
    const tokenBalance = await balanceQuery.execute(client);

    console.log("The balance of the user is: " + tokenBalance.tokens.get(tokenId));

    process.exit();
}

async function queryTokenFunction(functionName, tokenId) {
    //Create the query
    const query = new TokenInfoQuery()
        .setTokenId(tokenId);

    //Sign with the client operator private key, submit the query to the network and get the token supply
    
    console.log("retrieveing the " + functionName);
    const body = await query.execute(client);

    //Sign with the client operator private key, submit the query to the network and get the token supply
    let result;
    if (functionName === "name") {
        result = body.name;
    } else if(functionName ==="symbol") {
        result = body.symbol;
    } else if(functionName === "totalSupply") {
        result = body.totalSupply;
    } else {
        return;
    }
    return result
}

main();
