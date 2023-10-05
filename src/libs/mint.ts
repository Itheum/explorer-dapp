import { NftMinter } from "@itheum/sdk-mx-data-nft/out";
import { DeployedContract, Factory } from "@itheum/sdk-mx-enterprise/out";
import { Account, Address } from "@multiversx/sdk-core/out";
import { ApiNetworkProvider } from "@multiversx/sdk-network-providers/out";
import { UserSecretKey, UserSigner } from "@multiversx/sdk-wallet/out";
import * as fs from "fs";

const pemFilePath2 = "../wallet2.pem"; // this is your "admin" wallet that has the rights to "mint"
const networkProvider = new ApiNetworkProvider("https://devnet-api.multiversx.com", {
  timeout: 10000,
});
const nftMinterDeployerPem = fs.readFileSync(pemFilePath2);
const nftMinterDeployer = UserSecretKey.fromPem(nftMinterDeployerPem.toString());
const nftMinterDeployerAddress = nftMinterDeployer.generatePublicKey().toAddress();
const nftMinterDeployerSigner = new UserSigner(nftMinterDeployer);

async function main() {
  // Sync your account
  let nftMinterDeployerAccount = new Account(nftMinterDeployerAddress);
  let nftMinterDeployerAccountOnNetwork = await networkProvider.getAccount(nftMinterDeployerAddress);
  nftMinterDeployerAccount.update(nftMinterDeployerAccountOnNetwork);

  // Initialize the Itheum Factory
  const factory = new Factory("devnet");

  // Check your deployed contract address
  const deployedContract: DeployedContract[] = await factory.viewAddressContracts(nftMinterDeployerAddress);
  console.log("Deployed contract: ", deployedContract);

  // Initialize the NFT Minter
  const deployedMinterContractAddress = new Address(deployedContract[0].address);

  // the environment: 'devnet' etc ... should be the same as in factory
  const nftMinter = new NftMinter("devnet", deployedMinterContractAddress);

  // Mint multiple NFTs
  const txsToSend = [];

  // let's mint a batch of 5
  for (let i = 0; i < 5; i++) {
    // Hover mint to see more options to use your own image and metadata
    const tx = await nftMinter.mint(
      nftMinterDeployerAddress,
      `GIFTXED${i}`,
      "https://api.itheumcloud-stg.com/datamarshalapi/router/v1",
      "https://api.itheumcloud-stg.com/datadexapi/bespoke/dynamicSecureDataStreamDemo",
      "https://raw.githubusercontent.com/Itheum/data-assets/main/Misc/Random/nopreview.png",
      500,
      `GiftX Edition 1 Card No ${i}`,
      `Itheum GiftX Card Super Rare 1st Edition Card No ${i}`,
      {
        imageUrl: `https://api.itheumcloud-stg.com/datadexapi/bespoke/dynamicImageDemo/GIFTX_ED_${i}`,
        traitsUrl: `https://api.itheumcloud-stg.com/datadexapi/bespoke/dynamicMetadataDemo/GIFTX_ED_${i}`,
      }
    );

    tx.setNonce(nftMinterDeployerAccount.getNonceThenIncrement());
    const signature = await nftMinterDeployerSigner.sign(tx.serializeForSigning());

    tx.applySignature(signature);
    txsToSend.push(tx);

    console.log(tx.getHash().toString());
  }

  // send all transactions
  networkProvider.sendTransactions(txsToSend);
}

main();
