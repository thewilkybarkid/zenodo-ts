import { Doi } from 'doi-ts'
import { expectTypeOf } from 'expect-type'
import { FetchEnv } from 'fetch-fp-ts'
import { NonEmptyArray } from 'fp-ts/NonEmptyArray'
import * as RTE from 'fp-ts/ReaderTaskEither'
import * as C from 'io-ts/Codec'
import * as _ from '../src'

import Codec = C.Codec
import Record = _.Record
import Records = _.Records
import ReaderTaskEither = RTE.ReaderTaskEither
import ZenodoEnv = _.ZenodoEnv

declare const number: number
declare const query: URLSearchParams
declare const record: Record
declare const records: Records
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
// ZenodoEnv
//

expectTypeOf(zenodoEnv).toMatchTypeOf<FetchEnv>()
expectTypeOf(zenodoEnv.zenodoUrl).toEqualTypeOf<URL | undefined>()

//
// getRecord
//

expectTypeOf(_.getRecord(number)).toEqualTypeOf<ReaderTaskEither<ZenodoEnv, unknown, Record>>()

//
// getRecords
//

expectTypeOf(_.getRecords(query)).toEqualTypeOf<ReaderTaskEither<ZenodoEnv, unknown, Records>>()

//
// RecordC
//

expectTypeOf(_.RecordC).toEqualTypeOf<Codec<string, string, Record>>()

//
// RecordsC
//

expectTypeOf(_.RecordsC).toEqualTypeOf<Codec<string, string, Records>>()
