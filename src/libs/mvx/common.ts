import { sendTransactions } from 'helpers';

// if tx is not a Transaction instance but a plain object, "transformAndSignTransactions" is applied to the object so you don't need to call "refreshAccount" for sync nonce
export async function elrondDappSendTransactions(txs: any, txName: string) {
  const { sessionId, error } = await sendTransactions({
    transactions: txs,
    transactionsDisplayInfo: {
      processingMessage: `Processing ${txName} Request`,
      errorMessage: `Error occured during ${txName} Request`,
      successMessage: `${txName} Request Successful`,
    },
    redirectAfterSign: false,
  });

  return { sessionId, error };
}
