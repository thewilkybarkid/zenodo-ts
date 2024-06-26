import { mod11_2 } from 'cdigit'
import { Doi, isDoi } from 'doi-ts'
import * as fc from 'fast-check'
import { Response } from 'fetch-fp-ts'
import { isNonEmpty } from 'fp-ts/Array'
import { Headers } from 'node-fetch'
import { Orcid, isOrcid } from 'orcid-id-ts'
import merge from 'ts-deepmerge'
import * as _ from '../src'

export * from 'fast-check'

export const error = (): fc.Arbitrary<Error> => fc.string().map(error => new Error(error))

export const url = (): fc.Arbitrary<URL> => fc.webUrl().map(url => new URL(url))

export const urlSearchParams = (): fc.Arbitrary<URLSearchParams> =>
  fc.webQueryParameters().map(params => new URLSearchParams(params))

export const doi = (): fc.Arbitrary<Doi> =>
  fc
    .tuple(
      fc.stringOf(fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9'), { minLength: 4 }),
      fc.unicodeString({ minLength: 1 }),
    )
    .map(([prefix, suffix]) => `10.${prefix}/${suffix}` as Doi)
    .filter(isDoi)

export const orcid = (): fc.Arbitrary<Orcid> =>
  fc
    .stringOf(fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9'), {
      minLength: 4 + 4 + 4 + 3,
      maxLength: 4 + 4 + 4 + 3,
    })
    .map(value => mod11_2.generate(value).replace(/.{4}(?=.)/g, '$&-'))
    .filter(isOrcid)

