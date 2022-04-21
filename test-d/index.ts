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

//
// RecordC
//

expectTypeOf(_.RecordC).toMatchTypeOf<Codec<string, string, Record>>()
