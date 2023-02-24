const {
    Client,
    ContractFunctionParameters,
    ContractExecuteTransaction,
    PrivateKey,
} = require("@hashgraph/sdk");
require('dotenv').config({ path: '/Users/ayb/mio/code/hedera-cert-workspace/certTasks/.env' });

const account1 = process.env.ACCOUNT_ID1;
const privateKeyAccnt1 = PrivateKey.fromString(process.env.ACCOUNT1_PRIVATE_KEY);

const client = Client.forTestnet()  
client.setOperator(account1, privateKeyAccnt1);

const Web3 = require('web3');
const web3 = new Web3;

const contractId = process.env.CONTRACT_ID;


async function main() {

    //create contract invocation of function 1 tx 
    const contractExecTx = await new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100000)
        //Set the contract function to call
        .setFunction("function1", new ContractFunctionParameters().addUint16(4).addUint16(3));

        // submit and retrieve record
    const submitExecTx = await contractExecTx.execute(client);
    const receipt = await submitExecTx.getReceipt(client);
    console.log("The transaction status is " + receipt.status.toString());
    // get record contains the output of the function and events
    const record = await submitExecTx.getRecord(client);

    // decode result using ABI 
    let func1Res = decodeFunctionResult("function1", record.contractFunctionResult.bytes);
    console.log("Decoded ABI output function1: " + func1Res.result)

    // ------ function 2
    //create contract invocation of function 1 tx 
    const contractExecTx2 = await new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100000)
        //Set the contract function to call
        .setFunction("function2", new ContractFunctionParameters().addUint16(func1Res.result));

        // submit and retrieve record
    const submitExecTx2 = await contractExecTx2.execute(client);
    const receipt2 = await submitExecTx2.getReceipt(client);
    console.log("The transaction status is " + receipt2.status.toString());
    // get record contains the output of the function and events
    const record2 = await submitExecTx2.getRecord(client);

    // decode result using ABI 
    let func2res = decodeFunctionResult("function2", record2.contractFunctionResult.bytes);
    console.log("Decoded ABI output function2: " + func2res.result)

    process.exit();
}

// ABI decoder
function decodeFunctionResult(functionName, resultAsBytes) {
    const abiFile = require("/Users/ayb/mio/code/hedera-cert-workspace/certTasks/CertificationC1.json");
    abi = abiFile.abi;
    const functionAbi = abi.find((func) => func.name === functionName);
    const functionOutput = functionAbi.outputs;
    const resultHex = "0x".concat(Buffer.from(resultAsBytes).toString("hex"));
    const result = web3.eth.abi.decodeParameters(functionOutput, resultHex);
    return result;
}

main();


