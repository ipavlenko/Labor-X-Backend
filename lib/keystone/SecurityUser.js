const keystone = require('keystone')

const Types = keystone.Field.Types

const SecurityUser = new keystone.List('SecurityUser')

SecurityUser.add({
  name: { type: String, initial: true },
  email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
  password: { type: Types.Password, initial: true, required: true }
}, 'Permissions', {
  isAdmin: { type: Boolean, label: 'Can Access Keystone', index: true, initial: true }
})

SecurityUser.schema.pre('save', function (next) {
  if (this.name == null || this.name === '') {
    this.name = this.email.substring(0, this.email.lastIndexOf('@'))
  }
  this.email = this.email.toLowerCase()
  next()
})

// Provide access to Keystone
SecurityUser.schema.virtual('canAccessKeystone').get(function () {
  return this.isAdmin
})

SecurityUser.defaultColumns = 'name, email, isAdmin'
SecurityUser.register()

// SecurityUser.model.findOne({ email: 'demo@example.com' }, (findError, user) => {
//   if (findError) {
//     // handle error
//   } else {
//     user.isAdmin = true
//     user.save((saveError) => {
//       if (saveError) {
//         // handle error
//       }
//     })
//   }
// })
