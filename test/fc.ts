import * as fc from 'fast-check'
import * as _ from '../src'

export * from 'fast-check'

export const zenodoRecord = (): fc.Arbitrary<_.Record> =>
  fc.record({
    id: fc.integer(),
  })
