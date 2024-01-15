import { Doi } from 'doi-ts'
import { expectTypeOf } from 'expect-type'
import { FetchEnv, Response } from 'fetch-fp-ts'
import { NonEmptyArray } from 'fp-ts/NonEmptyArray'
import * as RTE from 'fp-ts/ReaderTaskEither'
import { pipe } from 'fp-ts/function'
import * as C from 'io-ts/Codec'
import { DecodeError } from 'io-ts/Decoder'
import { Orcid } from 'orcid-id-ts'
import * as _ from '../src'

import Codec = C.Codec
import DepositMetadata = _.DepositMetadata
import EmptyDeposition = _.EmptyDeposition
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
declare const emptyDeposition: EmptyDeposition
declare const submittedDeposition: SubmittedDeposition
declare const unsubmittedDeposition: UnsubmittedDeposition
declare const zenodoAuthenticatedEnv: ZenodoAuthenticatedEnv
declare const zenodoEnv: ZenodoEnv

//
// Record
//

expectTypeOf(record.files[0].key).toEqualTypeOf<string>()
expectTypeOf(record.files[0].links.self).toEqualTypeOf<URL>()
expectTypeOf(record.files[0].size).toEqualTypeOf<number>()
expectTypeOf(record.id).toEqualTypeOf<number>()
expectTypeOf(record.links.latest).toEqualTypeOf<URL>()
expectTypeOf(record.links.latest_html).toEqualTypeOf<URL>()
expectTypeOf(record.metadata.creators).toEqualTypeOf<NonEmptyArray<{ name: string; orcid?: Orcid }>>()
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
expectTypeOf(records.hits.total).toEqualTypeOf<number>()

//
// DepositMetadata
//

expectTypeOf(depositMetadata.creators).toEqualTypeOf<NonEmptyArray<{ name: string; orcid?: Orcid }>>()
expectTypeOf(depositMetadata.description).toEqualTypeOf<string>()
expectTypeOf(depositMetadata.publication_date).toEqualTypeOf<Date | undefined>()
expectTypeOf(depositMetadata.related_identifiers).toEqualTypeOf<
  NonEmptyArray<{ scheme: string; identifier: string; relation: string; resource_type?: string }> | undefined
>()
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
expectTypeOf(unsubmittedDeposition.links.bucket).toEqualTypeOf<URL>()
expectTypeOf(unsubmittedDeposition.links.publish).toEqualTypeOf<URL>()
expectTypeOf(unsubmittedDeposition.links.self).toEqualTypeOf<URL>()
expectTypeOf(unsubmittedDeposition.metadata).toMatchTypeOf<DepositMetadata>()
expectTypeOf(unsubmittedDeposition.metadata.prereserve_doi.doi).toEqualTypeOf<Doi>()
expectTypeOf(unsubmittedDeposition.state).toEqualTypeOf<'unsubmitted'>()
expectTypeOf(unsubmittedDeposition.submitted).toEqualTypeOf<false>()

//
// EmptyDeposition
//

expectTypeOf(emptyDeposition.id).toEqualTypeOf<number>()
expectTypeOf(emptyDeposition.links.bucket).toEqualTypeOf<URL>()
expectTypeOf(emptyDeposition.links.self).toEqualTypeOf<URL>()
expectTypeOf(emptyDeposition.metadata.prereserve_doi.doi).toEqualTypeOf<Doi>()
expectTypeOf(emptyDeposition.state).toEqualTypeOf<'unsubmitted'>()
expectTypeOf(emptyDeposition.submitted).toEqualTypeOf<false>()

//
// ZenodoEnv
//

expectTypeOf(zenodoEnv).toMatchTypeOf<FetchEnv>()
expectTypeOf(zenodoEnv.zenodoUrl).toEqualTypeOf<URL | undefined>()
expectTypeOf(zenodoEnv.zenodoApiKey).toEqualTypeOf<string | undefined>()

//
// ZenodoAuthenticatedEnv
//

expectTypeOf(zenodoAuthenticatedEnv).toMatchTypeOf<ZenodoEnv>()
expectTypeOf(zenodoAuthenticatedEnv.zenodoApiKey).toEqualTypeOf<string>()

//
// getRecord
//

expectTypeOf(_.getRecord(number)).toEqualTypeOf<ReaderTaskEither<ZenodoEnv, Error | DecodeError | Response, Record>>()

//
// getRecords
//

expectTypeOf(_.getRecords(query)).toEqualTypeOf<ReaderTaskEither<ZenodoEnv, Error | DecodeError | Response, Records>>()

//
// getCommunityRecords
//

expectTypeOf(_.getCommunityRecords(string)(query)).toEqualTypeOf<
  ReaderTaskEither<ZenodoEnv, Error | DecodeError | Response, Records>
>()

//
// createDeposition
//

expectTypeOf(_.createDeposition(depositMetadata)).toMatchTypeOf<
  ReaderTaskEither<ZenodoAuthenticatedEnv, Error | DecodeError | Response, UnsubmittedDeposition>
>()

//
// updateDeposition
//

expectTypeOf(_.updateDeposition(depositMetadata, emptyDeposition)).toMatchTypeOf<
  ReaderTaskEither<ZenodoAuthenticatedEnv, Error | DecodeError | Response, UnsubmittedDeposition>
>()
expectTypeOf(_.updateDeposition(depositMetadata, unsubmittedDeposition)).toMatchTypeOf<
  ReaderTaskEither<ZenodoAuthenticatedEnv, Error | DecodeError | Response, UnsubmittedDeposition>
>()

//
// uploadFile
//

expectTypeOf(pipe(emptyDeposition, _.uploadFile({ name: string, content: string }))).toMatchTypeOf<
  ReaderTaskEither<ZenodoAuthenticatedEnv, unknown, void>
>()
expectTypeOf(pipe(unsubmittedDeposition, _.uploadFile({ name: string, content: string }))).toMatchTypeOf<
  ReaderTaskEither<ZenodoAuthenticatedEnv, Error | Response, void>
>()

//
// publishDeposition
//

expectTypeOf(pipe(unsubmittedDeposition, _.publishDeposition)).toMatchTypeOf<
  ReaderTaskEither<ZenodoAuthenticatedEnv, Error | DecodeError | Response, SubmittedDeposition>
>()

//
// RecordC
//

expectTypeOf(_.RecordC).toEqualTypeOf<Codec<string, string, Record>>()

//
// RecordsC
//

expectTypeOf(_.RecordsC).toEqualTypeOf<Codec<string, string, Records>>()
