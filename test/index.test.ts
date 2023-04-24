import { test } from '@fast-check/jest'
import { describe, expect, jest } from '@jest/globals'
import { Fetch } from 'fetch-fp-ts'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { StatusCodes } from 'http-status-codes'
import * as D from 'io-ts/Decoder'
import * as _ from '../src'
import * as fc from './fc'

describe('constructors', () => {
  describe('getRecord', () => {
    test.prop([fc.url(), fc.integer(), fc.response()])('with a Zenodo URL', async (zenodoUrl, id, response) => {
      const fetch: jest.MockedFunction<Fetch> = jest.fn((_url, _init) => Promise.resolve(response))

      await _.getRecord(id)({ fetch, zenodoUrl })()

      expect(fetch).toHaveBeenCalledWith(`${zenodoUrl.origin}/api/records/${id.toString()}`, {
        headers: {},
        method: 'GET',
      })
    })

    test.prop([fc.integer(), fc.response()])('without a Zenodo URL', async (id, response) => {
      const fetch: jest.MockedFunction<Fetch> = jest.fn((_url, _init) => Promise.resolve(response))

      await _.getRecord(id)({ fetch })()

      expect(fetch).toHaveBeenCalledWith(`https://zenodo.org/api/records/${id.toString()}`, {
        headers: {},
        method: 'GET',
      })
    })

    test.prop([fc.string(), fc.integer(), fc.response()])(
      'with a Zenodo API key',
      async (zenodoApiKey, id, response) => {
        const fetch: jest.MockedFunction<Fetch> = jest.fn((_url, _init) => Promise.resolve(response))

        await _.getRecord(id)({ fetch, zenodoApiKey })()

        expect(fetch).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            headers: expect.objectContaining({
              Authorization: `Bearer ${zenodoApiKey}`,
            }),
          }),
        )
      },
    )

    test.prop([
      fc.integer(),
      fc
        .zenodoRecord()
        .chain(record =>
          fc.tuple(
            fc.constant(record),
            fc.response({ status: fc.constant(StatusCodes.OK), text: fc.constant(_.RecordC.encode(record)) }),
          ),
        ),
    ])('when the record can be decoded', async (id, [record, response]) => {
      const fetch: Fetch = () => Promise.resolve(response)

      const actual = await _.getRecord(id)({ fetch })()

      expect(actual).toStrictEqual(D.success(record))
    })

    test.prop([
      fc.integer(),
      fc.response({
        status: fc.constant(StatusCodes.OK),
        text: fc.string(),
      }),
    ])('when the record cannot be decoded', async (id, response) => {
      const fetch: Fetch = () => Promise.resolve(response)

      const actual = await _.getRecord(id)({ fetch })()

      expect(actual).toStrictEqual(D.failure(expect.anything(), expect.anything() as never))
    })

    test.prop([fc.integer(), fc.response({ status: fc.integer().filter(status => status !== StatusCodes.OK) })])(
      'when the response has a non-200 status code',
      async (id, response) => {
        const fetch: Fetch = () => Promise.resolve(response)

        const actual = await _.getRecord(id)({ fetch })()

        expect(actual).toStrictEqual(E.left(response))
      },
    )

    test.prop([fc.integer(), fc.error()])('when fetch throws an error', async (id, error) => {
      const fetch: Fetch = () => Promise.reject(error)

      const actual = await _.getRecord(id)({ fetch })()

      expect(actual).toStrictEqual(E.left(error))
    })

    describe('getRecords', () => {
      test.prop([fc.url(), fc.urlSearchParams(), fc.response()])(
        'with a Zenodo URL',
        async (zenodoUrl, query, response) => {
          const fetch: jest.MockedFunction<Fetch> = jest.fn((_url, _init) => Promise.resolve(response))

          await _.getRecords(query)({ fetch, zenodoUrl })()

          expect(fetch).toHaveBeenCalledWith(`${zenodoUrl.origin}/api/records/?${query.toString()}`, {
            headers: {},
            method: 'GET',
          })
        },
      )

      test.prop([fc.urlSearchParams(), fc.response()])('without a Zenodo URL', async (query, response) => {
        const fetch: jest.MockedFunction<Fetch> = jest.fn((_url, _init) => Promise.resolve(response))

        await _.getRecords(query)({ fetch })()

        expect(fetch).toHaveBeenCalledWith(`https://zenodo.org/api/records/?${query.toString()}`, {
          headers: {},
          method: 'GET',
        })
      })

      test.prop([fc.string(), fc.urlSearchParams(), fc.response()])(
        'with a Zenodo API key',
        async (zenodoApiKey, query, response) => {
          const fetch: jest.MockedFunction<Fetch> = jest.fn((_url, _init) => Promise.resolve(response))

          await _.getRecords(query)({ fetch, zenodoApiKey })()

          expect(fetch).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
              headers: expect.objectContaining({
                Authorization: `Bearer ${zenodoApiKey}`,
              }),
            }),
          )
        },
      )

      test.prop([
        fc.urlSearchParams(),
        fc
          .zenodoRecords()
          .chain(records =>
            fc.tuple(
              fc.constant(records),
              fc.response({ status: fc.constant(StatusCodes.OK), text: fc.constant(_.RecordsC.encode(records)) }),
            ),
          ),
      ])('when the records can be decoded', async (query, [records, response]) => {
        const fetch: Fetch = () => Promise.resolve(response)

        const actual = await _.getRecords(query)({ fetch })()

        expect(actual).toStrictEqual(D.success(records))
      })

      test.prop([
        fc.urlSearchParams(),
        fc.response({
          status: fc.constant(StatusCodes.OK),
          text: fc.string(),
        }),
      ])('when the records cannot be decoded', async (query, response) => {
        const fetch: Fetch = () => Promise.resolve(response)

        const actual = await _.getRecords(query)({ fetch })()

        expect(actual).toStrictEqual(D.failure(expect.anything(), expect.anything() as never))
      })

      test.prop([
        fc.urlSearchParams(),
        fc.response({ status: fc.integer().filter(status => status !== StatusCodes.OK) }),
      ])('when the response has a non-200 status code', async (query, response) => {
        const fetch: Fetch = () => Promise.resolve(response)

        const actual = await _.getRecords(query)({ fetch })()

        expect(actual).toStrictEqual(E.left(response))
      })

      test.prop([fc.urlSearchParams(), fc.error()])('when fetch throws an error', async (query, error) => {
        const fetch: Fetch = () => Promise.reject(error)

        const actual = await _.getRecords(query)({ fetch })()

        expect(actual).toStrictEqual(E.left(error))
      })
    })

    describe('createDeposition', () => {
      test.prop([fc.url(), fc.string(), fc.zenodoDepositMetadata(), fc.response()])(
        'with a Zenodo URL',
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
      )

      test.prop([fc.string(), fc.zenodoDepositMetadata(), fc.response()])(
        'without a Zenodo URL',
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
      )

      test.prop([
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
      ])('when the deposition can be decoded', async (zenodoApiKey, metadata, [deposition, response]) => {
        const fetch: Fetch = () => Promise.resolve(response)

        const actual = await _.createDeposition(metadata)({ fetch, zenodoApiKey })()

        expect(actual).toStrictEqual(D.success(deposition))
      })

      test.prop([
        fc.string(),
        fc.zenodoDepositMetadata(),
        fc.response({
          status: fc.constant(StatusCodes.CREATED),
          text: fc.string(),
        }),
      ])('when the deposition cannot be decoded', async (zenodoApiKey, metadata, response) => {
        const fetch: Fetch = () => Promise.resolve(response)

        const actual = await _.createDeposition(metadata)({ fetch, zenodoApiKey })()

        expect(actual).toStrictEqual(D.failure(expect.anything(), expect.anything() as never))
      })

      test.prop([
        fc.string(),
        fc.zenodoDepositMetadata(),
        fc.response({
          status: fc.integer().filter(status => status !== StatusCodes.CREATED),
          text: fc.string(),
        }),
      ])('when the response has a non-201 status code', async (zenodoApiKey, metadata, response) => {
        const fetch: Fetch = () => Promise.resolve(response)

        const actual = await _.createDeposition(metadata)({ fetch, zenodoApiKey })()

        expect(actual).toStrictEqual(E.left(response))
      })

      test.prop([fc.string(), fc.zenodoDepositMetadata(), fc.error()])(
        'when fetch throws an error',
        async (zenodoApiKey, metadata, error) => {
          const fetch: Fetch = () => Promise.reject(error)

          const actual = await _.createDeposition(metadata)({ fetch, zenodoApiKey })()

          expect(actual).toStrictEqual(E.left(error))
        },
      )
    })

    describe('uploadFile', () => {
      test.prop([
        fc.string(),
        fc.zenodoUnsubmittedDeposition(),
        fc.string(),
        fc.string(),
        fc.string(),
        fc.response({
          status: fc.constantFrom(StatusCodes.CREATED, StatusCodes.OK),
        }),
      ])(
        'when the response has a 200/201 status code',
        async (zenodoApiKey, deposition, name, type, content, response) => {
          const fetch: jest.MockedFunction<Fetch> = jest.fn((_url, _init) => Promise.resolve(response))

          const actual = await _.uploadFile({ name, type, content })(deposition)({ fetch, zenodoApiKey })()

          expect(actual).toStrictEqual(D.success(undefined))
          expect(fetch).toHaveBeenCalledWith(`${deposition.links.bucket.href}/${name}`, {
            body: content,
            headers: {
              Authorization: `Bearer ${zenodoApiKey}`,
              'Content-Type': type,
            },
            method: 'PUT',
          })
        },
      )

      test.prop([
        fc.string(),
        fc.zenodoUnsubmittedDeposition(),
        fc.string(),
        fc.string(),
        fc.string(),
        fc.response({
          status: fc.integer().filter(status => status !== StatusCodes.CREATED && status !== StatusCodes.OK),
        }),
      ])(
        'when the response has a non-200/201 status code',
        async (zenodoApiKey, deposition, name, type, content, response) => {
          const fetch: Fetch = () => Promise.resolve(response)

          const actual = await _.uploadFile({ name, type, content })(deposition)({ fetch, zenodoApiKey })()

          expect(actual).toStrictEqual(E.left(response))
        },
      )

      test.prop([fc.string(), fc.zenodoUnsubmittedDeposition(), fc.string(), fc.string(), fc.string(), fc.error()])(
        'when fetch throws an error',
        async (zenodoApiKey, deposition, name, type, content, error) => {
          const fetch: Fetch = () => Promise.reject(error)

          const actual = await _.uploadFile({ name, type, content })(deposition)({ fetch, zenodoApiKey })()

          expect(actual).toStrictEqual(E.left(error))
        },
      )
    })

    describe('publishDeposition', () => {
      test.prop([
        fc.string(),
        fc.zenodoUnsubmittedDeposition(),
        fc.zenodoSubmittedDeposition().chain(submittedDeposition =>
          fc.tuple(
            fc.constant(submittedDeposition),
            fc.response({
              status: fc.constant(StatusCodes.ACCEPTED),
              text: fc.constant(_.SubmittedDepositionC.encode(submittedDeposition)),
            }),
          ),
        ),
      ])(
        'when the deposition can be decoded',
        async (zenodoApiKey, unsubmittedDeposition, [submittedDeposition, response]) => {
          const fetch: jest.MockedFunction<Fetch> = jest.fn((_url, _init) => Promise.resolve(response))

          const actual = await _.publishDeposition(unsubmittedDeposition)({ fetch, zenodoApiKey })()

          expect(actual).toStrictEqual(D.success(submittedDeposition))
          expect(fetch).toHaveBeenCalledWith(unsubmittedDeposition.links.publish.href, {
            headers: {
              Authorization: `Bearer ${zenodoApiKey}`,
            },
            method: 'POST',
          })
        },
      )

      test.prop([
        fc.string(),
        fc.zenodoUnsubmittedDeposition(),
        fc.response({
          status: fc.constant(StatusCodes.ACCEPTED),
          text: fc.string(),
        }),
      ])('when the deposition cannot be decoded', async (zenodoApiKey, unsubmittedDeposition, response) => {
        const fetch: Fetch = () => Promise.resolve(response)

        const actual = await _.publishDeposition(unsubmittedDeposition)({ fetch, zenodoApiKey })()

        expect(actual).toStrictEqual(D.failure(expect.anything(), expect.anything() as never))
      })

      test.prop([
        fc.string(),
        fc.zenodoUnsubmittedDeposition(),
        fc.response({
          status: fc.integer().filter(status => status !== StatusCodes.ACCEPTED),
          text: fc.string(),
        }),
      ])('when the response has a non-202 status code', async (zenodoApiKey, unsubmittedDeposition, response) => {
        const fetch: Fetch = () => Promise.resolve(response)

        const actual = await _.publishDeposition(unsubmittedDeposition)({ fetch, zenodoApiKey })()

        expect(actual).toStrictEqual(E.left(response))
      })

      test.prop([fc.string(), fc.zenodoUnsubmittedDeposition(), fc.error()])(
        'when fetch throws an error',
        async (zenodoApiKey, unsubmittedDeposition, error) => {
          const fetch: Fetch = () => Promise.reject(error)

          const actual = await _.publishDeposition(unsubmittedDeposition)({ fetch, zenodoApiKey })()

          expect(actual).toStrictEqual(E.left(error))
        },
      )
    })
  })
})

