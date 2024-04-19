/**
 * @since 0.1.0
 */
import { Doi, isDoi } from 'doi-ts'
import * as F from 'fetch-fp-ts'
import * as A from 'fp-ts/Array'
import * as E from 'fp-ts/Either'
import * as J from 'fp-ts/Json'
import * as NEA from 'fp-ts/NonEmptyArray'
import * as O from 'fp-ts/Option'
import * as R from 'fp-ts/Reader'
import * as RTE from 'fp-ts/ReaderTaskEither'
import { Refinement } from 'fp-ts/Refinement'
import { constVoid, flow, identity, pipe } from 'fp-ts/function'
import { StatusCodes } from 'http-status-codes'
import * as C from 'io-ts/Codec'
import * as D from 'io-ts/Decoder'
import { Orcid, isOrcid } from 'orcid-id-ts'
import safeStableStringify from 'safe-stable-stringify'
import { URL } from 'url'

import Codec = C.Codec
import DecodeError = D.DecodeError
import FetchEnv = F.FetchEnv
import NonEmptyArray = NEA.NonEmptyArray
import ReaderTaskEither = RTE.ReaderTaskEither
import Response = F.Response

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 0.1.0
 */
export type Record = {
  conceptdoi?: Doi
  conceptrecid: number
  id: number
  links: {
    latest: URL
    latest_html: URL
  }
  metadata: {
    communities?: NonEmptyArray<{
      id: string
    }>
    contributors?: NonEmptyArray<{
      name: string
      orcid?: Orcid
      type: string
    }>
    creators: NonEmptyArray<{
      name: string
      orcid?: Orcid
    }>
    description?: string
    doi: Doi
    language?: string
    keywords?: NonEmptyArray<string>
    notes?: string
    publication_date: Date
    related_identifiers?: NonEmptyArray<{
      scheme: string
      identifier: string
      relation: string
      resource_type?: string
    }>
    resource_type:
      | {
          type:
            | 'dataset'
            | 'figure'
            | 'lesson'
            | 'other'
            | 'physicalobject'
            | 'poster'
            | 'presentation'
            | 'software'
            | 'video'
        }
      | {
          type: 'image'
          subtype?: 'diagram' | 'drawing' | 'figure' | 'other' | 'photo' | 'plot'
        }
      | {
          type: 'publication'
          subtype?:
            | 'annotationcollection'
            | 'article'
            | 'book'
            | 'conferencepaper'
            | 'datamanagementplan'
            | 'datapaper'
            | 'deliverable'
            | 'milestone'
            | 'other'
            | 'patent'
            | 'peerreview'
            | 'preprint'
            | 'proposal'
            | 'report'
            | 'section'
            | 'softwaredocumentation'
            | 'taxonomictreatment'
            | 'technicalnote'
            | 'thesis'
            | 'workingpaper'
        }
    title: string
  }
} & (
  | {
      files: NonEmptyArray<{
        key: string
        links: {
          self: URL
        }
        size: number
      }>
      metadata: { access_right: 'open'; license: { id: string } }
    }
  | { metadata: { access_right: 'embargoed'; embargo_date: Date; license: { id: string } } }
  | { metadata: { access_right: 'restricted'; license?: { id: string } } }
)

/**
 * @category model
 * @since 0.1.2
 */
export type DepositMetadata = {
  communities?: NonEmptyArray<{
    identifier: string
  }>
  contributors?: NonEmptyArray<{
    name: string
    orcid?: Orcid
    type: string
  }>
  creators: NonEmptyArray<{
    name: string
    orcid?: Orcid
  }>
  description: string
  imprint_publisher?: string
  keywords?: NonEmptyArray<string>
  license?: string
  publication_date?: Date
  related_identifiers?: NonEmptyArray<{
    scheme: string
    identifier: string
    relation: string
    resource_type?: string
  }>
  title: string
} & (
  | {
      upload_type:
        | 'dataset'
        | 'figure'
        | 'lesson'
        | 'other'
        | 'physicalobject'
        | 'poster'
        | 'presentation'
        | 'software'
        | 'video'
    }
  | {
      upload_type: 'image'
      image_type: 'diagram' | 'drawing' | 'figure' | 'other' | 'photo' | 'plot'
    }
  | {
      upload_type: 'publication'
      publication_type:
        | 'annotationcollection'
        | 'article'
        | 'book'
        | 'conferencepaper'
        | 'datamanagementplan'
        | 'deliverable'
        | 'milestone'
        | 'other'
        | 'patent'
        | 'peerreview'
        | 'preprint'
        | 'proposal'
        | 'report'
        | 'section'
        | 'softwaredocumentation'
        | 'taxonomictreatment'
        | 'technicalnote'
        | 'thesis'
        | 'workingpaper'
    }
)

