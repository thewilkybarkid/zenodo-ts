import { Doi } from 'doi-ts'
import { expectTypeOf } from 'expect-type'
import { FetchEnv } from 'fetch-fp-ts'
import { NonEmptyArray } from 'fp-ts/NonEmptyArray'
import * as RTE from 'fp-ts/ReaderTaskEither'
import * as C from 'io-ts/Codec'
import * as _ from '../src'

import Codec = C.Codec
import DepositMetadata = _.DepositMetadata
import Record = _.Record
import Records = _.Records
import ReaderTaskEither = RTE.ReaderTaskEither
import UnsubmittedDeposition = _.UnsubmittedDeposition
import ZenodoAuthenticatedEnv = _.ZenodoAuthenticatedEnv
import ZenodoEnv = _.ZenodoEnv

declare const number: number
declare const query: URLSearchParams
declare const record: Record
declare const records: Records
declare const depositMetadata: DepositMetadata
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
// RecordC
//

expectTypeOf(_.RecordC).toEqualTypeOf<Codec<string, string, Record>>()

//
// RecordsC
//

expectTypeOf(_.RecordsC).toEqualTypeOf<Codec<string, string, Records>>()
