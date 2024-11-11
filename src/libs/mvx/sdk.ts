import { DataNft, DataNftMarket } from "@itheum/sdk-mx-data-nft";
import { apiTimeout, ELROND_NETWORK } from "config";

// if we don't do this here, the SDK throw an error when we try and use it inside components
DataNft.setNetworkConfig(ELROND_NETWORK);

export const dataNftMarket = new DataNftMarket(ELROND_NETWORK, apiTimeout);
