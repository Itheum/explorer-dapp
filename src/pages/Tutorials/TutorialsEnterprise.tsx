import React, { useEffect, useState } from "react";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { useGetAccount, useGetPendingTransactions } from "hooks";
import { Address, Transaction } from "@multiversx/sdk-core/out";
import { sendTransactions } from "@multiversx/sdk-dapp/services";
import { refreshAccount } from "@multiversx/sdk-dapp/utils/account";
// import { useGetAccountInfo, useGetLoginInfo } from "@multiversx/sdk-dapp/hooks/account";
import { toastError } from "libs/utils";
import { Tooltip } from "react-tooltip";
import { SftMinter, NftMinter, ContractConfiguration } from "@itheum/sdk-mx-data-nft";
import { Factory, DeployedContract } from "@itheum/sdk-mx-enterprise";

const factory = new Factory("devnet");

export const TutorialsEnterprise = () => {
  const { address } = useGetAccount();
  const { loginMethod, tokenLogin } = useGetLoginInfo();
  const { hasPendingTransactions } = useGetPendingTransactions();

  const [sdkResponses, setSdkResponses] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [antiSpamTax, setAntiSpamTax] = useState<number | undefined>(-1);

  // itheum enterprise sdk
  const [minterVersion, setMinterVersion] = useState<string>("n/a");

  // data nft sdk
  const [minterSCAddressToWorkWith, setMinterSCAddressToWorkWith] = useState<string>("");
  const [nftMinter, setNftMinter] = useState<any>(null);
  const [newCollectionName, setNewCollectionName] = useState<string>("");
  const [newCollectionTicker, setNewCollectionTicker] = useState<string>("");
  const [addressesToWhitelist, setAddressesToWhitelist] = useState<string>("");
  const [nftBatchMintStartIndex, setNftBatchMintStartIndex] = useState<number>(-1);
  const [addressesToSetUnsetTransferRole, setAddressesToSetUnsetTransferRole] = useState<string>("");

  async function _enterpriseIsWhitelistEnabled() {
    setLoading(true);
    setSdkResponses(null);

    const requireWhitelisting = await factory.viewWhitelistEnabledState();
    console.log("Whitelisting required: ", requireWhitelisting);

    setSdkResponses(`Is Whitelisting required: ${requireWhitelisting}`);
    setLoading(false);
  }

  async function _enterpriseIsAddressWhitelisted() {
    setLoading(true);
    setSdkResponses(null);

    // Check if you are whitelisted (SKIP THIS IF WHITELISTING IS NOT REQUIRED)
    const isWhitelisted = await factory.viewAddressIsWhitelisted(new Address(address));
    console.log("Is whitelisted: ", isWhitelisted);

    setSdkResponses(`Am I whitelisted : ${isWhitelisted}`);
    setLoading(false);
  }

  async function _enterpriseShowAvailableMinterVersions() {
    setLoading(true);
    setSdkResponses(null);

    // View versions available for deployment in the factory
    const versions = await factory.viewVersions();
    console.log("Versions: ", versions);

    setSdkResponses(`Available minter contract version/s: ${versions.toString()}`);
    setLoading(false);
  }

  async function _enterpriseShowMyMinterContracts() {
    setLoading(true);
    setSdkResponses(null);

    // Check your deployed contract address
    const deployedContracts: DeployedContract[] = await factory.viewAddressContracts(new Address(address));
    console.log("Deployed contract: ", deployedContracts);

    setSdkResponses(`My deployed minter contract/s: ${deployedContracts.length > 0 ? deployedContracts.map((i) => JSON.stringify(i)) : "none"}`);
    setLoading(false);
  }

  async function _enterpriseDeployNewMinterContract() {
    setLoading(true);
    setSdkResponses(null);

    try {
      const txToIssue: Transaction = factory.deployContract(new Address(address), minterVersion);

      setSdkResponses(`New minter is deploying, please wait...`);

      await refreshAccount();

      const { sessionId, error } = await sendTransactions({
        transactions: txToIssue,
        transactionsDisplayInfo: {
          processingMessage: "Deploying new Enterprise Minter",
          errorMessage: "Minter deploying error",
          successMessage: "Minter deployed successfully",
        },
        redirectAfterSign: false,
      });

      console.log("mintTransaction", txToIssue);
      console.log("sessionId", sessionId);
      console.log("error", error);

      setSdkResponses(`TX session ID is : ${sessionId}`);
    } catch (e) {
      setSdkResponses(`_enterpriseDeployNewMinterContract has FAILED - see console for error`);
      console.log("_enterpriseDeployNewMinterContract has FAILED");
      console.error(e);
      toastError(e?.toString() ?? "");
    }
    setLoading(false);
  }

  // ************************************************************

  async function _dataNftInitializeCollection() {
    setLoading(true);
    setSdkResponses(null);

    try {
      // Initialize the NFT Minter
      const deployedMinterContractAddress = new Address(minterSCAddressToWorkWith);

      // the environment: 'devnet' etc ... should be the same as in factory
      const _nftMinter = new NftMinter("devnet", deployedMinterContractAddress);

      setNftMinter(_nftMinter); // store it so we can use it on other steps

      const txToIssue: Transaction = _nftMinter.initializeContract(
        new Address(address),
        newCollectionName, // LoyaltyXV1
        newCollectionTicker, // DATALT1
        5, // wait 5 seconds
        false,
        new Address(address) // claims address for royalties
      );

      /*
      const txToIssue: Transaction = nftMinter.initializeContract(
        new Address(address),
        "CollectionName",
        "TokenTicker",
        0,
        false,
        new Address(address), // claims address for royalties
        // optional tax token if you want to charge a tax on minting
        {
          taxTokenIdentifier: "EGLD",
          taxTokenAmount: 500000,
        }
      );
      */

      setSdkResponses(`Initializing minter contract...`);

      await refreshAccount();

      // Note: if the transaction fails due to gas limit you can apply your own gas limit before signing.
      txToIssue.setGasLimit(100000000);

      const { sessionId, error } = await sendTransactions({
        transactions: txToIssue,
        transactionsDisplayInfo: {
          processingMessage: "Initializing minter",
          errorMessage: "Minter initializing error",
          successMessage: "Minter initializing success",
        },
        redirectAfterSign: false,
      });

      console.log("mintTransaction", txToIssue);
      console.log("sessionId", sessionId);
      console.log("error", error);

      setSdkResponses(`TX session ID is : ${sessionId}`);
    } catch (e) {
      setSdkResponses(`_enterpriseDeployNewMinterContract has FAILED - see console for error`);
      console.log("_enterpriseDeployNewMinterContract has FAILED");
      console.error(e);
      toastError(e?.toString() ?? "");
    }

    setLoading(false);
  }

  async function _dataNftSetExistingMinterSC() {
    setLoading(true);
    setSdkResponses(null);

    // Initialize the NFT Minter
    const deployedMinterContractAddress = new Address(minterSCAddressToWorkWith);

    // the environment: 'devnet' etc ... should be the same as in factory
    const _nftMinter = new NftMinter("devnet", deployedMinterContractAddress);

    setNftMinter(_nftMinter); // store it so we can use it on other steps

    setSdkResponses(`Existing minter SC ${minterSCAddressToWorkWith} set`);
    setLoading(false);
  }

  async function _dataNftViewContractConfig() {
    setLoading(true);
    setSdkResponses(null);

    try {
      // Check smart contract configuration
      const viewConfigurations: ContractConfiguration = await nftMinter.viewContractConfiguration();
      setSdkResponses(`My minter configuration is: ${JSON.stringify(viewConfigurations)}`);
    } catch (e) {
      setSdkResponses(`_dataNftViewContractConfig has FAILED - see console for error`);
      console.log("_dataNftViewContractConfig has FAILED");
      console.error(e);
      toastError(e?.toString() ?? "");
    }

    setLoading(false);
  }

  async function _dataNftViewTransferRoles() {
    setLoading(true);
    setSdkResponses(null);

    try {
      // Check smart contract configuration
      const viewRoles: string[] = await nftMinter.viewTransferRoles();
      setSdkResponses(`Who has transfer role : ${viewRoles.toString()}`);
    } catch (e) {
      setSdkResponses(`_dataNftViewTransferRoles has FAILED - see console for error`);
      console.log("_dataNftViewTransferRoles has FAILED");
      console.error(e);
      toastError(e?.toString() ?? "");
    }

    setLoading(false);
  }

  async function _dataNftSetLocalRoles() {
    setLoading(true);
    setSdkResponses(null);

    try {
      const txToIssue: Transaction = nftMinter.setLocalRoles(new Address(address));

      setSdkResponses(`setting up roles for minter...`);

      await refreshAccount();

      const { sessionId, error } = await sendTransactions({
        transactions: txToIssue,
        transactionsDisplayInfo: {
          processingMessage: "set local roles for minter",
          errorMessage: "Set local roles error",
          successMessage: "Set local roles success",
        },
        redirectAfterSign: false,
      });

      console.log("mintTransaction", txToIssue);
      console.log("sessionId", sessionId);
      console.log("error", error);

      setSdkResponses(`TX session ID is : ${sessionId}`);
    } catch (e) {
      setSdkResponses(`_dataNftSetLocalRoles has FAILED - see console for error`);
      console.log("_dataNftSetLocalRoles has FAILED");
      console.error(e);
      toastError(e?.toString() ?? "");
    }

    setLoading(false);
  }

  async function _dataNftSetTransferRoles() {
    setLoading(true);
    setSdkResponses(null);

    try {
      const txToIssue: Transaction = nftMinter.setTransferRole(new Address(address), new Address(addressesToSetUnsetTransferRole));

      await refreshAccount();

      // Note: if the transaction fails due to gas limit you can apply your own gas limit before signing.
      txToIssue.setGasLimit(100000000);

      const { sessionId, error } = await sendTransactions({
        transactions: txToIssue,
        transactionsDisplayInfo: {
          processingMessage: "Set transfer roles",
          errorMessage: "Set transfer roles error",
          successMessage: "Set transfer roles success",
        },
        redirectAfterSign: false,
      });

      console.log("mintTransaction", txToIssue);
      console.log("sessionId", sessionId);
      console.log("error", error);

      setSdkResponses(`TX session ID is : ${sessionId}`);
    } catch (e) {
      setSdkResponses(`_dataNftSetTransferRoles has FAILED - see console for error`);
      console.log("_dataNftSetTransferRoles has FAILED");
      console.error(e);
      toastError(e?.toString() ?? "");
    }

    setLoading(false);
  }

  async function _dataNftUnSetTransferRoles() {
    setLoading(true);
    setSdkResponses(null);

    try {
      const txToIssue: Transaction = nftMinter.unsetTransferRole(new Address(address), new Address(addressesToSetUnsetTransferRole));

      await refreshAccount();

      // Note: if the transaction fails due to gas limit you can apply your own gas limit before signing.
      txToIssue.setGasLimit(100000000);

      const { sessionId, error } = await sendTransactions({
        transactions: txToIssue,
        transactionsDisplayInfo: {
          processingMessage: "Unset transfer roles",
          errorMessage: "Unset transfer roles error",
          successMessage: "Unset transfer roles success",
        },
        redirectAfterSign: false,
      });

      console.log("mintTransaction", txToIssue);
      console.log("sessionId", sessionId);
      console.log("error", error);

      setSdkResponses(`TX session ID is : ${sessionId}`);
    } catch (e) {
      setSdkResponses(`_dataNftUnSetTransferRoles has FAILED - see console for error`);
      console.log("_dataNftUnSetTransferRoles has FAILED");
      console.error(e);
      toastError(e?.toString() ?? "");
    }

    setLoading(false);
  }

  async function _dataNftViewContractPauseState() {
    setLoading(true);
    setSdkResponses(null);
    // View contract pause state
    const result = await nftMinter.viewContractPauseState();
    setSdkResponses(`Minter pause state is : ${result}`);
    setLoading(false);
  }

  async function _dataNftToggleContractPauseState(setPause: boolean) {
    setLoading(true);
    setSdkResponses(null);

    try {
      let txToIssue: Transaction | null = null;

      if (setPause) {
        txToIssue = nftMinter.pauseContract(new Address(address));
      } else {
        txToIssue = nftMinter.unpauseContract(new Address(address));
      }

      setSdkResponses(`Toggling pause state`);

      await refreshAccount();

      const { sessionId, error } = await sendTransactions({
        transactions: txToIssue,
        transactionsDisplayInfo: {
          processingMessage: "Toggling pause state for minter",
          errorMessage: "Toggling pause state error",
          successMessage: "Toggling pause state success",
        },
        redirectAfterSign: false,
      });

      console.log("mintTransaction", txToIssue);
      console.log("sessionId", sessionId);
      console.log("error", error);

      setSdkResponses(`TX session ID is : ${sessionId}`);
    } catch (e) {
      setSdkResponses(`_dataNftToggleContractPauseState has FAILED - see console for error`);
      console.log("_dataNftToggleContractPauseState has FAILED");
      console.error(e);
      toastError(e?.toString() ?? "");
    }

    setLoading(false);
  }

  async function _dataNftViewWhitelist() {
    setLoading(true);
    setSdkResponses(null);
    const result = await nftMinter.viewWhitelist();
    setSdkResponses(`Current minting whitelist is : ${result.toString()}`);
    setLoading(false);
  }

  async function _dataNftViewWhitelistUpdate() {
    setLoading(true);
    setSdkResponses(null);

    try {
      const addressStringsToArray = addressesToWhitelist.split(",").map((i) => i.toLowerCase().trim());
      const txToIssue: Transaction = nftMinter.whitelist(new Address(address), addressStringsToArray);

      await refreshAccount();

      const { sessionId, error } = await sendTransactions({
        transactions: txToIssue,
        transactionsDisplayInfo: {
          processingMessage: "Whitelisting for mint",
          errorMessage: "Whitelisting for mint error",
          successMessage: "Whitelisting for mint success",
        },
        redirectAfterSign: false,
      });

      console.log("mintTransaction", txToIssue);
      console.log("sessionId", sessionId);
      console.log("error", error);

      setSdkResponses(`TX session ID is : ${sessionId}`);
    } catch (e) {
      setSdkResponses(`_dataNftViewWhitelistUpdate has FAILED - see console for error`);
      console.log("_dataNftViewWhitelistUpdate has FAILED");
      console.error(e);
      toastError(e?.toString() ?? "");
    }

    setLoading(false);
  }

  async function _dataNftMintBatchOfItems() {
    setLoading(true);
    setSdkResponses(null);

    try {
      if (nftBatchMintStartIndex > 0) {
        const tknIdx = nftBatchMintStartIndex;

        const txToIssue: Transaction = await nftMinter.mint(
          new Address(address),
          `GIFTXED${tknIdx}`, // Short token Name (between 3 and 20 alphanumeric characters - no spaces)
          "https://api.itheumcloud-stg.com/datamarshalapi/router/v1", // The Data Marshal endpoint
          "https://api.itheumcloud-stg.com/datadexapi/bespoke/dynamicSecureDataStreamDemo", // The Data Stream URL
          "https://raw.githubusercontent.com/Itheum/data-assets/main/Misc/Random/nopreview.png", // The Public Preview URL
          500, // Royalty in % with 2 trailing zeros (e.g. 1500 is 15% or 500 would be 5% or 0 would be 0%. Max is 5000 of 50%)
          `GiftX Edition 1 Card No ${tknIdx}`, // Title (between 10 and 60 alphanumeric characters with spaces allowed)
          `Itheum GiftX Card Super Rare 1st Edition Card No ${tknIdx}`, // Description (between 10 and 400 alphanumeric characters with spaces allowed)
          {
            imageUrl: `https://api.itheumcloud-stg.com/datadexapi/bespoke/dynamicImageDemo/GIFTX_ED_${tknIdx}`,
            traitsUrl: `https://api.itheumcloud-stg.com/datadexapi/bespoke/dynamicMetadataDemo/GIFTX_ED_${tknIdx}`,
          }
        );

        setSdkResponses(`Minting a NFT...`);

        await refreshAccount();

        // Note: if the transaction fails due to gas limit you can apply your own gas limit before signing.
        // txToIssue.setGasLimit(100000000);

        const { sessionId, error } = await sendTransactions({
          transactions: txToIssue,
          transactionsDisplayInfo: {
            processingMessage: "Minting NFT",
            errorMessage: "Minting NFT error",
            successMessage: "Minting NFT success",
          },
          redirectAfterSign: false,
        });

        console.log("mintTransaction", txToIssue);
        console.log("sessionId", sessionId);
        console.log("error", error);

        setSdkResponses(`TX session ID is : ${sessionId}`);
      }
    } catch (e) {
      setSdkResponses(`_dataNftMintBatchOfItems has FAILED - see console for error`);
      console.log("_dataNftMintBatchOfItems has FAILED");
      console.error(e);
      toastError(e?.toString() ?? "");
    }

    setLoading(false);
  }

  /*



*/

  /*
import {ContractConfiguration, NftMinter} from '@itheum/sdk-mx-data-nft/out'
import {DeployedContract, Factory} from '@itheum/sdk-mx-enterprise/out'
import {Account, Address} from '@multiversx/sdk-core/out'
import {ApiNetworkProvider} from '@multiversx/sdk-network-providers/out'
import {UserSecretKey, UserSigner} from '@multiversx/sdk-wallet/out'
import * as fs from 'fs'

const pemFilePath2 = '../wallet2.pem'

const networkProvider = new ApiNetworkProvider(
  'https://devnet-api.multiversx.com',
  {
    timeout: 10000,
  }
)

const nftMinterDeployerPem = fs.readFileSync(pemFilePath2)

const nftMinterDeployer = UserSecretKey.fromPem(nftMinterDeployerPem.toString())

const nftMinterDeployerAddress = nftMinterDeployer
  .generatePublicKey()
  .toAddress()

const nftMinterDeployerSigner = new UserSigner(nftMinterDeployer)

async function main() {
  //Sync your account

  let nftMinterDeployerAccount = new Account(nftMinterDeployerAddress)
  let nftMinterDeployerAccountOnNetwork = await networkProvider.getAccount(
    nftMinterDeployerAddress
  )
  nftMinterDeployerAccount.update(nftMinterDeployerAccountOnNetwork)

  // Initialize the Itheum Factory
  const factory = new Factory('devnet')

  // Check that you are whitelisted or if factory requires whitelisting

  const requireWhitelisting = await factory.viewWhitelistEnabledState()
  console.log('Whitelisting required: ', requireWhitelisting)

  // Check if you are whitelisted (SKIP THIS IF WHITELISTING IS NOT REQUIRED)
  if (requireWhitelisting) {
    const isWhitelisted = await factory.viewAddressIsWhitelisted(
      nftMinterDeployerAddress
    )
    console.log('Is whitelisted: ', isWhitelisted)
  }

  // View versions available for deployment in the factory
  const versions = await factory.viewVersions()
  console.log('Versions: ', versions)

  // Deploy a minter contract (nftMinterDeployerAddress is the admin of the deployed contract)
  factory.deployContract(nftMinterDeployerAddress, '0.0.1')

  // Check your deployed contract address
  const deployedContract: DeployedContract[] =
    await factory.viewAddressContracts(nftMinterDeployerAddress)
  console.log('Deployed contract: ', deployedContract)

  // Initialize the NFT Minter
  const deployedMinterContractAddress = new Address(deployedContract[0].address)

  // the environment: 'devnet' etc ... should be the same as in factory
  const nftMinter = new NftMinter('devnet', deployedMinterContractAddress)

  // Initialize the NFT Minter

  const initTx = nftMinter.initializeContract(
    nftMinterDeployerAddress,
    'CollectionName',
    'TokenTicker',
    0,
    false,
    nftMinterDeployerAddress, // claims address for royalties
    // optional tax token if you want to charge a tax on minting
    {
      taxTokenIdentifier: 'EGLD',
      taxTokenAmount: 500000,
    }
  )

  // Set nonce and sign the transaction
  initTx.setNonce(nftMinterDeployerAccount.getNonceThenIncrement())

  const signature = await nftMinterDeployerSigner.sign(
    initTx.serializeForSigning()
  )

  initTx.applySignature(signature)

  networkProvider.sendTransaction(initTx)

  // Note: if the transaction fails due to gas limit you can apply your own gas limit before signing.
  initTx.setGasLimit(50000000)

  //Set local roles
  const setRolesTx = nftMinter.setLocalRoles(nftMinterDeployerAddress)
  // same steps as above to sign and send the transaction

  // Check smart contract configuration
  const viewConfigurations: ContractConfiguration =
    await nftMinter.viewContractConfiguration()

  // The contract is paused and as whitelist enabled at deployment and for every upgrade
  // In order to mint you need to unpause the contract and whitelist your address or disable whitelisting

  const unpauseTx = nftMinter.unpauseContract(nftMinterDeployerAddress)
  const disableWhitelistTx = nftMinter.setWhitelistIsEnabled(
    nftMinterDeployerAddress,
    false
  )
  // whitelist a list of addresses
  const whitelistTx = nftMinter.whitelist(nftMinterDeployerAddress, [
    nftMinterDeployerAddress.bech32(),
  ])

  // Mint multiple NFTs

  let txtosend = []
  for (let i = 0; i < 5; i++) {
    // Hover mint to see more options to use your own image and metadata
    const tx = await nftMinter.mint(
      nftMinterDeployerAddress,
      'Token 11',
      'https://d37x5igq4vw5mq.cloudfront.net/datamarshalapi/achilles/v1',
      'https://raw.githubusercontent.com/Itheum/data-assets/main/Health/H1__Signs_of_Anxiety_in_American_Households_due_to_Covid19/dataset.json',
      'https://itheumapi.com/programReadingPreview/70dc6bd0-59b0-11e8-8d54-2d562f6cba54',
      1000,
      'Title for token 11',
      'Desc for token 11',
      {
        nftStorageToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDMzQjZGNzhmOTZmZjVmMGIwMUJFNzJmZTQ0NDRmMjBCYzhkOEQ0REUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY5MTc0NDc5NDY5MCwibmFtZSI6InRlc3QifQ.lTjq16CgrDipiVClOrbWNt0A0zYkJ9YGVeDz1TlGqQ0',
      }
    )

    tx.setNonce(nftMinterDeployerAccount.getNonceThenIncrement())

    const signature = await nftMinterDeployerSigner.sign(
      tx.serializeForSigning()
    )

    tx.applySignature(signature)

    txtosend.push(tx)
    console.log(tx.getHash().toString())
  }

  networkProvider.sendTransactions(txtosend)

  // Other methods to manage the contract check the typedoc for more info
}

main()



  */

  function reloadInitialState() {
    setAntiSpamTax(-1);
    setSdkResponses(null);
  }

  // if (tokenLogin) {
  //   console.log("tokenLogin.nativeAuthToken");
  //   console.log(tokenLogin?.nativeAuthToken);
  // }

  // console.log(address);

  return (
    <div className="container d-flex flex-fill justify-content-center py-4 c-marketplace-app">
      <div className="row w-100">
        <div className="col-12 mx-auto">
          <h1 className="app-title">Minting a Re-Tradable Loyalty Card Collection</h1>

          <div className="body">
            <div className="mb-5">
              <h3>My Details</h3>
              <div className="p-2">Wallet Used to Login: {loginMethod}</div>
              <div className="p-2">Your Address (Data Creator): {address}</div>
              <div className="p-2">
                <input type="text" className="form-control form-control-lg" value={tokenLogin?.nativeAuthToken} />
              </div>
            </div>

            <div className="mb-5">
              <h3>Itheum Enterprise SDK</h3>

              <div className="p-2">
                <button className="btn btn-outline-primary mr-3" onClick={_enterpriseIsWhitelistEnabled}>
                  Check
                </button>
                <Tooltip anchorSelect=".my-ptr-1" place="top">
                  Has Itheum Enterprise enforced whitelisting?
                </Tooltip>
                <span className="my-ptr-1">Is whitelisting enabled?</span>
              </div>

              <div className="p-2">
                <button className="btn btn-outline-primary mr-3" onClick={_enterpriseIsAddressWhitelisted}>
                  Check
                </button>
                <Tooltip anchorSelect=".my-ptr-2" place="top">
                  If whitelisting is required then you need to be explicitly whitelisted, check that here.
                </Tooltip>
                <span className="my-ptr-2">Is my address whitelisted? </span>
              </div>

              <div className="p-2">
                <button className="btn btn-outline-primary mr-3" onClick={_enterpriseShowAvailableMinterVersions}>
                  Check
                </button>
                <Tooltip anchorSelect=".my-ptr-3" place="top">
                  What versions of the Data NFT-Lease minter contract are available, you need to pick the latest if you are minting a new collection.
                </Tooltip>
                <span className="my-ptr-3">What versions of the Data NFT-Lease minter are available?</span>
              </div>

              <div className="p-2">
                <button className="btn btn-outline-primary mr-3" onClick={_enterpriseShowMyMinterContracts}>
                  Check
                </button>
                <Tooltip anchorSelect=".my-ptr-4" place="top">
                  Have I deployed any Minter Contracts already?
                </Tooltip>
                <span className="my-ptr-4">My minter contracts</span>
              </div>

              <div className="p-2">
                <button
                  className="btn btn-outline-primary mr-3"
                  onClick={_enterpriseDeployNewMinterContract}
                  disabled={minterVersion === "n/a" || minterVersion.trim().length < 5}>
                  Deploy
                </button>
                <Tooltip anchorSelect=".my-ptr-5" place="top">
                  Ready to own your own Itheum Enterprise Collection? deploy one below. You need to fetch the versions 1st to use this as it needs tht latest
                  version.
                </Tooltip>
                <span className="my-ptr-5">Deploy a new Minter contract (with version {minterVersion}) for me.</span>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Minter version number"
                  onChange={(event) => {
                    setMinterVersion(event.target.value);
                  }}
                />
              </div>
            </div>

            <div className="mb-5">
              <h3>Data NFT-LEASE SDK</h3>
              <span>
                Minter SC we are working with: {minterSCAddressToWorkWith || "n/a"}, nftMinter instance set to {nftMinter?.toString() || "n/a"}
              </span>

              <div className="p-2 mt-3">
                <h4>Work with a new NFT collection:</h4>

                <button
                  className="btn btn-outline-primary mr-3"
                  onClick={_dataNftInitializeCollection}
                  disabled={minterSCAddressToWorkWith.trim().length < 5 || newCollectionTicker.trim().length < 5 || newCollectionName.trim().length < 5}>
                  Launch NFT Collection
                </button>
                <Tooltip anchorSelect=".my-ptr-6" place="top">
                  With a minter contract you have deployed and are admin of, you can now launch the empty base NFT collection.
                </Tooltip>
                <span className="my-ptr-6">Launch the base NFT collection using my Minter. (only "owner" (i.e.Admin) can call it)</span>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Minter SC address to work with"
                  onChange={(event) => {
                    setMinterSCAddressToWorkWith(event.target.value);
                  }}
                />

                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="New collection ticker (e.g. GUARDIAN)"
                  onChange={(event) => {
                    setNewCollectionTicker(event.target.value);
                  }}
                />

                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="New collection name (e.g. Aquaverse)"
                  onChange={(event) => {
                    setNewCollectionName(event.target.value);
                  }}
                />

                <span>
                  We are going to configure a new NFT collection via the {minterSCAddressToWorkWith} minter SC. Collection ticker is {newCollectionTicker} and
                  name is {newCollectionName}.
                </span>
              </div>

              <div className="p-2 mt-3">
                <h4>... Or work with an existing NFT Collection:</h4>
              </div>

              <div className="p-2">
                <button className="btn btn-outline-primary mr-3" disabled={minterSCAddressToWorkWith.trim().length < 5} onClick={_dataNftSetExistingMinterSC}>
                  Set Minter
                </button>
                <Tooltip anchorSelect=".my-ptr-7" place="top">
                  Set a existing Minter SC to work with
                </Tooltip>
                <span className="my-ptr-7">Set a existing Minter SC to work with</span>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Minter SC address to work with"
                  onChange={(event) => {
                    setMinterSCAddressToWorkWith(event.target.value);
                  }}
                />
              </div>

              <div className="p-2">
                <button
                  className="btn btn-outline-primary mr-3"
                  disabled={minterSCAddressToWorkWith.trim().length < 5 || !nftMinter}
                  onClick={_dataNftViewContractConfig}>
                  Check
                </button>
                <Tooltip anchorSelect=".my-ptr-8" place="top">
                  Lookup a minter contract's configuration
                </Tooltip>
                <span className="my-ptr-8">Check minter's configuration as found on-chain (anyone can call it)</span>
              </div>

              <br />
              <h5>Transfer Control</h5>

              <div className="p-2">
                <button
                  className="btn btn-outline-primary mr-3"
                  disabled={minterSCAddressToWorkWith.trim().length < 5 || !nftMinter}
                  onClick={_dataNftSetLocalRoles}>
                  Set
                </button>
                <Tooltip anchorSelect=".my-ptr-9" place="top">
                  SET base local roles for the minter to make NFTs non-transferable
                </Tooltip>
                <span className="my-ptr-9">Set base local roles for the minter to make NFTs non-transferable (only "owner" (i.e.Admin) can call it)</span>
              </div>

              <div className="p-2">
                <button
                  className="btn btn-outline-primary mr-3"
                  disabled={minterSCAddressToWorkWith.trim().length < 5 || !nftMinter}
                  onClick={_dataNftViewTransferRoles}>
                  View
                </button>
                <Tooltip anchorSelect=".my-ptr-9" place="top">
                  View transfer roles set on the minter
                </Tooltip>
                <span className="my-ptr-9">View transfer roles set on the minter (anyone can call it)</span>
              </div>

              <div className="p-2">
                <button
                  className="btn btn-outline-primary mr-3"
                  disabled={minterSCAddressToWorkWith.trim().length < 5 || !nftMinter || addressesToSetUnsetTransferRole.trim().length < 5}
                  onClick={_dataNftSetTransferRoles}>
                  Set
                </button>
                <Tooltip anchorSelect=".my-ptr-9" place="top">
                  SET specific transfer roles for the minter
                </Tooltip>
                <span className="my-ptr-9">set specific transfer roles for the minter (only "owner" (i.e. Admin) can call it)</span>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="an existing address to set transfer role on"
                  onChange={(event) => {
                    setAddressesToSetUnsetTransferRole(event.target.value);
                  }}
                />
              </div>

              <div className="p-2">
                <button
                  className="btn btn-outline-primary mr-3"
                  disabled={minterSCAddressToWorkWith.trim().length < 5 || !nftMinter || addressesToSetUnsetTransferRole.trim().length < 5}
                  onClick={_dataNftUnSetTransferRoles}>
                  Unset
                </button>
                <Tooltip anchorSelect=".my-ptr-9" place="top">
                  UNSET specific transfer roles for the minter
                </Tooltip>
                <span className="my-ptr-9">Unset specific transfer roles for the minter (only "owner" (i.e. Admin) can call it)</span>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="an existing address to unset transfer role on"
                  onChange={(event) => {
                    setAddressesToSetUnsetTransferRole(event.target.value);
                  }}
                />
              </div>

              <br />
              <h5>Minter Pause Control</h5>

              <div className="p-2">
                <button
                  className="btn btn-outline-primary mr-3"
                  disabled={minterSCAddressToWorkWith.trim().length < 5 || !nftMinter}
                  onClick={_dataNftViewContractPauseState}>
                  Check
                </button>
                <Tooltip anchorSelect=".my-ptr-8" place="top">
                  Check if a minter is paused
                </Tooltip>
                <span className="my-ptr-8">Check if a minter is paused (anyone can call it)</span>
              </div>

              <div className="p-2">
                <button
                  className="btn btn-outline-primary mr-3"
                  disabled={minterSCAddressToWorkWith.trim().length < 5 || !nftMinter}
                  onClick={() => _dataNftToggleContractPauseState(true)}>
                  Pause Minter
                </button>
                <Tooltip anchorSelect=".my-ptr-8" place="top">
                  Pause the minter contract
                </Tooltip>
                <span className="my-ptr-8">Pause the minter contract (only "owner" (i.e.Admin) can call it)</span>
              </div>

              <div className="p-2">
                <button
                  className="btn btn-outline-primary mr-3"
                  disabled={minterSCAddressToWorkWith.trim().length < 5 || !nftMinter}
                  onClick={() => _dataNftToggleContractPauseState(false)}>
                  UnPause Minter
                </button>
                <Tooltip anchorSelect=".my-ptr-8" place="top">
                  UnPause the minter contract
                </Tooltip>
                <span className="my-ptr-8">UnPause the minter contract (only "owner" (i.e.Admin) can call it)</span>
              </div>

              <br />
              <h5>Minter Whitelist Control</h5>

              <div className="p-2">
                <button
                  className="btn btn-outline-primary mr-3"
                  disabled={minterSCAddressToWorkWith.trim().length < 5 || !nftMinter}
                  onClick={_dataNftViewWhitelist}>
                  Check
                </button>
                <Tooltip anchorSelect=".my-ptr-8" place="top">
                  View minters whitelist
                </Tooltip>
                <span className="my-ptr-8">View minters whitelist (anyone can call it)</span>
              </div>

              <div className="p-2">
                <button
                  className="btn btn-outline-primary mr-3"
                  disabled={minterSCAddressToWorkWith.trim().length < 5 || !nftMinter || addressesToWhitelist.length < 10}
                  onClick={_dataNftViewWhitelistUpdate}>
                  Whitelist
                </button>
                <Tooltip anchorSelect=".my-ptr-7" place="top">
                  Whitelist a bunch of addresses to mint
                </Tooltip>
                <span className="my-ptr-7">A list of addresses whitelisted to mint (only "owner" (i.e.Admin) can call it)</span>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="A comma separated list of addresses whitelisted to mint"
                  onChange={(event) => {
                    setAddressesToWhitelist(event.target.value);
                  }}
                />
              </div>

              <br />

              <div className="p-2 mt-3">
                <h4>Mint Batch of 10 NFTs:</h4>

                <button
                  className="btn btn-outline-primary mr-3"
                  onClick={_dataNftMintBatchOfItems}
                  disabled={minterSCAddressToWorkWith.trim().length < 5 || !nftMinter || nftBatchMintStartIndex < 1}>
                  Mint
                </button>
                <Tooltip anchorSelect=".my-ptr-11" place="top">
                  Mint 10 NFTs using the following dynamic metadata
                </Tooltip>
                <span className="my-ptr-11">Mint 10 NFTs using the following dynamic metadata. (only "whitelisted" address can call it)</span>
                <input
                  type="number"
                  className="form-control form-control-lg"
                  placeholder="The starting index of this batch of 10 (e.g. 1 or 11). Start with 1 and not 0"
                  onChange={(event) => {
                    setNftBatchMintStartIndex(parseInt(event.target.value, 10));
                  }}
                />
                <span>We are going to mint a batch of 10 NFTs with an index starting with {nftBatchMintStartIndex}.</span>
              </div>
            </div>

            <br />

            <div className="p-2 jumbotron">
              <div>SDK Responses</div>
              <button className="btn btn-outline-primary" onClick={reloadInitialState}>
                Clear All
              </button>
              <div>Has pending transactions? {hasPendingTransactions}</div>
              {(loading && <div>Loading...</div>) || (
                <div>
                  <input type="text" className="form-control form-control-lg" value={sdkResponses || "n/a"} />
                </div>
              )}
            </div>
          </div>
          <div className="footer"></div>
        </div>
      </div>
    </div>
  );
};
