const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')

const schema = () => ({
  rawtx: Joi.string().required()
})

module.exports.schema = schema()

module.exports.model = class RawTransacation extends AbstractModel {
  constructor (data, options) {
    super(data, schema, options)
  }
}
