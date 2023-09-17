import ProvinceFactory from '../../app/Models/Province'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(ProvinceFactory, ({ faker }) => {
  return {
    name: faker.location.state()
  }
}).build()
