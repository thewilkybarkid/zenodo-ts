import { pipe } from 'fp-ts/function'
import * as D from 'io-ts/Decoder'
import * as _ from '../src'
import * as fc from './fc'

describe('zenodo-ts', () => {
  describe('codecs', () => {
    describe('RecordC', () => {
      test('when the record can be decoded', () => {
        fc.assert(
          fc.property(fc.zenodoRecord(), record => {
            const actual = pipe(record, _.RecordC.encode, _.RecordC.decode)

            expect(actual).toStrictEqual(D.success(record))
          }),
        )
      })

      test('when the record cannot be decoded', () => {
        fc.assert(
          fc.property(fc.string(), string => {
            const actual = _.RecordC.decode(string)

            expect(actual).toStrictEqual(D.failure(expect.anything(), expect.anything()))
          }),
        )
      })
    })
  })
})
