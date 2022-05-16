import { Doi } from 'doi-ts'
import { expectTypeOf } from 'expect-type'
import { FetchEnv } from 'fetch-fp-ts'
import { NonEmptyArray } from 'fp-ts/NonEmptyArray'
import * as RTE from 'fp-ts/ReaderTaskEither'
import { pipe } from 'fp-ts/function'
import * as C from 'io-ts/Codec'
import * as _ from '../src'

import Codec = C.Codec
import DepositMetadata = _.DepositMetadata
import Record = _.Record
import Records = _.Records
import ReaderTaskEither = RTE.ReaderTaskEither
import SubmittedDeposition = _.SubmittedDeposition
import UnsubmittedDeposition = _.UnsubmittedDeposition
import ZenodoAuthenticatedEnv = _.ZenodoAuthenticatedEnv
import ZenodoEnv = _.ZenodoEnv

declare const number: number
declare const string: string
declare const query: URLSearchParams
declare const record: Record
declare const records: Records
declare const depositMetadata: DepositMetadata
declare const submittedDeposition: SubmittedDeposition
declare const unsubmittedDeposition: UnsubmittedDeposition
declare const zenodoAuthenticatedEnv: ZenodoAuthenticatedEnv
declare const zenodoEnv: ZenodoEnv

//
// Record
//

expectTypeOf(record.id).toEqualTypeOf<number>()
expectTypeOf(record.metadata.description).toEqualTypeOf<string>()
expectTypeOf(record.metadata.doi).toEqualTypeOf<Doi>()
expectTypeOf(record.metadata.related_identifiers).toEqualTypeOf<
  NonEmptyArray<{ scheme: string; identifier: string; relation: string; resource_type?: string }> | undefined
>()
expectTypeOf(record.metadata.title).toEqualTypeOf<string>()

//
// Records
//

expectTypeOf(records.hits.hits).toEqualTypeOf<Array<Record>>()

//
// DepositMetadata
//

expectTypeOf(depositMetadata.creators).toEqualTypeOf<
  NonEmptyArray<{
    name: string
  }>
>()
expectTypeOf(depositMetadata.description).toEqualTypeOf<string>()
expectTypeOf(depositMetadata.title).toEqualTypeOf<string>()

//
// SubmittedDeposition
//

expectTypeOf(submittedDeposition.id).toEqualTypeOf<number>()
expectTypeOf(submittedDeposition.metadata).toMatchTypeOf<DepositMetadata>()
expectTypeOf(submittedDeposition.metadata.doi).toEqualTypeOf<Doi>()
expectTypeOf(submittedDeposition.state).toEqualTypeOf<'done'>()
expectTypeOf(submittedDeposition.submitted).toEqualTypeOf<true>()

//
// UnsubmittedDeposition
//

expectTypeOf(unsubmittedDeposition.id).toEqualTypeOf<number>()
expectTypeOf(unsubmittedDeposition.metadata).toMatchTypeOf<DepositMetadata>()
expectTypeOf(unsubmittedDeposition.metadata.prereserve_doi.doi).toEqualTypeOf<Doi>()
expectTypeOf(unsubmittedDeposition.state).toEqualTypeOf<'unsubmitted'>()
expectTypeOf(unsubmittedDeposition.submitted).toEqualTypeOf<false>()

//
// ZenodoEnv
//

expectTypeOf(zenodoEnv).toMatchTypeOf<FetchEnv>()
expectTypeOf(zenodoEnv.zenodoUrl).toEqualTypeOf<URL | undefined>()

//
// ZenodoAuthenticatedEnv
//

expectTypeOf(zenodoAuthenticatedEnv).toMatchTypeOf<ZenodoEnv>()
expectTypeOf(zenodoAuthenticatedEnv.zenodoApiKey).toEqualTypeOf<string>()

//
// getRecord
//

expectTypeOf(_.getRecord(number)).toEqualTypeOf<ReaderTaskEither<ZenodoEnv, unknown, Record>>()

//
// getRecords
//

expectTypeOf(_.getRecords(query)).toEqualTypeOf<ReaderTaskEither<ZenodoEnv, unknown, Records>>()

//
// createDeposition
//

expectTypeOf(_.createDeposition(depositMetadata)).toMatchTypeOf<
  ReaderTaskEither<ZenodoAuthenticatedEnv, unknown, UnsubmittedDeposition>
>()

//
// uploadFile
//

expectTypeOf(pipe(unsubmittedDeposition, _.uploadFile({ name: string, type: string, content: string }))).toMatchTypeOf<
  ReaderTaskEither<ZenodoAuthenticatedEnv, unknown, void>
>()

//
// publishDeposition
//

expectTypeOf(pipe(unsubmittedDeposition, _.publishDeposition)).toMatchTypeOf<
  ReaderTaskEither<ZenodoAuthenticatedEnv, unknown, SubmittedDeposition>
>()

//
// RecordC
//

expectTypeOf(_.RecordC).toEqualTypeOf<Codec<string, string, Record>>()

//
// RecordsC
//

expectTypeOf(_.RecordsC).toEqualTypeOf<Codec<string, string, Records>>()
