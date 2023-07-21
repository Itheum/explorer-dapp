import qs from "qs";
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

export function getMessageSignatureFromWalletUrl(): string {
  const url = window.location.search.slice(1);
  // console.info("getMessageSignatureFromWalletUrl(), url:", url);

  const urlParams = qs.parse(url);
  const status = urlParams.status?.toString() || "";
  const expectedStatus = "signed";

  if (status !== expectedStatus) {
    throw new Error("No signature");
  }

  const signature = urlParams.signature?.toString() || "";
  return signature;
}
