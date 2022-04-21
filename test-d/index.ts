import { Doi } from 'doi-ts'
import { expectTypeOf } from 'expect-type'
import * as C from 'io-ts/Codec'
import * as _ from '../src'

import Codec = C.Codec
import Record = _.Record

declare const record: Record

//
// Record
//

expectTypeOf(record.id).toEqualTypeOf<number>()
expectTypeOf(record.metadata.description).toEqualTypeOf<string>()
expectTypeOf(record.metadata.doi).toEqualTypeOf<Doi>()
expectTypeOf(record.metadata.title).toEqualTypeOf<string>()

//
// RecordC
//

expectTypeOf(_.RecordC).toMatchTypeOf<Codec<string, string, Record>>()
