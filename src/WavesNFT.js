export default class WavesNFT {
  nftUrlTemplate = 'https://nodes.wavesnodes.com/assets/nft/{address}/limit/{limit}';

  constructor() {

  }

  getNftList(address, limit = 100) {
    const url = this.nftUrlTemplate.replace('{address}', address).
        replace('{limit}', limit.toString());

    return fetch(url).then(data => data.json());
  }
}
