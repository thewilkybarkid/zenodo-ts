import { Doi } from 'doi-ts'
import { expectTypeOf } from 'expect-type'
import { FetchEnv } from 'fetch-fp-ts'
import * as RTE from 'fp-ts/ReaderTaskEither'
import * as C from 'io-ts/Codec'
import * as _ from '../src'

import Codec = C.Codec
import Record = _.Record
import ReaderTaskEither = RTE.ReaderTaskEither

declare const number: number
declare const record: Record

//
// Record
//

expectTypeOf(record.id).toEqualTypeOf<number>()
expectTypeOf(record.metadata.description).toEqualTypeOf<string>()
expectTypeOf(record.metadata.doi).toEqualTypeOf<Doi>()
expectTypeOf(record.metadata.title).toEqualTypeOf<string>()

//
// getRecord
//

expectTypeOf(_.getRecord(number)).toMatchTypeOf<ReaderTaskEither<FetchEnv, unknown, Record>>()

//
// RecordC
//

expectTypeOf(_.RecordC).toMatchTypeOf<Codec<string, string, Record>>()
