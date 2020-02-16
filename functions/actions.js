const axios = require('axios')
const ethers = require('ethers')
const ethUtils = require('ethereumjs-util')

const firebase = require('./firebase')
const web3 = require('./web3')
const wallet = require('./wallet')
const config = require('./config')

exports.deployContract = async function (userAddress) {
  const contract = new web3.eth.Contract(config.ethereum.contractABI)
  const data = contract.deploy({
    data: config.ethereum.contractBytecode,
    arguments: [ userAddress ]
  }).encodeABI()

  const nonce = await web3.eth.getTransactionCount(wallet.address)
  const chainId = await web3.eth.getChainId()

  const raw = await wallet.sign({
    gasLimit: 3000000,
    gasPrice: 2000000000,
    value: 0,
    data,
    nonce,
    chainId
  })

  return new Promise((resolve, reject) => {
    const futureAddress = ethUtils.bufferToHex(ethUtils.generateAddress(
      wallet.address,
      nonce
    ))

    web3.eth.sendSignedTransaction(raw)
      .once('transactionHash', (hash) => {
        resolve({ contractAddress: futureAddress, transactionHash: hash })
      })
  })
}

exports.executeSwap = async function(userAddress, destinationAsset, contractAddress) {
  const contract = new web3.eth.Contract(config.ethereum.contractABI, contractAddress)
  const balance = await web3.eth.getBalance(contractAddress)

  const { data: {
    success,
    response: {
      transactions: [ { tx: transaction } ]
    }
  }} = await axios.post('https://api.totle.com/swap', {
    config: {
      skipBalanceChecks: true
    },
    address: contractAddress,
    swap: {
      sourceAsset: 'ETH',
      sourceAmount: balance.toString(),
      destinationAsset,
      destinationAddress: userAddress
    }
  })

  const decodedData = web3.eth.abi.decodeParameter(config.ethereum.performSwapCollectionInput, transaction.data.slice(10))
  const data = contract.methods.swap(decodedData, transaction.to).encodeABI()

  const raw = await wallet.sign({
    to: contractAddress,
    gasLimit: ethers.utils.bigNumberify(transaction.gas),
    gasPrice: ethers.utils.bigNumberify(transaction.gasPrice),
    value: 0,
    data,
    nonce: ethers.utils.bigNumberify(transaction.nonce)
  })
  const txHash = await web3.eth.sendSignedTransaction(raw)
  return txHash
}