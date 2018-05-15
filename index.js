const async = require('async')

module.exports = function postCreatePluign (schema) {
  schema.addPostCreate = function (f) {
    schema.postCreateListeners = schema.postCreateListeners || []
    schema.postCreateListeners = schema.postCreateListeners.concat(f)
  }

  schema.pre('save', function (next) {
    this._wasNew = this.isNew
    next()
  })

  schema.post('save', function (doc) {
    if (doc._wasNew) {
      async.parallel(
        schema.postCreateListeners.map(f => f.bind(null, doc)),
        function (err) {
          if (err) { console.log(err) }
          doc._wasNew = false
        }
      )
    }
  })
}
