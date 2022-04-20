import { expectTypeOf } from 'expect-type'
import * as _ from '../src'

declare const record: _.Record

//
// Record
//

expectTypeOf(record.id).toEqualTypeOf<number>()