/**
 * @category model
 * @since 0.1.17
 */
export type Deposition = EmptyDeposition | InProgressDeposition | SubmittedDeposition | UnsubmittedDeposition

/**
 * @category model
 * @since 0.1.10
 */
export type EmptyDeposition = {
  id: number
  links: {
    bucket: URL
    self: URL
  }
  metadata: {
    prereserve_doi: {
      doi: Doi
    }
  }
  state: 'unsubmitted'
  submitted: false
}

/**
 * @category model
 * @since 0.1.17
 */
export type InProgressDeposition = {
  id: number
  links: {
    publish: URL
    self: URL
  }
  metadata: DepositMetadata & {
    doi: Doi
    prereserve_doi: {
      doi: Doi
    }
  }
  state: 'inprogress'
  submitted: true
}

/**
 * @category model
 * @since 0.1.3
 */
export type SubmittedDeposition = {
  id: number
  links: {
    edit: URL
  }
  metadata: DepositMetadata & {
    doi: Doi
  }
  state: 'done'
  submitted: true
}

/**
 * @category model
 * @since 0.1.2
 */
export type UnsubmittedDeposition = {
  id: number
  links: {
    bucket: URL
    publish: URL
    self: URL
  }
  metadata: DepositMetadata & {
    prereserve_doi: {
      doi: Doi
    }
  }
  state: 'unsubmitted'
  submitted: false
}

/**
 * @category model
 * @since 0.1.1
 */
export interface ZenodoEnv extends FetchEnv {
  zenodoApiKey?: string
  zenodoUrl?: URL
}

/**
 * @category model
 * @since 0.1.2
 */
export interface ZenodoAuthenticatedEnv extends ZenodoEnv {
  zenodoApiKey: string
}

/**
 * @category model
 * @since 0.1.1
 */
