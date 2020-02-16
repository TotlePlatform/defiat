const { Wallet } = require('ethers')

const config = require('./config')

module.exports = new Wallet(config.ethereum.privateKey)