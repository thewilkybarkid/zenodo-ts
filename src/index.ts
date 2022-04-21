/**
 * @since 0.1.0
 */
import * as E from 'fp-ts/Either'
import * as J from 'fp-ts/Json'
import { pipe } from 'fp-ts/function'
import * as C from 'io-ts/Codec'
import * as D from 'io-ts/Decoder'
import safeStableStringify from 'safe-stable-stringify'

import Codec = C.Codec

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 0.1.0
 */
export type Record = {
  id: number
}

// -------------------------------------------------------------------------------------
// codecs
// -------------------------------------------------------------------------------------

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

/**
 * @category codecs
 * @since 0.1.0
 */
export const RecordC: Codec<string, string, Record> = pipe(
  JsonC,
  C.compose(
    C.struct({
      id: C.number,
    }),
  ),
)
