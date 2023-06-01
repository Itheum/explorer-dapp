import { numberToPaddedHex } from '@multiversx/sdk-core/out/utils.codec';

export const createNftId = (collection_id: string, nft_nonce: number) => {
    return `${collection_id}-${numberToPaddedHex(nft_nonce)}`;
};
