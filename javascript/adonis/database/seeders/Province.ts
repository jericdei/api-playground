import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ProvinceFactory from '../factories/ProvinceFactory'

export default class extends BaseSeeder {
  public async run () {
    await ProvinceFactory.createMany(10);
  }
}
