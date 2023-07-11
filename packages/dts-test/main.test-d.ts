import { describe, expectType } from './utils'
import { injectService } from '@vue-beans/injections'

describe('injectService', () => {
  class Service {}
  const service = injectService(Service)
  expectType<Service>(service)
})