describe('codecs', () => {
  describe('RecordC', () => {
    test.prop([fc.zenodoRecord()])('when the record can be decoded', record => {
      const actual = pipe(record, _.RecordC.encode, _.RecordC.decode)

      expect(actual).toStrictEqual(D.success(record))
    })

    test.prop([fc.string()])('when the record cannot be decoded', string => {
      const actual = _.RecordC.decode(string)

      expect(actual).toStrictEqual(D.failure(expect.anything(), expect.anything() as never))
    })
  })

  describe('RecordsC', () => {
    test.prop([fc.zenodoRecords()])('when the records can be decoded', records => {
      const actual = pipe(records, _.RecordsC.encode, _.RecordsC.decode)

      expect(actual).toStrictEqual(D.success(records))
    })

    test.prop([fc.string()])('when the records cannot be decoded', string => {
      const actual = _.RecordsC.decode(string)

      expect(actual).toStrictEqual(D.failure(expect.anything(), expect.anything() as never))
    })
  })

  describe('SubmittedDepositionC', () => {
    test.prop([fc.zenodoSubmittedDeposition()])('when the submitted deposition can be decoded', submittedDeposition => {
      const actual = pipe(submittedDeposition, _.SubmittedDepositionC.encode, _.SubmittedDepositionC.decode)

      expect(actual).toStrictEqual(D.success(submittedDeposition))
    })

    test.prop([fc.string()])('when the submitted deposition cannot be decoded', string => {
      const actual = _.SubmittedDepositionC.decode(string)

      expect(actual).toStrictEqual(D.failure(expect.anything(), expect.anything() as never))
    })
  })

  describe('UnsubmittedDepositionC', () => {
    test.prop([fc.zenodoUnsubmittedDeposition()])(
      'when the unsubmitted deposition can be decoded',
      unsubmittedDeposition => {
        const actual = pipe(unsubmittedDeposition, _.UnsubmittedDepositionC.encode, _.UnsubmittedDepositionC.decode)

        expect(actual).toStrictEqual(D.success(unsubmittedDeposition))
      },
    )

    test.prop([fc.string()])('when the unsubmitted deposition cannot be decoded', string => {
      const actual = _.UnsubmittedDepositionC.decode(string)

      expect(actual).toStrictEqual(D.failure(expect.anything(), expect.anything() as never))
    })
  })
})
