const { 
    Wallet,
    LocalProvider,
    PrivateKey,
    AccountBalanceQuery,
    TransactionId,
    AccountAllowanceApproveTransaction,
    TransferTransaction,
    Hbar,
} = require ("@hashgraph/sdk");

require('dotenv').config({ path: '/Users/ayb/mio/code/hedera-cert-workspace/certTasks/.env' });

// account decl
/*
const account1 = process.env.ACCOUNT_ID1;
const account2 = process.env.ACCOUNT_ID2;
const account3 = process.env.ACCOUNT_ID3;
const account4 = process.env.ACCOUNT_ID4;

const privateKeyAccnt1 = PrivateKey.fromString(process.env.ACCOUNT1_PRIVATE_KEY);
const privateKeyAccnt2 = PrivateKey.fromString(process.env.ACCOUNT2_PRIVATE_KEY);
*/
const client = Client.forTestnet()
client.setOperator(account1, privateKeyAccnt1);

async function main() {

    const wallet = new Wallet(
        process.env.MY_ACCOUNT_ID,
        process.env.MY_PRIVATE_KEY,
        new LocalProvider()
    );

    console.log("Generating accounts for example...");

    const account1 = PrivateKey.fromString(process.env.ACCOUNT1_PRIVATE_KEY);
    const account2 = PrivateKey.fromString(process.env.ACCOUNT2_PRIVATE_KEY);

    const account1Id = process.env.ACCOUNT1_ID;
    const account2Id = process.env.ACCOUNT2_ID;
    const account3Id = process.env.ACCOUNT3_ID;
    const account4Id = process.env.ACCOUNT4_ID;
   

    await printBalances(wallet, account1Id, account2Id, account3Id,account4Id);

    console.log("Approving an allowance of 20 Hbar with owner account1 and spender account2");
    await (
        await (
            await (
                await (
                    await new AccountAllowanceApproveTransaction()
                        .approveHbarAllowance(account1Id, account2Id, new Hbar(20))
                        .freezeWithSigner(wallet)
                ).sign(account1)
            ).signWithSigner(wallet)
        ).executeWithSigner(wallet)
    ).getReceiptWithSigner(wallet);

   
    try {
        console.log(
            "Attempting to transfer 20 Hbar from account2 to account4 using account1 allowance."
        );
        console.log(
            "This should fail, because there is no Hbar left in account2's allowance."
        );

        await (
            await (
                await (
                    await (
                        await new TransferTransaction()
                            .addApprovedHbarTransfer(
                                account1Id,
                                new Hbar(20).negated()
                            )
                            .addHbarTransfer(account2Id, new Hbar(2))
                            .setTransactionId(TransactionId.generate(account2Id))
                            .freezeWithSigner(wallet)
                    ).sign(account2)
                ).signWithSigner(wallet)
            ).executeWithSigner(wallet)
        ).getReceiptWithSigner(wallet);



   
    //#########################

    try {
        console.log(
            "Attempting to transfer 20 Hbar from account2 to account4 using account1 allowance."
        );
        console.log(
            "This should fail, because there is no Hbar left in account2's allowance."
        );

        await (
            await (
                await (
                    await (
                        await new TransferTransaction()
                            .addApprovedHbarTransfer(
                                account1Id,
                                new Hbar(20).negated()
                            )
                            .addHbarTransfer(account2Id, new Hbar(2))
                            .setTransactionId(TransactionId.generate(account2Id))
                            .freezeWithSigner(wallet)
                    ).sign(account2)
                ).signWithSigner(wallet)
            ).executeWithSigner(wallet)
        ).getReceiptWithSigner(wallet);

        console.log("The transfer succeeded.  This should not happen.");
    } catch (error) {
        console.log("The transfer failed as expected.");
        console.log(/** @type {Error} */ (error).message);
    }

  
}
void main();