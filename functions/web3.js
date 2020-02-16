const Web3 = require('web3')

let web3 = new Web3()
web3.setProvider(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/fb3eae44a02f4a37868d3cd0ba40f30f'))

module.exports = web3
