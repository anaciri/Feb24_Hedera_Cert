const {
    Client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery
  } = require("@hashgraph/sdk");
  require("dotenv").config();
  
  const TOP_ACCOUNT_BALANCE = 1500
  const INITIAL_BALANCE = 400
  
  async function main() {
      //const myAccountId = "0.0.4061";
      //const myPrivateKey = "70b86ec7c816795d896e64ddc8ede105924510d45ab38afe11188c034ba95931edbfb647cfcfa4b600f96efcf6a50d84a2a8a287b6e919033a6457f3f725b211";
      const myAccountId = process.env.MY_ACCOUNT_ID;
      const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
      const accounts = [];
  
      const client = Client.forTestnet();
      client.setOperator(myAccountId,myPrivateKey)
  
      for (let i = 1; i <= 5; i++) {
        // Generate a new keypair for the account
        const privateKey =  PrivateKey.generateED25519();
        const publicKey = privateKey.publicKey;
        let initBalance = INITIAL_BALANCE
        if ( i < 2) { initBalance = TOP_ACCOUNT_BALANCE}
        // Create the account transaction
        let transaction = new AccountCreateTransaction()
          .setKey(publicKey)
          .setInitialBalance(initBalance)
          .setTransactionMemo(`Creating Account${i}`)
    
        // Submit the transaction to the network
        const response = await transaction.execute(client);
      
        // Get the new account ID
        let receipt = await response.getReceipt(client);
        const newAccountId = receipt.accountId.toString();
        
        accounts.push({
          accountId: newAccountId,
          privateKey: privateKey,
          publicKey: publicKey
        });
      }
      
      // Print the account information
    console.log("Accounts:");
    accounts.forEach((account, i) => {
      console.log(`ACCOUNT_ID${i + 1} = ${account.accountId}`);
      console.log(`ACCOUNT${i + 1}_PRIVATE_KEY = ${account.privateKey.toString()}`);
      console.log(`ACCOUNT${i +1}_PUBLIC_KEY = ${account.privateKey.toString()}\n`);
    });
  
  /*----> Verify the account balance
    const myaccountBal = await new AccountBalanceQuery().setAccountId(myAccountId).execute(client)
    console.log("MyAccount Balance: " + myaccountBal + "\n")
  //*/ 
    let accBal = await new AccountBalanceQuery().setAccountId(accounts[0].accountId).execute(client)
    console.log("Balance: " + accounts[0].accountId +  accBal + "\n")
    accBal = await new AccountBalanceQuery().setAccountId(accounts[4].accountId).execute(client)
    console.log("Balance: " + accounts[4].accountId +  accBal + "\n")
    
      process.exit();
    }
          
  void main();
      
     