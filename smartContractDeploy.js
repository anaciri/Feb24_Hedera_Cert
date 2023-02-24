const {
    Client,
    FileCreateTransaction,
    ContractCreateTransaction,
    PrivateKey,
    ContractFunctionParameters} = require("@hashgraph/sdk");

require('dotenv').config({ path: '/Users/ayb/mio/code/hedera-cert-workspace/certTasks/.env' });

const account1 = process.env.ACCOUNT_ID1;
const privateKeyAccnt1 = PrivateKey.fromString(process.env.ACCOUNT1_PRIVATE_KEY);

const client = Client.forTestnet()  
client.setOperator(account1, privateKeyAccnt1);


async function main() {
    let jsonfile = require("/Users/ayb/mio/code/hedera-cert-workspace/certTasks/CertificationC1.json");
    let abi = jsonfile.abi
    let sabi = JSON.stringify(abi)
    const bytecode = jsonfile.bytecode;

    //Create a file on Hedera and store the hex-encoded bytecode
    const fileCreateTx = new FileCreateTransaction().setContents(bytecode);
    const submitTx = await fileCreateTx.execute(client);

    //Get the receipt of the file create transaction
    const fileReceipt = await submitTx.getReceipt(client);

    //Get the file ID from the receipt
    const bytecodeFileId = fileReceipt.fileId;

    //Log the file ID
    console.log("The smart contract byte code file ID is " + bytecodeFileId)

    // Instantiate the contract instance
    const contractTx = await new ContractCreateTransaction()
        .setBytecodeFileId(bytecodeFileId)
//        .setConstructorParameters(new ContractFunctionParameters().addString("Hello from Hedera!"))
        .setGas(100000)
        //Provide the constructor parameters for the contract
//        .setConstructorParameters(new ContractFunctionParameters().addString("Hello from Hedera!"));

    //Submit the transaction to the Hedera test network
    const contractResponse = await contractTx.execute(client);
    const contractReceipt = await contractResponse.getReceipt(client);

    const newContractId = contractReceipt.contractId;

    //Log the smart contract ID
    console.log("The smart contract ID is " + newContractId);

    process.exit();
}

main();


