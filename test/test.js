const postCreatePlugin = require('../index')
const sinon = require('sinon')
const mongoose = require('mongoose')
const mocha = require('mocha')
const should = require('should')

const before = mocha.before, it = mocha.it

mongoose.connect('mongodb://localhost:27017/mongoose-post-create')

describe('postCreatePlugin', function () {
  let MyModel, spy1, spy2

  before(function (done) {
    const MySchema = new mongoose.Schema({
      foo: String,
    })

    MySchema.plugin(postCreatePlugin)
    MyModel = mongoose.model('MyModel', MySchema)

    spy1 = sinon.spy()
    spy2 = sinon.spy()

    MyModel.schema.addPostCreate(spy1)
    MyModel.schema.addPostCreate(spy2)
    done()
  })

  it('works', function (done) {
    const obj = new MyModel({ foo: 'bar' })

    obj.save((err, obj) => {
      should.not.exist(err)
      should.exist(obj)
      obj.should.have.property('foo', 'bar')
      spy1.callCount.should.eql(1)
      spy2.callCount.should.eql(1)

      obj.foo = 'bar2'
      obj.save((err, obj) => {
        should.not.exist(err)
        should.exist(obj)
        obj.should.have.property('foo', 'bar2')
        spy1.callCount.should.eql(1)
        spy2.callCount.should.eql(1)
        done()
      })

    })
  })
})
