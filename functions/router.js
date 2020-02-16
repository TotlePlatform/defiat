const express = require('express')
const axios = require('axios')
const uuidv4 = require('uuid/v4')

const web3 = require('./web3')
const firebase = require('./firebase')
const { deployContract, executeWyre, executeSwap } = require('./actions')
const wyreAutomation = require('./wyre_automation')

const router = express.Router()

router.post('/', async (req, res, next) => {
  const { body } = req

  const data = {
    userId: '',
    sourceAmount: '',
    number: '',
    firstName: '',
    lastName: '',
    expiry: '',
    cvc: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    destinationAddress: '',
    destinationAsset: ''
  }
  Object.assign(data, body)

  const { contractAddress, transactionHash } = await deployContract(data.destinationAddress)

  const referenceId = uuidv4()

  const db = firebase.firestore()
  const ref = db.collection('wyreTransfers').doc(referenceId)
  await ref.set({
    userAddress: data.destinationAddress,
    destinationAsset: data.destinationAsset,
    contractAddress
  })

  await wyreAutomation({
    ...data,
    destinationAddress: contractAddress,
    referenceId
  })

  if (contractAddress) {
    res.json({
      contract: contractAddress,
      referenceId
    })

    const subscription = web3.eth.subscribe('newBlockHeaders')
      .on('data', async (blockHeader) => {
        const block = await web3.eth.getBlock(blockHeader.hash)
        const containsTx = block.transactions.includes(transactionHash)
        if (containsTx) {
          await subscription.unsubscribe()

          await executeSwap(data.destinationAddress, data.destinationAsset, contractAddress)
        }
      })
  } else {
    res.json({})
  }
})

router.get('/wyre-success/:referenceId', async (req, res) => {
  const { query: { transferId }, params: { referenceId } } = req

  const db = firebase.firestore()
  const ref = db.collection('wyreTransfers').doc(referenceId)
  await ref.update({ transferId })

  const doc = await ref.get()
  const { userAddress, destinationAsset, contractAddress } = doc.data()
  const hash = await executeSwap(userAddress, destinationAsset, contractAddress)

  res.status(200)

  await ref.update({ hash })
})

module.exports = router