const headerName = () =>
  fc.stringOf(
    fc.char().filter(char => /^[\^_`a-zA-Z\-0-9!#$%&'*+.|~]$/.test(char)),
    { minLength: 1 },
  )

const headers = () =>
  fc.option(fc.dictionary(headerName(), fc.string()), { nil: undefined }).map(init => new Headers(init))

export const response = ({
  status,
  text,
}: { status?: fc.Arbitrary<number>; text?: fc.Arbitrary<string | Promise<string>> } = {}): fc.Arbitrary<Response> =>
  fc.record({
    headers: headers(),
    status: status ?? fc.integer(),
    statusText: fc.string(),
    url: fc.string(),
    text: fc.func((text ?? fc.string()).map(text => Promise.resolve(text))),
  })

export const zenodoRecord = (): fc.Arbitrary<_.Record> =>
  fc
    .tuple(
      fc.record({
        conceptrecid: fc.integer(),
        id: fc.integer(),
        links: fc.record({
          latest: url(),
          latest_html: url(),
        }),
        metadata: fc.record({
          creators: fc
            .array(
              fc.record(
                {
                  name: fc.string(),
                  orcid: orcid(),
                },
                { requiredKeys: ['name'] },
              ),
              { minLength: 1 },
            )
            .filter(isNonEmpty),
          doi: doi(),
          publication_date: fc
            .date({ min: new Date('0000-01-01T00:00:00.000Z'), max: new Date('9999-12-31T23:59:59.999Z') })
            .map(date => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))),
          resource_type: fc.oneof(
            fc.record({
              type: fc.constantFrom(
                'dataset' as const,
                'figure' as const,
                'lesson' as const,
                'other' as const,
                'physicalobject' as const,
                'poster' as const,
                'presentation' as const,
                'software' as const,
                'video' as const,
              ),
            }),
            fc.record(
              {
                type: fc.constant('image' as const),
                subtype: fc.constantFrom(
                  'diagram' as const,
                  'drawing' as const,
                  'figure' as const,
                  'other' as const,
                  'photo' as const,
                  'plot' as const,
                ),
              },
              { requiredKeys: ['type'] },
            ),
            fc.record(
              {
                type: fc.constant('publication' as const),
                subtype: fc.constantFrom(
                  'annotationcollection' as const,
                  'article' as const,
                  'book' as const,
                  'conferencepaper' as const,
                  'datamanagementplan' as const,
                  'datapaper' as const,
                  'deliverable' as const,
                  'milestone' as const,
                  'other' as const,
                  'patent' as const,
                  'peerreview' as const,
                  'preprint' as const,
                  'proposal' as const,
                  'report' as const,
                  'section' as const,
                  'softwaredocumentation' as const,
                  'taxonomictreatment' as const,
                  'technicalnote' as const,
                  'thesis' as const,
                  'workingpaper' as const,
                ),
              },
              { requiredKeys: ['type'] },
            ),
          ),
          title: fc.string(),
        }),
      }),
      fc.oneof(
        fc.record({
          files: fc
            .array(
              fc.record({
                key: fc.string(),
                links: fc.record({
                  self: url(),
                }),
                size: fc.integer(),
              }),
              { minLength: 1 },
            )
            .filter(isNonEmpty),
          metadata: fc.record({
            access_right: fc.constant('open' as const),
            license: fc.record({ id: fc.string() }),
          }),
        }),
        fc.record({
          metadata: fc.record({
            access_right: fc.constant('embargoed' as const),
            embargo_date: fc
              .date({ min: new Date('0000-01-01T00:00:00.000Z'), max: new Date('9999-12-31T23:59:59.999Z') })
              .map(date => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))),
            license: fc.record({ id: fc.string() }),
          }),
        }),
        fc.record({
          metadata: fc.record(
            {
              access_right: fc.constant('restricted' as const),
              license: fc.record({ id: fc.string() }),
            },
            { requiredKeys: ['access_right'] },
          ),
        }),
      ),
      fc.record(
        {
          conceptdoi: doi(),
          metadata: fc.record(
            {
              communities: fc
                .array(
                  fc.record({
                    id: fc.string(),
                  }),
                  { minLength: 1 },
                )
                .filter(isNonEmpty),
              contributors: fc
                .array(
                  fc.record(
                    {
                      name: fc.string(),
                      orcid: orcid(),
                      type: fc.string(),
                    },
                    { requiredKeys: ['name', 'type'] },
                  ),
                  { minLength: 1 },
                )
                .filter(isNonEmpty),
              description: fc.string(),
              keywords: fc.array(fc.string(), { minLength: 1 }).filter(isNonEmpty),
              notes: fc.string(),
              related_identifiers: fc
                .array(
                  fc.record(
                    {
                      scheme: fc.string(),
                      identifier: fc.string(),
                      relation: fc.string(),
                      resource_type: fc.string(),
                    },
                    { requiredKeys: ['scheme', 'identifier', 'relation'] },
                  ),
                  { minLength: 1 },
                )
                .filter(isNonEmpty),
              language: fc.string(),
              subjects: fc
                .array(
                  fc.record({
                    scheme: fc.string(),
                    identifier: fc.string(),
                    term: fc.string(),
                  }),
                  { minLength: 1 },
                )
                .filter(isNonEmpty),
            },
            { withDeletedKeys: true },
          ),
        },
        { withDeletedKeys: true },
      ),
    )
    .map(records => merge.withOptions({ mergeArrays: false }, ...records))

export const zenodoRecords = (): fc.Arbitrary<_.Records> =>
  fc.record({
    hits: fc.record({
      hits: fc.array(zenodoRecord()),
      total: fc.integer({ min: 0 }),
    }),
  })

export const zenodoDepositMetadata = (): fc.Arbitrary<_.DepositMetadata> =>
  fc
    .tuple(
      fc.record({
        creators: fc
          .array(
            fc.record(
              {
                name: fc.string(),
                orcid: orcid(),
              },
              { requiredKeys: ['name'] },
            ),
            { minLength: 1 },
          )
          .filter(isNonEmpty),
        description: fc.string(),
        title: fc.string(),
      }),
      fc.record(
        {
          communities: fc
            .array(
              fc.record({
                identifier: fc.string(),
              }),
              { minLength: 1 },
            )
            .filter(isNonEmpty),
          contributors: fc
            .array(
              fc.record(
                {
                  name: fc.string(),
                  orcid: orcid(),
                  type: fc.string(),
                },
                { requiredKeys: ['name', 'type'] },
              ),
              { minLength: 1 },
            )
            .filter(isNonEmpty),
          imprint_publisher: fc.string(),
          keywords: fc.array(fc.string(), { minLength: 1 }).filter(isNonEmpty),
          language: fc.string(),
          license: fc.string(),
          notes: fc.string(),
          publication_date: fc
            .date({ min: new Date('0000-01-01T00:00:00.000Z'), max: new Date('9999-12-31T23:59:59.999Z') })
            .map(date => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))),
          related_identifiers: fc
            .array(
              fc.record(
                {
                  scheme: fc.string(),
                  identifier: fc.string(),
                  relation: fc.string(),
                  resource_type: fc.string(),
                },
                { requiredKeys: ['scheme', 'identifier', 'relation'] },
              ),
              { minLength: 1 },
            )
            .filter(isNonEmpty),
          subjects: fc
            .array(
              fc.record({
                scheme: fc.string(),
                identifier: fc.string(),
                term: fc.string(),
              }),
              { minLength: 1 },
            )
            .filter(isNonEmpty),
        },
        { withDeletedKeys: true },
      ),
      fc.oneof(
        fc.record({
          upload_type: fc.constantFrom(
            'dataset' as const,
            'figure' as const,
            'lesson' as const,
            'other' as const,
            'physicalobject' as const,
            'poster' as const,
            'presentation' as const,
            'software' as const,
            'video' as const,
          ),
        }),
        fc.record({
          upload_type: fc.constant('image' as const),
          image_type: fc.constantFrom(
            'diagram' as const,
            'drawing' as const,
            'figure' as const,
            'other' as const,
            'photo' as const,
            'plot' as const,
          ),
        }),
        fc.record({
          upload_type: fc.constant('publication' as const),
          publication_type: fc.constantFrom(
            'annotationcollection' as const,
            'article' as const,
            'book' as const,
            'conferencepaper' as const,
            'datamanagementplan' as const,
            'deliverable' as const,
            'milestone' as const,
            'other' as const,
            'patent' as const,
            'peerreview' as const,
            'preprint' as const,
            'proposal' as const,
            'report' as const,
            'section' as const,
            'softwaredocumentation' as const,
            'taxonomictreatment' as const,
            'technicalnote' as const,
            'thesis' as const,
            'workingpaper' as const,
          ),
        }),
      ),
    )
    .map(metadatas => merge.withOptions({ mergeArrays: false }, ...metadatas))

export const zenodoDeposition = (): fc.Arbitrary<_.Deposition> =>
  fc.oneof(
    zenodoEmptyDeposition(),
    zenodoInProgressDeposition(),
    zenodoSubmittedDeposition(),
    zenodoUnsubmittedDeposition(),
  )

export const zenodoEmptyDeposition = (): fc.Arbitrary<_.EmptyDeposition> =>
  fc.record({
    id: fc.integer(),
    links: fc.record({
      bucket: url(),
      self: url(),
    }),
    metadata: fc.record({
      prereserve_doi: fc.record({
        doi: doi(),
      }),
    }),
    state: fc.constant('unsubmitted'),
    submitted: fc.constant(false),
  })

export const zenodoInProgressDeposition = (): fc.Arbitrary<_.InProgressDeposition> =>
  fc.record({
    id: fc.integer(),
    links: fc.record({
      publish: url(),
      self: url(),
    }),
    metadata: fc
      .tuple(
        zenodoDepositMetadata(),
        fc.record({
          doi: doi(),
          prereserve_doi: fc.record({
            doi: doi(),
          }),
        }),
      )
      .map(metadatas => merge.withOptions({ mergeArrays: false }, ...metadatas)),
    state: fc.constant('inprogress'),
    submitted: fc.constant(true),
  })

export const zenodoSubmittedDeposition = (): fc.Arbitrary<_.SubmittedDeposition> =>
  fc.record({
    id: fc.integer(),
    links: fc.record({
      edit: url(),
    }),
    metadata: fc
      .tuple(
        zenodoDepositMetadata(),
        fc.record({
          doi: doi(),
        }),
      )
      .map(metadatas => merge.withOptions({ mergeArrays: false }, ...metadatas)),
    state: fc.constant('done'),
    submitted: fc.constant(true),
  })

export const zenodoUnsubmittedDeposition = (): fc.Arbitrary<_.UnsubmittedDeposition> =>
  fc.record({
    id: fc.integer(),
    links: fc.record({
      bucket: url(),
      publish: url(),
      self: url(),
    }),
    metadata: fc
      .tuple(
        zenodoDepositMetadata(),
        fc.record({
          prereserve_doi: fc.record({
            doi: doi(),
          }),
        }),
      )
      .map(metadatas => merge.withOptions({ mergeArrays: false }, ...metadatas)),
    state: fc.constant('unsubmitted'),
    submitted: fc.constant(false),
  })
