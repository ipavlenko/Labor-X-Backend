const express = require('express')
const BigNumber = require('bignumber.js')
const { asyncHandler } = require('../middleware')
const { web3Holder } = requireRoot('lib/web3')
const { RawTransacation } = requireRoot('lib/models')
const { faucetService } = requireRoot('lib/services')

const router = express.Router()

router.post('/tx/send', asyncHandler(async (req, res) => {
  const { rawtx } = new RawTransacation(req.body)

  web3Holder.web3.eth.sendSignedTransaction(rawtx)
    .once('transactionHash', (hash) => {
      res.send({
        hash
      })
    })
    .once('error', (error) => {
      res.status(400).send({
        error: error.message
      })
    })
}))

router.post('/faucet', asyncHandler(async (req, res) => {
  const amount = new BigNumber(10).multipliedBy(new BigNumber(10).pow(18))
  const address = req.body.address
  await faucetService.borrow({
    address,
    amount
  })
  res.send({
    status: 'ok'
  })
}))

module.exports = router
