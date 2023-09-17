import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Province from '../../Models/Province'

export default class ProvincesController {
  public async index() {
    return await Province.query().select('*').orderBy('id', 'asc')
  }

  public async store({}: HttpContextContract) {}

  public async show(id: number) {2
    return await Province.findOrFail(id)
  }

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
