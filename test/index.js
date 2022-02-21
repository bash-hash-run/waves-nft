const WavesNft = require('../WavesNFT.develop')
const { broadcast } = require('@waves/waves-transactions')

require('dotenv').config()

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

async function run() {
  const wavesNft = new WavesNft('https://nodes-testnet.wavesnodes.com', 'T', process.env.DAPP)
  await wavesNft.managerSetSeed(process.env.MANAGER_SEED)

  // create nft
  let data = await wavesNft.managerMint(
    '3N9oCzWwiVC96Apgu843T9jAUgv86JWUQJ3',
    'NFT MEGA',
    JSON.stringify({
      url: 'https://etherscan.io/favicon.ico',
      bzz: '12d5dee2b73a9bcc86f45df8168952aa1a23b036c727a5255908a25478c7d1c2',
    }),
    true,
    10000000,
  )

  let resp
  try {
    resp = await broadcast(data, 'https://nodes-testnet.wavesnodes.com')
    console.log(resp)
  } catch (e) {
    console.log('Error', e)
  }

  // get nft id
  await delay(5000)
  resp = await wavesNft.getTxInfo(resp.id)
  const nftId = resp.stateChanges.issues[0].assetId
  console.log('nftId', nftId)

  // change nft info from nft owner
  await wavesNft.managerSetSeed(process.env.USER_SEED)
  data = await wavesNft.managerSetTokenInfo(nftId, true, 777777)
  try {
    const resp = await broadcast(data, 'https://nodes-testnet.wavesnodes.com')
    console.log(resp)
  } catch (e) {
    console.log('Error', e)
  }

  await delay(3000)
  // pickup nft by owner
  data = await wavesNft.managerPickUp(nftId)
  try {
    const resp = await broadcast(data, 'https://nodes-testnet.wavesnodes.com')
    console.log(resp)
  } catch (e) {
    console.log('Error', e)
  }
}

run().then()
