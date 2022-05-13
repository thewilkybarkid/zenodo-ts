import { Fetch } from 'fetch-fp-ts'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { StatusCodes } from 'http-status-codes'
import * as D from 'io-ts/Decoder'
import * as _ from '../src'
import * as fc from './fc'

describe('zenodo-ts', () => {
  describe('constructors', () => {
    describe('getRecord', () => {
      test('with a Zenodo URL', async () => {
        await fc.assert(
          fc.asyncProperty(fc.url(), fc.integer(), fc.response(), async (zenodoUrl, id, response) => {
            const fetch: jest.MockedFunction<Fetch> = jest.fn((_url, _init) => Promise.resolve(response))

            await _.getRecord(id)({ fetch, zenodoUrl })()

            expect(fetch).toHaveBeenCalledWith(`${zenodoUrl.origin}/api/records/${id.toString()}`, {
              headers: {},
              method: 'GET',
            })
          }),
        )
      })

      test('without a Zenodo URL', async () => {
        await fc.assert(
          fc.asyncProperty(fc.integer(), fc.response(), async (id, response) => {
            const fetch: jest.MockedFunction<Fetch> = jest.fn((_url, _init) => Promise.resolve(response))

            await _.getRecord(id)({ fetch })()

            expect(fetch).toHaveBeenCalledWith(`https://zenodo.org/api/records/${id.toString()}`, {
              headers: {},
              method: 'GET',
            })
          }),
        )
      })

      test('when the record can be decoded', async () => {
        await fc.assert(
          fc.asyncProperty(
            fc.integer(),
            fc
              .zenodoRecord()
              .chain(record =>
                fc.tuple(
                  fc.constant(record),
                  fc.response({ status: fc.constant(StatusCodes.OK), text: fc.constant(_.RecordC.encode(record)) }),
                ),
              ),
            async (id, [record, response]) => {
              const fetch: Fetch = () => Promise.resolve(response)

              const actual = await _.getRecord(id)({ fetch })()

              expect(actual).toStrictEqual(D.success(record))
            },
          ),
        )
      })

      test('when the record cannot be decoded', async () => {
        await fc.assert(
          fc.asyncProperty(
            fc.integer(),
            fc.response({ status: fc.constant(StatusCodes.OK), text: fc.string() }),
            async (id, response) => {
              const fetch: Fetch = () => Promise.resolve(response)

              const actual = await _.getRecord(id)({ fetch })()

              expect(actual).toStrictEqual(D.failure(expect.anything(), expect.anything()))
            },
          ),
        )
      })

      test('when the response has a non-200 status code', async () => {
        await fc.assert(
          fc.asyncProperty(
            fc.integer(),
            fc.response({ status: fc.integer().filter(status => status !== StatusCodes.OK) }),
            async (id, response) => {
              const fetch: Fetch = () => Promise.resolve(response)

              const actual = await _.getRecord(id)({ fetch })()

              expect(actual).toStrictEqual(E.left(response))
            },
          ),
        )
      })

      test('when fetch throws an error', async () => {
        await fc.assert(
          fc.asyncProperty(fc.integer(), fc.error(), async (id, error) => {
            const fetch: Fetch = () => Promise.reject(error)

            const actual = await _.getRecord(id)({ fetch })()

            expect(actual).toStrictEqual(E.left(error))
          }),
        )
      })
    })

    describe('getRecords', () => {
      test('with a Zenodo URL', async () => {
        await fc.assert(
          fc.asyncProperty(fc.url(), fc.urlSearchParams(), fc.response(), async (zenodoUrl, query, response) => {
            const fetch: jest.MockedFunction<Fetch> = jest.fn((_url, _init) => Promise.resolve(response))

            await _.getRecords(query)({ fetch, zenodoUrl })()

            expect(fetch).toHaveBeenCalledWith(`${zenodoUrl.origin}/api/records/?${query.toString()}`, {
              headers: {},
              method: 'GET',
            })
          }),
        )
      })

      test('without a Zenodo URL', async () => {
        await fc.assert(
          fc.asyncProperty(fc.urlSearchParams(), fc.response(), async (query, response) => {
            const fetch: jest.MockedFunction<Fetch> = jest.fn((_url, _init) => Promise.resolve(response))

            await _.getRecords(query)({ fetch })()

            expect(fetch).toHaveBeenCalledWith(`https://zenodo.org/api/records/?${query.toString()}`, {
              headers: {},
              method: 'GET',
            })
          }),
        )
      })

      test('when the records can be decoded', async () => {
        await fc.assert(
          fc.asyncProperty(
            fc.urlSearchParams(),
            fc
              .zenodoRecords()
              .chain(records =>
                fc.tuple(
                  fc.constant(records),
                  fc.response({ status: fc.constant(StatusCodes.OK), text: fc.constant(_.RecordsC.encode(records)) }),
                ),
              ),
            async (query, [records, response]) => {
              const fetch: Fetch = () => Promise.resolve(response)

              const actual = await _.getRecords(query)({ fetch })()

              expect(actual).toStrictEqual(D.success(records))
            },
          ),
        )
      })

      test('when the records cannot be decoded', async () => {
        await fc.assert(
          fc.asyncProperty(
            fc.urlSearchParams(),
            fc.response({ status: fc.constant(StatusCodes.OK), text: fc.string() }),
            async (query, response) => {
              const fetch: Fetch = () => Promise.resolve(response)

              const actual = await _.getRecords(query)({ fetch })()

              expect(actual).toStrictEqual(D.failure(expect.anything(), expect.anything()))
            },
          ),
        )
      })

      test('when the response has a non-200 status code', async () => {
        await fc.assert(
          fc.asyncProperty(
            fc.urlSearchParams(),
            fc.response({ status: fc.integer().filter(status => status !== StatusCodes.OK) }),
            async (query, response) => {
              const fetch: Fetch = () => Promise.resolve(response)

              const actual = await _.getRecords(query)({ fetch })()

              expect(actual).toStrictEqual(E.left(response))
            },
          ),
        )
      })

      test('when fetch throws an error', async () => {
        await fc.assert(
          fc.asyncProperty(fc.urlSearchParams(), fc.error(), async (query, error) => {
            const fetch: Fetch = () => Promise.reject(error)

            const actual = await _.getRecords(query)({ fetch })()

            expect(actual).toStrictEqual(E.left(error))
          }),
        )
      })
    })

    describe('createDeposition', () => {
      test('with a Zenodo URL', async () => {
        await fc.assert(
          fc.asyncProperty(
            fc.url(),
            fc.string(),
            fc.zenodoDepositMetadata(),
            fc.response(),
            async (zenodoUrl, zenodoApiKey, metadata, response) => {
              const fetch: jest.MockedFunction<Fetch> = jest.fn((_url, _init) => Promise.resolve(response))

              await _.createDeposition(metadata)({ fetch, zenodoApiKey, zenodoUrl })()

              expect(fetch).toHaveBeenCalledWith(`${zenodoUrl.origin}/api/deposit/depositions`, {
                body: expect.anything(),
                headers: {
                  Authorization: `Bearer ${zenodoApiKey}`,
                  'Content-Type': 'application/json',
                },
                method: 'POST',
              })
            },
          ),
        )
      })

      test('without a Zenodo URL', async () => {
        await fc.assert(
          fc.asyncProperty(
            fc.string(),
            fc.zenodoDepositMetadata(),
            fc.response(),
            async (zenodoApiKey, metadata, response) => {
              const fetch: jest.MockedFunction<Fetch> = jest.fn((_url, _init) => Promise.resolve(response))

              await _.createDeposition(metadata)({ fetch, zenodoApiKey })()

              expect(fetch).toHaveBeenCalledWith('https://zenodo.org/api/deposit/depositions', {
                body: expect.anything(),
                headers: {
                  Authorization: `Bearer ${zenodoApiKey}`,
                  'Content-Type': 'application/json',
                },
                method: 'POST',
              })
            },
          ),
        )
      })

      test('when the deposition can be decoded', async () => {
        await fc.assert(
          fc.asyncProperty(
            fc.string(),
            fc.zenodoDepositMetadata(),
            fc.zenodoUnsubmittedDeposition().chain(deposition =>
              fc.tuple(
                fc.constant(deposition),
                fc.response({
                  status: fc.constant(StatusCodes.CREATED),
                  text: fc.constant(_.UnsubmittedDepositionC.encode(deposition)),
                }),
              ),
            ),
            async (zenodoApiKey, metadata, [deposition, response]) => {
              const fetch: Fetch = () => Promise.resolve(response)

              const actual = await _.createDeposition(metadata)({ fetch, zenodoApiKey })()

              expect(actual).toStrictEqual(D.success(deposition))
            },
          ),
        )
      })

      test('when the deposition cannot be decoded', async () => {
        await fc.assert(
          fc.asyncProperty(
            fc.string(),
            fc.zenodoDepositMetadata(),
            fc.response({
              status: fc.constant(StatusCodes.CREATED),
              text: fc.string(),
            }),
            async (zenodoApiKey, metadata, response) => {
              const fetch: Fetch = () => Promise.resolve(response)

              const actual = await _.createDeposition(metadata)({ fetch, zenodoApiKey })()

              expect(actual).toStrictEqual(D.failure(expect.anything(), expect.anything()))
            },
          ),
        )
      })

      test('when the response has a non-201 status code', async () => {
        await fc.assert(
          fc.asyncProperty(
            fc.string(),
            fc.zenodoDepositMetadata(),
            fc.response({
              status: fc.integer().filter(status => status !== StatusCodes.CREATED),
              text: fc.string(),
            }),
            async (zenodoApiKey, metadata, response) => {
              const fetch: Fetch = () => Promise.resolve(response)

              const actual = await _.createDeposition(metadata)({ fetch, zenodoApiKey })()

              expect(actual).toStrictEqual(E.left(response))
            },
          ),
        )
      })

      test('when fetch throws an error', async () => {
        await fc.assert(
          fc.asyncProperty(
            fc.string(),
            fc.zenodoDepositMetadata(),
            fc.error(),
            async (zenodoApiKey, metadata, error) => {
              const fetch: Fetch = () => Promise.reject(error)

              const actual = await _.createDeposition(metadata)({ fetch, zenodoApiKey })()

              expect(actual).toStrictEqual(E.left(error))
            },
          ),
        )
      })
    })
  })

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

    describe('RecordsC', () => {
      test('when the records can be decoded', () => {
        fc.assert(
          fc.property(fc.zenodoRecords(), records => {
            const actual = pipe(records, _.RecordsC.encode, _.RecordsC.decode)

            expect(actual).toStrictEqual(D.success(records))
          }),
        )
      })

      test('when the records cannot be decoded', () => {
        fc.assert(
          fc.property(fc.string(), string => {
            const actual = _.RecordsC.decode(string)

            expect(actual).toStrictEqual(D.failure(expect.anything(), expect.anything()))
          }),
        )
      })
    })
    describe('UnsubmittedDepositionC', () => {
      test('when the unsubmitted deposition can be decoded', () => {
        fc.assert(
          fc.property(fc.zenodoUnsubmittedDeposition(), unsubmittedDeposition => {
            const actual = pipe(unsubmittedDeposition, _.UnsubmittedDepositionC.encode, _.UnsubmittedDepositionC.decode)

            expect(actual).toStrictEqual(D.success(unsubmittedDeposition))
          }),
        )
      })

      test('when the unsubmitted deposition cannot be decoded', () => {
        fc.assert(
          fc.property(fc.string(), string => {
            const actual = _.UnsubmittedDepositionC.decode(string)

            expect(actual).toStrictEqual(D.failure(expect.anything(), expect.anything()))
          }),
        )
      })
    })
  })
})
