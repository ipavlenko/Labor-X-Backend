const crypto = require('crypto')
const { promisify } = require('util')

module.exports.hexMd5OfRandomBytes = async function (bytesCount) {
  const randomBytes = await promisify(crypto.randomBytes)(bytesCount)
  return crypto.createHash('md5').update(randomBytes).digest('hex')
}
