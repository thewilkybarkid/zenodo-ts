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
        headers: { Accept: 'application/json' },
        method: 'GET',
      })
    })

    test.prop([fc.integer(), fc.response()])('without a Zenodo URL', async (id, response) => {
      const fetch: jest.MockedFunction<Fetch> = jest.fn((_url, _init) => Promise.resolve(response))

      await _.getRecord(id)({ fetch })()

      expect(fetch).toHaveBeenCalledWith(`https://zenodo.org/api/records/${id.toString()}`, {
        headers: { Accept: 'application/json' },
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
  })

  describe('getRecords', () => {
    test.prop([fc.url(), fc.urlSearchParams(), fc.response()])(
      'with a Zenodo URL',
      async (zenodoUrl, query, response) => {
        const fetch: jest.MockedFunction<Fetch> = jest.fn((_url, _init) => Promise.resolve(response))

        await _.getRecords(query)({ fetch, zenodoUrl })()

        expect(fetch).toHaveBeenCalledWith(`${zenodoUrl.origin}/api/records?${query.toString()}`, {
          headers: { Accept: 'application/json' },
          method: 'GET',
        })
      },
    )

    test.prop([fc.urlSearchParams(), fc.response()])('without a Zenodo URL', async (query, response) => {
      const fetch: jest.MockedFunction<Fetch> = jest.fn((_url, _init) => Promise.resolve(response))

      await _.getRecords(query)({ fetch })()

      expect(fetch).toHaveBeenCalledWith(`https://zenodo.org/api/records?${query.toString()}`, {
        headers: { Accept: 'application/json' },
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

  describe('getCommunityRecords', () => {
    test.prop([fc.url(), fc.lorem(), fc.urlSearchParams(), fc.response()])(
      'with a Zenodo URL',
      async (zenodoUrl, community, query, response) => {
        const fetch: jest.MockedFunction<Fetch> = jest.fn((_url, _init) => Promise.resolve(response))

        await _.getCommunityRecords(community)(query)({ fetch, zenodoUrl })()

        expect(fetch).toHaveBeenCalledWith(
          `${zenodoUrl.origin}/api/communities/${encodeURIComponent(community)}/records?${query.toString()}`,
          {
            headers: { Accept: 'application/json' },
            method: 'GET',
          },
        )
      },
    )

    test.prop([fc.lorem(), fc.urlSearchParams(), fc.response()])(
      'without a Zenodo URL',
      async (community, query, response) => {
        const fetch: jest.MockedFunction<Fetch> = jest.fn((_url, _init) => Promise.resolve(response))

        await _.getCommunityRecords(community)(query)({ fetch })()

        expect(fetch).toHaveBeenCalledWith(
          `https://zenodo.org/api/communities/${encodeURIComponent(community)}/records?${query.toString()}`,
          {
            headers: { Accept: 'application/json' },
            method: 'GET',
          },
        )
      },
    )

    test.prop([fc.string(), fc.lorem(), fc.urlSearchParams(), fc.response()])(
      'with a Zenodo API key',
      async (zenodoApiKey, community, query, response) => {
        const fetch: jest.MockedFunction<Fetch> = jest.fn((_url, _init) => Promise.resolve(response))

        await _.getCommunityRecords(community)(query)({ fetch, zenodoApiKey })()

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
      fc.lorem(),
      fc.urlSearchParams(),
      fc
        .zenodoRecords()
        .chain(records =>
          fc.tuple(
            fc.constant(records),
            fc.response({ status: fc.constant(StatusCodes.OK), text: fc.constant(_.RecordsC.encode(records)) }),
          ),
        ),
    ])('when the records can be decoded', async (community, query, [records, response]) => {
      const fetch: Fetch = () => Promise.resolve(response)

      const actual = await _.getCommunityRecords(community)(query)({ fetch })()

      expect(actual).toStrictEqual(D.success(records))
    })

    test.prop([
      fc.lorem(),
      fc.urlSearchParams(),
      fc.response({
        status: fc.constant(StatusCodes.OK),
        text: fc.string(),
      }),
    ])('when the records cannot be decoded', async (community, query, response) => {
      const fetch: Fetch = () => Promise.resolve(response)

      const actual = await _.getCommunityRecords(community)(query)({ fetch })()

      expect(actual).toStrictEqual(D.failure(expect.anything(), expect.anything() as never))
    })

    test.prop([
      fc.lorem(),
      fc.urlSearchParams(),
      fc.response({ status: fc.integer().filter(status => status !== StatusCodes.OK) }),
    ])('when the response has a non-200 status code', async (community, query, response) => {
      const fetch: Fetch = () => Promise.resolve(response)

      const actual = await _.getCommunityRecords(community)(query)({ fetch })()

      expect(actual).toStrictEqual(E.left(response))
    })

    test.prop([fc.lorem(), fc.urlSearchParams(), fc.error()])(
      'when fetch throws an error',
      async (community, query, error) => {
        const fetch: Fetch = () => Promise.reject(error)

        const actual = await _.getCommunityRecords(community)(query)({ fetch })()

        expect(actual).toStrictEqual(E.left(error))
      },
    )
  })

  describe('getDeposition', () => {
    test.prop([fc.url(), fc.string(), fc.integer(), fc.response()])(
      'with a Zenodo URL',
      async (zenodoUrl, zenodoApiKey, id, response) => {
        const fetch: jest.MockedFunction<Fetch> = jest.fn((_url, _init) => Promise.resolve(response))

        await _.getDeposition(id)({ fetch, zenodoApiKey, zenodoUrl })()

        expect(fetch).toHaveBeenCalledWith(`${zenodoUrl.origin}/api/deposit/depositions/${id.toString()}`, {
          headers: { Accept: 'application/json', Authorization: `Bearer ${zenodoApiKey}` },
          method: 'GET',
        })
      },
    )

    test.prop([fc.string(), fc.integer(), fc.response()])(
      'without a Zenodo URL',
      async (zenodoApiKey, id, response) => {
        const fetch: jest.MockedFunction<Fetch> = jest.fn((_url, _init) => Promise.resolve(response))

        await _.getDeposition(id)({ fetch, zenodoApiKey })()

        expect(fetch).toHaveBeenCalledWith(`https://zenodo.org/api/deposit/depositions/${id.toString()}`, {
          headers: { Accept: 'application/json', Authorization: `Bearer ${zenodoApiKey}` },
          method: 'GET',
        })
      },
    )

    test.prop([
      fc.string(),
      fc.integer(),
      fc
        .zenodoDeposition()
        .chain(deposition =>
          fc.tuple(
            fc.constant(deposition),
            fc.response({ status: fc.constant(StatusCodes.OK), text: fc.constant(_.DepositionC.encode(deposition)) }),
          ),
        ),
    ])('when the deposition can be decoded', async (zenodoApiKey, id, [deposition, response]) => {
      const fetch: Fetch = () => Promise.resolve(response)

      const actual = await _.getDeposition(id)({ fetch, zenodoApiKey })()

      expect(actual).toStrictEqual(D.success(deposition))
    })

    test.prop([
      fc.string(),
      fc.integer(),
      fc.response({
        status: fc.constant(StatusCodes.OK),
        text: fc.string(),
      }),
    ])('when the deposition cannot be decoded', async (zenodoApiKey, id, response) => {
      const fetch: Fetch = () => Promise.resolve(response)

      const actual = await _.getDeposition(id)({ fetch, zenodoApiKey })()

      expect(actual).toStrictEqual(E.left(expect.anything()))
    })

    test.prop([
      fc.string(),
      fc.integer(),
      fc.response({ status: fc.integer().filter(status => status !== StatusCodes.OK) }),
    ])('when the response has a non-200 status code', async (zenodoApiKey, id, response) => {
      const fetch: Fetch = () => Promise.resolve(response)

      const actual = await _.getDeposition(id)({ fetch, zenodoApiKey })()

      expect(actual).toStrictEqual(E.left(response))
    })

    test.prop([fc.string(), fc.integer(), fc.error()])(
      'when fetch throws an error',
      async (zenodoApiKey, id, error) => {
        const fetch: Fetch = () => Promise.reject(error)

        const actual = await _.getDeposition(id)({ fetch, zenodoApiKey })()

        expect(actual).toStrictEqual(E.left(error))
      },
    )
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
            Accept: 'application/json',
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
            Accept: 'application/json',
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

  describe('createEmptyDeposition', () => {
    test.prop([fc.url(), fc.string(), fc.response()])(
      'with a Zenodo URL',
      async (zenodoUrl, zenodoApiKey, response) => {
        const fetch: jest.MockedFunction<Fetch> = jest.fn((_url, _init) => Promise.resolve(response))

        await _.createEmptyDeposition()({ fetch, zenodoApiKey, zenodoUrl })()

        expect(fetch).toHaveBeenCalledWith(`${zenodoUrl.origin}/api/deposit/depositions`, {
          body: '{}',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${zenodoApiKey}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
        })
      },
    )

    test.prop([fc.string(), fc.response()])('without a Zenodo URL', async (zenodoApiKey, response) => {
      const fetch: jest.MockedFunction<Fetch> = jest.fn((_url, _init) => Promise.resolve(response))

      await _.createEmptyDeposition()({ fetch, zenodoApiKey })()

      expect(fetch).toHaveBeenCalledWith('https://zenodo.org/api/deposit/depositions', {
        body: '{}',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${zenodoApiKey}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })
    })

    test.prop([
      fc.string(),
      fc.zenodoEmptyDeposition().chain(deposition =>
        fc.tuple(
          fc.constant(deposition),
          fc.response({
            status: fc.constant(StatusCodes.CREATED),
            text: fc.constant(_.EmptyDepositionC.encode(deposition)),
          }),
        ),
      ),
    ])('when the deposition can be decoded', async (zenodoApiKey, [deposition, response]) => {
      const fetch: Fetch = () => Promise.resolve(response)

      const actual = await _.createEmptyDeposition()({ fetch, zenodoApiKey })()

      expect(actual).toStrictEqual(D.success(deposition))
    })

    test.prop([
      fc.string(),
      fc.response({
        status: fc.constant(StatusCodes.CREATED),
        text: fc.string(),
      }),
    ])('when the deposition cannot be decoded', async (zenodoApiKey, response) => {
      const fetch: Fetch = () => Promise.resolve(response)

      const actual = await _.createEmptyDeposition()({ fetch, zenodoApiKey })()

      expect(actual).toStrictEqual(D.failure(expect.anything(), expect.anything() as never))
    })

    test.prop([
      fc.string(),
      fc.response({
        status: fc.integer().filter(status => status !== StatusCodes.CREATED),
        text: fc.string(),
      }),
    ])('when the response has a non-201 status code', async (zenodoApiKey, response) => {
      const fetch: Fetch = () => Promise.resolve(response)

      const actual = await _.createEmptyDeposition()({ fetch, zenodoApiKey })()

      expect(actual).toStrictEqual(E.left(response))
    })

    test.prop([fc.string(), fc.error()])('when fetch throws an error', async (zenodoApiKey, error) => {
      const fetch: Fetch = () => Promise.reject(error)

      const actual = await _.createEmptyDeposition()({ fetch, zenodoApiKey })()

      expect(actual).toStrictEqual(E.left(error))
    })
  })

  describe('updateDeposition', () => {
    test.prop([
      fc.string(),
      fc.zenodoDepositMetadata(),
      fc.oneof(fc.zenodoEmptyDeposition(), fc.zenodoUnsubmittedDeposition()),
      fc.zenodoUnsubmittedDeposition().chain(unsubmittedDeposition =>
        fc.tuple(
          fc.constant(unsubmittedDeposition),
          fc.response({
            status: fc.constant(StatusCodes.OK),
            text: fc.constant(_.UnsubmittedDepositionC.encode(unsubmittedDeposition)),
          }),
        ),
      ),
    ])('when the deposition can be decoded', async (zenodoApiKey, metadata, deposition, [expected, response]) => {
      const fetch: jest.MockedFunction<Fetch> = jest.fn((_url, _init) => Promise.resolve(response))

      const actual = await _.updateDeposition(metadata, deposition)({ fetch, zenodoApiKey })()

      expect(actual).toStrictEqual(D.success(expected))
      expect(fetch).toHaveBeenCalledWith(deposition.links.self.href, {
        body: expect.anything(),
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${zenodoApiKey}`,
          'Content-Type': 'application/json',
        },
        method: 'PUT',
      })
    })

    test.prop([
      fc.string(),
      fc.zenodoDepositMetadata(),
      fc.oneof(fc.zenodoEmptyDeposition(), fc.zenodoUnsubmittedDeposition()),
      fc.response({
        status: fc.constant(StatusCodes.OK),
        text: fc.string(),
      }),
    ])('when the deposition cannot be decoded', async (zenodoApiKey, metadata, deposition, response) => {
      const fetch: Fetch = () => Promise.resolve(response)

      const actual = await _.updateDeposition(metadata, deposition)({ fetch, zenodoApiKey })()

      expect(actual).toStrictEqual(D.failure(expect.anything(), expect.anything() as never))
    })

    test.prop([
      fc.string(),
      fc.zenodoDepositMetadata(),
      fc.oneof(fc.zenodoEmptyDeposition(), fc.zenodoUnsubmittedDeposition()),
      fc.response({
        status: fc.integer().filter(status => status !== StatusCodes.OK),
        text: fc.string(),
      }),
    ])('when the response has a non-200 status code', async (zenodoApiKey, metadata, deposition, response) => {
      const fetch: Fetch = () => Promise.resolve(response)

      const actual = await _.updateDeposition(metadata, deposition)({ fetch, zenodoApiKey })()

      expect(actual).toStrictEqual(E.left(response))
    })

    test.prop([
      fc.string(),
      fc.zenodoDepositMetadata(),
      fc.oneof(fc.zenodoEmptyDeposition(), fc.zenodoUnsubmittedDeposition()),
      fc.error(),
    ])('when fetch throws an error', async (zenodoApiKey, metadata, deposition, error) => {
      const fetch: Fetch = () => Promise.reject(error)

      const actual = await _.updateDeposition(metadata, deposition)({ fetch, zenodoApiKey })()

      expect(actual).toStrictEqual(E.left(error))
    })
  })

  describe('uploadFile', () => {
    test.prop([
      fc.string(),
      fc.oneof(fc.zenodoEmptyDeposition(), fc.zenodoUnsubmittedDeposition()),
      fc.string(),
      fc.string(),
      fc.response({
        status: fc.constantFrom(StatusCodes.CREATED, StatusCodes.OK),
      }),
    ])('when the response has a 200/201 status code', async (zenodoApiKey, deposition, name, content, response) => {
      const fetch: jest.MockedFunction<Fetch> = jest.fn((_url, _init) => Promise.resolve(response))

      const actual = await _.uploadFile({ name, content })(deposition)({ fetch, zenodoApiKey })()

      expect(actual).toStrictEqual(D.success(undefined))
      expect(fetch).toHaveBeenCalledWith(`${deposition.links.bucket.href}/${name}`, {
        body: content,
        headers: {
          Authorization: `Bearer ${zenodoApiKey}`,
          'Content-Type': 'application/octet-stream',
        },
        method: 'PUT',
      })
    })

    test.prop([
      fc.string(),
      fc.oneof(fc.zenodoEmptyDeposition(), fc.zenodoUnsubmittedDeposition()),
      fc.string(),
      fc.string(),
      fc.response({
        status: fc.integer().filter(status => status !== StatusCodes.CREATED && status !== StatusCodes.OK),
      }),
    ])('when the response has a non-200/201 status code', async (zenodoApiKey, deposition, name, content, response) => {
      const fetch: Fetch = () => Promise.resolve(response)

      const actual = await _.uploadFile({ name, content })(deposition)({ fetch, zenodoApiKey })()

      expect(actual).toStrictEqual(E.left(response))
    })

    test.prop([
      fc.string(),
      fc.oneof(fc.zenodoEmptyDeposition(), fc.zenodoUnsubmittedDeposition()),
      fc.string(),
      fc.string(),
      fc.error(),
    ])('when fetch throws an error', async (zenodoApiKey, deposition, name, content, error) => {
      const fetch: Fetch = () => Promise.reject(error)

      const actual = await _.uploadFile({ name, content })(deposition)({ fetch, zenodoApiKey })()

      expect(actual).toStrictEqual(E.left(error))
    })
  })

  describe('publishDeposition', () => {
    test.prop([
      fc.string(),
      fc.oneof(fc.zenodoInProgressDeposition(), fc.zenodoUnsubmittedDeposition()),
      fc.zenodoSubmittedDeposition().chain(submittedDeposition =>
        fc.tuple(
          fc.constant(submittedDeposition),
          fc.response({
            status: fc.constant(StatusCodes.ACCEPTED),
            text: fc.constant(_.SubmittedDepositionC.encode(submittedDeposition)),
          }),
        ),
      ),
    ])('when the deposition can be decoded', async (zenodoApiKey, deposition, [submittedDeposition, response]) => {
      const fetch: jest.MockedFunction<Fetch> = jest.fn((_url, _init) => Promise.resolve(response))

      const actual = await _.publishDeposition(deposition)({ fetch, zenodoApiKey })()

      expect(actual).toStrictEqual(D.success(submittedDeposition))
      expect(fetch).toHaveBeenCalledWith(deposition.links.publish.href, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${zenodoApiKey}`,
        },
        method: 'POST',
      })
    })

    test.prop([
      fc.string(),
      fc.oneof(fc.zenodoInProgressDeposition(), fc.zenodoUnsubmittedDeposition()),
      fc.response({
        status: fc.constant(StatusCodes.ACCEPTED),
        text: fc.string(),
      }),
    ])('when the deposition cannot be decoded', async (zenodoApiKey, deposition, response) => {
      const fetch: Fetch = () => Promise.resolve(response)

      const actual = await _.publishDeposition(deposition)({ fetch, zenodoApiKey })()

      expect(actual).toStrictEqual(D.failure(expect.anything(), expect.anything() as never))
    })

    test.prop([
      fc.string(),
      fc.oneof(fc.zenodoInProgressDeposition(), fc.zenodoUnsubmittedDeposition()),
      fc.response({
        status: fc.integer().filter(status => status !== StatusCodes.ACCEPTED),
        text: fc.string(),
      }),
    ])('when the response has a non-202 status code', async (zenodoApiKey, deposition, response) => {
      const fetch: Fetch = () => Promise.resolve(response)

      const actual = await _.publishDeposition(deposition)({ fetch, zenodoApiKey })()

      expect(actual).toStrictEqual(E.left(response))
    })

    test.prop([fc.string(), fc.oneof(fc.zenodoInProgressDeposition(), fc.zenodoUnsubmittedDeposition()), fc.error()])(
      'when fetch throws an error',
      async (zenodoApiKey, deposition, error) => {
        const fetch: Fetch = () => Promise.reject(error)

        const actual = await _.publishDeposition(deposition)({ fetch, zenodoApiKey })()

        expect(actual).toStrictEqual(E.left(error))
      },
    )
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

  describe('EmptyDepositionC', () => {
    test.prop([fc.zenodoEmptyDeposition()])('when the empty deposition can be decoded', emptyDeposition => {
      const actual = pipe(emptyDeposition, _.EmptyDepositionC.encode, _.EmptyDepositionC.decode)

      expect(actual).toStrictEqual(D.success(emptyDeposition))
    })

    test.prop([fc.string()])('when the empty deposition cannot be decoded', string => {
      const actual = _.EmptyDepositionC.decode(string)

      expect(actual).toStrictEqual(D.failure(expect.anything(), expect.anything() as never))
    })
  })

  describe('InProgressDepositionC', () => {
    test.prop([fc.zenodoInProgressDeposition()])(
      'when the in-progress deposition can be decoded',
      inProgressDeposition => {
        const actual = pipe(inProgressDeposition, _.InProgressDepositionC.encode, _.InProgressDepositionC.decode)

        expect(actual).toStrictEqual(D.success(inProgressDeposition))
      },
    )

    test.prop([fc.string()])('when the in-progress deposition cannot be decoded', string => {
      const actual = _.InProgressDepositionC.decode(string)

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

  describe('DepositionC', () => {
    test.prop([fc.zenodoDeposition()])('when the deposition can be decoded', deposition => {
      const actual = pipe(deposition, _.DepositionC.encode, _.DepositionC.decode)

      expect(actual).toStrictEqual(D.success(deposition))
    })

    test.prop([fc.string()])('when the deposition cannot be decoded', string => {
      const actual = _.DepositionC.decode(string)

      expect(actual).toStrictEqual(E.left(expect.anything()))
    })
  })
})
