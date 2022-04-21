/**
 * @since 0.1.0
 */
import { Doi, isDoi } from 'doi-ts'
import * as F from 'fetch-fp-ts'
import { isNonEmpty } from 'fp-ts/Array'
import * as E from 'fp-ts/Either'
import * as J from 'fp-ts/Json'
import * as NEA from 'fp-ts/NonEmptyArray'
import * as RTE from 'fp-ts/ReaderTaskEither'
import { identity, pipe } from 'fp-ts/function'
import { StatusCodes } from 'http-status-codes'
import * as C from 'io-ts/Codec'
import * as D from 'io-ts/Decoder'
import safeStableStringify from 'safe-stable-stringify'

import Codec = C.Codec
import FetchEnv = F.FetchEnv
import NonEmptyArray = NEA.NonEmptyArray
import ReaderTaskEither = RTE.ReaderTaskEither

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 0.1.0
 */
export type Record = {
  id: number
  metadata: {
    creators: NonEmptyArray<{
      name: string
    }>
    description: string
    doi: Doi
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
          subtype: 'diagram' | 'drawing' | 'figure' | 'other' | 'photo' | 'plot'
        }
      | {
          type: 'publication'
          subtype:
            | 'annotationcollection'
            | 'article'
            | 'book'
            | 'conferencepaper'
            | 'datamanagementplan'
            | 'deliverable'
            | 'milestone'
            | 'other'
            | 'patent'
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
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 0.1.0
 */
export const getRecord: (id: number) => ReaderTaskEither<FetchEnv, unknown, Record> = id =>
  pipe(
    new URL(id.toString(), 'https://zenodo.org/api/records/'),
    F.Request('GET'),
    F.send,
    RTE.filterOrElseW(F.hasStatus(StatusCodes.OK), identity),
    RTE.chainTaskEitherKW(F.decode(RecordC)),
  )

// -------------------------------------------------------------------------------------
// codecs
// -------------------------------------------------------------------------------------

const DoiC = C.fromDecoder(D.fromRefinement(isDoi, 'DOI'))

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
  C.make(pipe(D.array(codec), D.refine(isNonEmpty, 'NonEmptyArray')), C.array(codec))

const ResourceTypeC = C.sum('type')({
  dataset: C.struct({
    type: C.literal('dataset'),
  }),
  figure: C.struct({
    type: C.literal('figure'),
  }),
  image: C.struct({
    subtype: C.literal('figure', 'plot', 'drawing', 'diagram', 'photo', 'other'),
    type: C.literal('image'),
  }),
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
  publication: C.struct({
    subtype: C.literal(
      'annotationcollection',
      'book',
      'section',
      'conferencepaper',
      'datamanagementplan',
      'article',
      'patent',
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
    type: C.literal('publication'),
  }),
  software: C.struct({
    type: C.literal('software'),
  }),
  video: C.struct({
    type: C.literal('video'),
  }),
})

/**
 * @category codecs
 * @since 0.1.0
 */
export const RecordC: Codec<string, string, Record> = pipe(
  JsonC,
  C.compose(
    C.struct({
      id: C.number,
      metadata: C.struct({
        creators: NonEmptyArrayC(
          C.struct({
            name: C.string,
          }),
        ),
        description: C.string,
        doi: DoiC,
        resource_type: ResourceTypeC,
        title: C.string,
      }),
    }),
  ),
)