export type Records = {
  hits: {
    hits: Array<Record>
    total: number
  }
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 0.1.0
 */
export const getRecord: (id: number) => ReaderTaskEither<ZenodoEnv, Error | DecodeError | Response, Record> = id =>
  pipe(
    RTE.rightReader(zenodoUrl(`records/${id.toString()}`)),
    RTE.chainReaderKW(flow(F.Request('GET'), F.setHeader('Accept', 'application/json'), addAuthorizationHeader)),
    RTE.chainW(F.send),
    RTE.filterOrElseW(F.hasStatus(StatusCodes.OK), identity),
    RTE.chainTaskEitherKW(F.decode(RecordC)),
  )

/**
 * @category constructors
 * @since 0.1.1
 */
export const getRecords: (
  query: URLSearchParams,
) => ReaderTaskEither<ZenodoEnv, Error | DecodeError | Response, Records> = query =>
  pipe(
    RTE.rightReader(zenodoUrl(`records?${query.toString()}`)),
    RTE.chainReaderKW(flow(F.Request('GET'), F.setHeader('Accept', 'application/json'), addAuthorizationHeader)),
    RTE.chainW(F.send),
    RTE.filterOrElseW(F.hasStatus(StatusCodes.OK), identity),
    RTE.chainTaskEitherKW(F.decode(RecordsC)),
  )

/**
 * @category constructors
 * @since 0.1.16
 */
export const getCommunityRecords: (
  community: string,
) => (query: URLSearchParams) => ReaderTaskEither<ZenodoEnv, Error | DecodeError | Response, Records> =
  community => query =>
    pipe(
      RTE.rightReader(zenodoUrl(`communities/${community}/records?${query.toString()}`)),
      RTE.chainReaderKW(flow(F.Request('GET'), F.setHeader('Accept', 'application/json'), addAuthorizationHeader)),
      RTE.chainW(F.send),
      RTE.filterOrElseW(F.hasStatus(StatusCodes.OK), identity),
      RTE.chainTaskEitherKW(F.decode(RecordsC)),
    )

/**
 * @category constructors
 * @since 0.1.17
 */
export const getDeposition: (
  id: number,
) => ReaderTaskEither<ZenodoAuthenticatedEnv, Error | DecodeError | Response, Deposition> = id =>
  pipe(
    RTE.rightReader(zenodoUrl(`deposit/depositions/${id.toString()}`)),
    RTE.chainReaderKW(flow(F.Request('GET'), F.setHeader('Accept', 'application/json'), addAuthorizationHeader)),
    RTE.chainW(F.send),
    RTE.filterOrElseW(F.hasStatus(StatusCodes.OK), identity),
    RTE.chainTaskEitherKW(F.decode(DepositionC)),
  )

/**
 * @category constructors
 * @since 0.1.10
 */
export const createEmptyDeposition = (): ReaderTaskEither<
  ZenodoAuthenticatedEnv,
  Error | DecodeError | Response,
  EmptyDeposition
> =>
  pipe(
    RTE.rightReader(zenodoUrl('deposit/depositions')),
    RTE.chainReaderK(
      flow(
        F.Request('POST'),
        F.setHeader('Accept', 'application/json'),
        F.setBody(JSON.stringify({}), 'application/json'),
        addAuthorizationHeader,
      ),
    ),
    RTE.chainW(F.send),
    RTE.filterOrElseW(F.hasStatus(StatusCodes.CREATED), identity),
    RTE.chainTaskEitherKW(F.decode(EmptyDepositionC)),
  )

/**
 * @category constructors
 * @since 0.1.2
 */
export const createDeposition: (
  metadata: DepositMetadata,
) => ReaderTaskEither<ZenodoAuthenticatedEnv, Error | DecodeError | Response, UnsubmittedDeposition> = metadata =>
  pipe(
    RTE.rightReader(zenodoUrl('deposit/depositions')),
    RTE.chainReaderK(
      flow(
        F.Request('POST'),
        F.setHeader('Accept', 'application/json'),
        F.setBody(JSON.stringify({ metadata: DepositMetadataC.encode(metadata) }), 'application/json'),
        addAuthorizationHeader,
      ),
    ),
    RTE.chainW(F.send),
    RTE.filterOrElseW(F.hasStatus(StatusCodes.CREATED), identity),
    RTE.chainTaskEitherKW(F.decode(UnsubmittedDepositionC)),
  )

/**
 * @category constructors
 * @since 0.1.17
 */
export const unlockDeposition: (
  deposition: SubmittedDeposition,
) => ReaderTaskEither<ZenodoAuthenticatedEnv, Error | DecodeError | Response, InProgressDeposition> = deposition =>
  pipe(
    F.Request('POST')(deposition.links.edit),
    F.setHeader('Accept', 'application/json'),
    RTE.fromReaderK(addAuthorizationHeader),
    RTE.chainW(F.send),
    RTE.filterOrElseW(F.hasStatus(StatusCodes.CREATED), identity),
    RTE.chainTaskEitherKW(F.decode(InProgressDepositionC)),
  )

/**
 * @category constructors
 * @since 0.1.10
 */
export const updateDeposition: {
  (metadata: DepositMetadata, deposition: InProgressDeposition): ReaderTaskEither<
    ZenodoAuthenticatedEnv,
    Error | DecodeError | Response,
    InProgressDeposition
  >
  <T extends EmptyDeposition | UnsubmittedDeposition>(metadata: DepositMetadata, deposition: T): ReaderTaskEither<
    ZenodoAuthenticatedEnv,
    Error | DecodeError | Response,
    UnsubmittedDeposition
  >
} = (metadata: DepositMetadata, deposition: EmptyDeposition | InProgressDeposition | UnsubmittedDeposition) =>
  pipe(
    F.Request('PUT')(deposition.links.self),
    F.setHeader('Accept', 'application/json'),
    F.setBody(JSON.stringify({ metadata: DepositMetadataC.encode(metadata) }), 'application/json'),
    RTE.fromReaderK(addAuthorizationHeader),
    RTE.chainW(F.send),
    RTE.filterOrElseW(F.hasStatus(StatusCodes.OK), identity),
    RTE.chainTaskEitherKW(F.decode(DepositionC)),
  ) as never

/**
 * @category constructors
 * @since 0.1.3
 */
export const uploadFile: (upload: {
  readonly name: string
  readonly content: string
}) => <T extends EmptyDeposition | UnsubmittedDeposition>(
  deposition: T,
) => ReaderTaskEither<ZenodoAuthenticatedEnv, Error | Response, void> = upload =>
  flow(
    deposition => `${deposition.links.bucket.toString()}/${upload.name}`,
    F.Request('PUT'),
    F.setBody(upload.content, 'application/octet-stream'),
    RTE.fromReaderK(addAuthorizationHeader),
    RTE.chainW(F.send),
    RTE.filterOrElseW(F.hasStatus(StatusCodes.CREATED, StatusCodes.OK), identity),
    RTE.map(constVoid),
  )

/**
 * @category constructors
 * @since 0.1.3
 */
export const publishDeposition: (
  deposition: InProgressDeposition | UnsubmittedDeposition,
) => ReaderTaskEither<ZenodoAuthenticatedEnv, Error | DecodeError | Response, SubmittedDeposition> = deposition =>
  pipe(
    F.Request('POST')(deposition.links.publish),
    F.setHeader('Accept', 'application/json'),
    RTE.fromReaderK(addAuthorizationHeader),
    RTE.chainW(F.send),
    RTE.filterOrElseW(F.hasStatus(StatusCodes.ACCEPTED), identity),
    RTE.chainTaskEitherKW(F.decode(SubmittedDepositionC)),
  )

// -------------------------------------------------------------------------------------
// refinements
// -------------------------------------------------------------------------------------

/**
 * @category refinements
 * @since 0.1.17
 */
export const depositionIsInProgress: Refinement<Deposition, InProgressDeposition> = (
  deposition: Deposition,
): deposition is InProgressDeposition => deposition.submitted && deposition.state === 'inprogress'

/**
 * @category refinements
 * @since 0.1.17
 */
export const depositionIsSubmitted: Refinement<Deposition, SubmittedDeposition> = (
  deposition: Deposition,
): deposition is SubmittedDeposition => deposition.submitted && deposition.state === 'done'

/**
 * @category refinements
 * @since 0.1.17
 */
export const depositionIsEmpty: Refinement<Deposition, EmptyDeposition> = (
  deposition: Deposition,
): deposition is EmptyDeposition => !deposition.submitted && !('title' in deposition.metadata)

/**
 * @category refinements
 * @since 0.1.17
 */
export const depositionIsUnsubmitted: Refinement<Deposition, UnsubmittedDeposition> = (
  deposition: Deposition,
): deposition is UnsubmittedDeposition => !deposition.submitted && 'title' in deposition.metadata

// -------------------------------------------------------------------------------------
// codecs
// -------------------------------------------------------------------------------------

const DoiC = C.fromDecoder(D.fromRefinement(isDoi, 'DOI'))

const OrcidC = C.fromDecoder(D.fromRefinement(isOrcid, 'ORCID'))

const UrlC = C.make(
  pipe(
    D.string,
    D.parse(s =>
      E.tryCatch(
        () => new URL(s),
        () => D.error(s, 'URL'),
      ),
    ),
  ),
  { encode: String },
)

const JsonC = C.make(
  {
    decode: (s: string) =>
      pipe(
        J.parse(s),
        E.mapLeft(() => D.error(s, 'JSON')),
      ),
  },
  { encode: safeStableStringify },
)

const NonEmptyArrayC = <O, A>(codec: Codec<unknown, O, A>) =>
  C.make(pipe(D.array(codec), D.refine(A.isNonEmpty, 'NonEmptyArray')), C.array(codec))

const NumberFromStringC = C.make(
  pipe(
    D.string,
    D.parse(s => {
      const n = +s
      return isNaN(n) || s.trim() === '' ? D.failure(s, 'Not a number') : D.success(n)
    }),
  ),
  { encode: String },
)

const PlainDateC = C.make(
  pipe(
    D.string,
    D.parse(
      E.fromPredicate(
        s => /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(s),
        s => D.error(s, 'Plain Date'),
      ),
    ),
    D.parse(s =>
      pipe(
        O.tryCatch(() => new Date(s)),
        O.filter(d => !isNaN(d.getTime())),
        E.fromOption(() => D.error(s, 'Plain Date')),
      ),
    ),
  ),
  { encode: date => date.toISOString().split('T')[0] },
)

const ResourceTypeC = C.sum('type')({
  dataset: C.struct({
    type: C.literal('dataset'),
  }),
  figure: C.struct({
    type: C.literal('figure'),
  }),
  image: pipe(
    C.struct({
      type: C.literal('image'),
    }),
    C.intersect(
      C.partial({
        subtype: C.literal('figure', 'plot', 'drawing', 'diagram', 'photo', 'other'),
      }),
    ),
  ),
  lesson: C.struct({
    type: C.literal('lesson'),
  }),
  other: C.struct({
    type: C.literal('other'),
  }),
  poster: C.struct({
    type: C.literal('poster'),
  }),
  physicalobject: C.struct({
    type: C.literal('physicalobject'),
  }),
  presentation: C.struct({
    type: C.literal('presentation'),
  }),
  publication: pipe(
    C.struct({
      type: C.literal('publication'),
    }),
    C.intersect(
      C.partial({
        subtype: C.literal(
          'annotationcollection',
          'book',
          'section',
          'conferencepaper',
          'datamanagementplan',
          'datapaper',
          'article',
          'patent',
          'peerreview',
          'preprint',
          'deliverable',
          'milestone',
          'proposal',
          'report',
          'softwaredocumentation',
          'taxonomictreatment',
          'technicalnote',
          'thesis',
          'workingpaper',
          'other',
        ),
      }),
    ),
  ),
  software: C.struct({
    type: C.literal('software'),
  }),
  video: C.struct({
    type: C.literal('video'),
  }),
})

const UploadTypeC = C.sum('upload_type')({
  dataset: C.struct({
    upload_type: C.literal('dataset'),
  }),
  figure: C.struct({
    upload_type: C.literal('figure'),
  }),
  image: C.struct({
    image_type: C.literal('figure', 'plot', 'drawing', 'diagram', 'photo', 'other'),
    upload_type: C.literal('image'),
  }),
  lesson: C.struct({
    upload_type: C.literal('lesson'),
  }),
  other: C.struct({
    upload_type: C.literal('other'),
  }),
  poster: C.struct({
    upload_type: C.literal('poster'),
  }),
  physicalobject: C.struct({
    upload_type: C.literal('physicalobject'),
  }),
  presentation: C.struct({
    upload_type: C.literal('presentation'),
  }),
  publication: C.struct({
    publication_type: C.literal(
      'annotationcollection',
      'book',
      'section',
      'conferencepaper',
      'datamanagementplan',
      'article',
      'patent',
      'peerreview',
      'preprint',
      'deliverable',
      'milestone',
      'proposal',
      'report',
      'softwaredocumentation',
      'taxonomictreatment',
      'technicalnote',
      'thesis',
      'workingpaper',
      'other',
    ),
    upload_type: C.literal('publication'),
  }),
  software: C.struct({
    upload_type: C.literal('software'),
  }),
  video: C.struct({
    upload_type: C.literal('video'),
  }),
})

const FileC = C.struct({
  key: C.string,
  links: C.struct({
    self: UrlC,
  }),
  size: C.number,
})

const BaseRecordMetadataC = pipe(
  C.struct({
    creators: NonEmptyArrayC(
      pipe(
        C.struct({
          name: C.string,
        }),
        C.intersect(
          C.partial({
            orcid: OrcidC,
          }),
        ),
      ),
    ),
    doi: DoiC,

    publication_date: PlainDateC,
    resource_type: ResourceTypeC,
    title: C.string,
  }),
  C.intersect(
    C.partial({
      communities: pipe(
        C.array(C.struct({ id: C.string })),
        C.imap(
          A.match(() => undefined, identity),
          communities => (communities ?? []) as never,
        ),
      ),
      contributors: pipe(
        C.array(
          pipe(
            C.struct({
              name: C.string,
              type: C.string,
            }),
            C.intersect(
              C.partial({
                orcid: OrcidC,
              }),
            ),
          ),
        ),
        C.imap(
          A.match(() => undefined, identity),
          contributors => (contributors ?? []) as never,
        ),
      ),
      description: C.string,
      keywords: NonEmptyArrayC(C.string),
      language: C.string,
      notes: C.string,
      related_identifiers: NonEmptyArrayC(
        pipe(
          C.struct({ identifier: C.string, scheme: C.string, relation: C.string }),
          C.intersect(C.partial({ resource_type: C.string })),
        ),
      ),
    }),
  ),
)

const BaseRecordC = pipe(
  C.struct({
    conceptrecid: NumberFromStringC,
    id: C.number,
    links: C.struct({
      latest: UrlC,
      latest_html: UrlC,
    }),
  }),
  C.intersect(
    C.partial({
      conceptdoi: DoiC,
    }),
  ),
  C.intersect(
    C.make(
      D.union(
        C.struct({
          metadata: pipe(
            BaseRecordMetadataC,
            C.intersect(
              C.struct({
                access_right: C.literal('open'),
                license: C.struct({
                  id: C.string,
                }),
              }),
            ),
          ),
          files: NonEmptyArrayC(FileC),
        }),
        C.struct({
          metadata: pipe(
            BaseRecordMetadataC,
            C.intersect(
              C.struct({
                access_right: C.literal('embargoed'),
                embargo_date: PlainDateC,
                license: C.struct({
                  id: C.string,
                }),
              }),
            ),
          ),
        }),
        C.struct({
          metadata: pipe(
            BaseRecordMetadataC,
            C.intersect(C.struct({ access_right: C.literal('restricted') })),
            C.intersect(
              C.partial({
                license: C.struct({
                  id: C.string,
                }),
              }),
            ),
          ),
        }),
      ),
      {
        encode: record => {
          switch (record.metadata.access_right) {
            case 'open':
              return C.struct({
                metadata: pipe(
                  BaseRecordMetadataC,
                  C.intersect(
                    C.struct({
                      access_right: C.literal('open'),
                      license: C.struct({
                        id: C.string,
                      }),
                    }),
                  ),
                ),
                files: NonEmptyArrayC(FileC),
              }).encode(record as never)
            case 'embargoed':
              return C.struct({
                metadata: pipe(
                  BaseRecordMetadataC,
                  C.intersect(
                    C.struct({
                      access_right: C.literal('embargoed'),
                      embargo_date: PlainDateC,
                      license: C.struct({
                        id: C.string,
                      }),
                    }),
                  ),
                ),
              }).encode(record as never)
            case 'restricted':
              return C.struct({
                metadata: pipe(
                  BaseRecordMetadataC,
                  C.intersect(C.struct({ access_right: C.literal('restricted') })),
                  C.intersect(
                    C.partial({
                      license: C.struct({
                        id: C.string,
                      }),
                    }),
                  ),
                ),
              }).encode(record as never)
          }
        },
      },
    ),
  ),
)

const DepositMetadataC = pipe(
  C.struct({
    creators: NonEmptyArrayC(
      pipe(
        C.struct({
          name: C.string,
        }),
        C.intersect(
          C.partial({
            orcid: OrcidC,
          }),
        ),
      ),
    ),
    description: C.string,
    title: C.string,
  }),
  C.intersect(
    C.partial({
      communities: NonEmptyArrayC(C.struct({ identifier: C.string })),
      contributors: NonEmptyArrayC(
        pipe(
          C.struct({
            name: C.string,
            type: C.string,
          }),
          C.intersect(
            C.partial({
              orcid: OrcidC,
            }),
          ),
        ),
      ),
      keywords: NonEmptyArrayC(C.string),
      imprint_publisher: C.string,
      license: C.string,
      publication_date: PlainDateC,
      related_identifiers: NonEmptyArrayC(
        pipe(
          C.struct({ identifier: C.string, scheme: C.string, relation: C.string }),
          C.intersect(C.partial({ resource_type: C.string })),
        ),
      ),
    }),
  ),
  C.intersect(UploadTypeC),
)

/**
 * @category codecs
 * @since 0.1.0
 */
export const RecordC: Codec<string, string, Record> = pipe(JsonC, C.compose(BaseRecordC))

/**
 * @category codecs
 * @since 0.1.1
 */
export const RecordsC: Codec<string, string, Records> = pipe(
  JsonC,
  C.compose(
    C.struct({
      hits: C.struct({
        hits: C.array(BaseRecordC),
        total: C.number,
      }),
    }),
  ),
)

/**
 * @category codecs
 * @since 0.1.10
 */
export const EmptyDepositionC: Codec<string, string, EmptyDeposition> = pipe(
  JsonC,
  C.compose(
    C.struct({
      id: C.number,
      links: C.struct({
        bucket: UrlC,
        self: UrlC,
      }),
      metadata: C.struct({
        prereserve_doi: C.struct({
          doi: DoiC,
        }),
      }),
      state: C.literal('unsubmitted'),
      submitted: C.literal(false),
    }),
  ),
)

/**
 * @category codecs
 * @since 0.1.17
 */
export const InProgressDepositionC: Codec<string, string, InProgressDeposition> = pipe(
  JsonC,
  C.compose(
    C.struct({
      id: C.number,
      links: C.struct({
        publish: UrlC,
        self: UrlC,
      }),
      metadata: pipe(
        DepositMetadataC,
        C.intersect(
          C.struct({
            doi: DoiC,
            prereserve_doi: C.struct({
              doi: DoiC,
            }),
          }),
        ),
      ),
      state: C.literal('inprogress'),
      submitted: C.literal(true),
    }),
  ),
)

/**
 * @category codecs
 * @since 0.1.3
 */
export const SubmittedDepositionC: Codec<string, string, SubmittedDeposition> = pipe(
  JsonC,
  C.compose(
    C.struct({
      id: C.number,
      links: C.struct({
        edit: UrlC,
      }),
      metadata: pipe(
        DepositMetadataC,
        C.intersect(
          C.struct({
            doi: DoiC,
          }),
        ),
      ),
      state: C.literal('done'),
      submitted: C.literal(true),
    }),
  ),
)

/**
 * @category codecs
 * @since 0.1.2
 */
export const UnsubmittedDepositionC: Codec<string, string, UnsubmittedDeposition> = pipe(
  JsonC,
  C.compose(
    C.struct({
      id: C.number,
      links: C.struct({
        bucket: UrlC,
        publish: UrlC,
        self: UrlC,
      }),
      metadata: pipe(
        DepositMetadataC,
        C.intersect(
          C.struct({
            prereserve_doi: C.struct({
              doi: DoiC,
            }),
          }),
        ),
      ),
      state: C.literal('unsubmitted'),
      submitted: C.literal(false),
    }),
  ),
)

/**
 * @category codecs
 * @since 0.1.17
 */
export const DepositionC: Codec<string, string, Deposition> =
  // Unfortunately, there's no way to describe a union encoder, so we must implement it ourselves.
  // Refs https://github.com/gcanti/io-ts/issues/625#issuecomment-1007478009
  C.make(D.union(SubmittedDepositionC, InProgressDepositionC, UnsubmittedDepositionC, EmptyDepositionC), {
    encode: deposition =>
      depositionIsSubmitted(deposition)
        ? SubmittedDepositionC.encode(deposition)
        : depositionIsInProgress(deposition)
        ? InProgressDepositionC.encode(deposition)
        : depositionIsEmpty(deposition)
        ? EmptyDepositionC.encode(deposition)
        : UnsubmittedDepositionC.encode(deposition),
  })

// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------

/**
 * @since 0.1.19
 */
export function isOpenRecord(record: Record): record is Extract<Record, { metadata: { access_right: 'open' } }> {
  return record.metadata.access_right === 'open'
}

/**
 * @since 0.1.19
 */
export function isEmbargoedRecord(
  record: Record,
): record is Extract<Record, { metadata: { access_right: 'embargoed' } }> {
  return record.metadata.access_right === 'embargoed'
}

/**
 * @since 0.1.19
 */
export function isRestrictedRecord(
  record: Record,
): record is Extract<Record, { metadata: { access_right: 'restricted' } }> {
  return record.metadata.access_right === 'restricted'
}

const zenodoUrl = (path: string) =>
  R.asks(({ zenodoUrl }: ZenodoEnv) => new URL(`/api/${path}`, zenodoUrl ?? 'https://zenodo.org/'))

const addAuthorizationHeader = (request: F.Request) =>
  R.asks(({ zenodoApiKey }: ZenodoEnv) =>
    pipe(request, typeof zenodoApiKey === 'string' ? F.setHeader('Authorization', `Bearer ${zenodoApiKey}`) : identity),
  )
