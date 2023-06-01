import { DataNft, DataNftMarket } from '@itheum/sdk-mx-data-nft';
import {
  apiTimeout,
  ELROND_NETWORK,
} from 'config';

// set network config of DataNft class
DataNft.setNetworkConfig(ELROND_NETWORK);

export const dataNftMarket = new DataNftMarket(ELROND_NETWORK, apiTimeout);
