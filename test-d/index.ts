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
import Deposition = _.Deposition
import EmptyDeposition = _.EmptyDeposition
import InProgressDeposition = _.InProgressDeposition
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
declare const deposition: Deposition
declare const emptyDeposition: EmptyDeposition
declare const inProgressDeposition: InProgressDeposition
declare const submittedDeposition: SubmittedDeposition
declare const unsubmittedDeposition: UnsubmittedDeposition
declare const zenodoAuthenticatedEnv: ZenodoAuthenticatedEnv
declare const zenodoEnv: ZenodoEnv

//
// Record
//

expectTypeOf(record.conceptdoi).toEqualTypeOf<Doi | undefined>()
expectTypeOf(record.conceptrecid).toEqualTypeOf<number>()
expectTypeOf(record.metadata.access_right).toEqualTypeOf<'open' | 'embargoed' | 'restricted'>()
if (_.isOpenRecord(record)) {
  expectTypeOf(record.metadata.access_right).toEqualTypeOf<'open'>()
  expectTypeOf(record.metadata.license).toEqualTypeOf<{ id: string }>()
  expectTypeOf(record.files[0].key).toEqualTypeOf<string>()
  expectTypeOf(record.files[0].links.self).toEqualTypeOf<URL>()
  expectTypeOf(record.files[0].size).toEqualTypeOf<number>()
  // @ts-expect-error
  expectTypeOf(record.metadata.embargo_date).toBeUndefined()
} else if (_.isEmbargoedRecord(record)) {
  expectTypeOf(record.metadata.access_right).toEqualTypeOf<'embargoed'>()
  expectTypeOf(record.metadata.embargo_date).toEqualTypeOf<Date>()
  expectTypeOf(record.metadata.license).toEqualTypeOf<{ id: string }>()
  // @ts-expect-error
  expectTypeOf(record.metadata.files).toBeUndefined()
} else if (_.isRestrictedRecord(record)) {
  expectTypeOf(record.metadata.access_right).toEqualTypeOf<'restricted'>()
  expectTypeOf(record.metadata.license).toEqualTypeOf<{ id: string } | undefined>()
  // @ts-expect-error
  expectTypeOf(record.metadata.embargo_date).toBeUndefined()
  // @ts-expect-error
  expectTypeOf(record.metadata.files).toBeUndefined()
}
expectTypeOf(record.id).toEqualTypeOf<number>()
expectTypeOf(record.links.latest).toEqualTypeOf<URL>()
expectTypeOf(record.links.latest_html).toEqualTypeOf<URL>()
expectTypeOf(record.metadata.creators).toEqualTypeOf<NonEmptyArray<{ name: string; orcid?: Orcid }>>()
expectTypeOf(record.metadata.description).toEqualTypeOf<string | undefined>()
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
expectTypeOf(depositMetadata.imprint_publisher).toEqualTypeOf<string | undefined>()
expectTypeOf(depositMetadata.language).toEqualTypeOf<string | undefined>()
expectTypeOf(depositMetadata.license).toEqualTypeOf<string | undefined>()
expectTypeOf(depositMetadata.notes).toEqualTypeOf<string | undefined>()
expectTypeOf(depositMetadata.related_identifiers).toEqualTypeOf<
  NonEmptyArray<{ scheme: string; identifier: string; relation: string; resource_type?: string }> | undefined
>()
expectTypeOf(depositMetadata.title).toEqualTypeOf<string>()

//
// Deposition
//

expectTypeOf(deposition).toEqualTypeOf<
  EmptyDeposition | InProgressDeposition | SubmittedDeposition | UnsubmittedDeposition
>()

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
// InProgressDeposition
//

expectTypeOf(inProgressDeposition.id).toEqualTypeOf<number>()
expectTypeOf(inProgressDeposition.links.publish).toEqualTypeOf<URL>()
expectTypeOf(inProgressDeposition.metadata).toMatchTypeOf<DepositMetadata>()
expectTypeOf(inProgressDeposition.metadata.doi).toEqualTypeOf<Doi>()
expectTypeOf(inProgressDeposition.metadata.prereserve_doi.doi).toEqualTypeOf<Doi>()
expectTypeOf(inProgressDeposition.state).toEqualTypeOf<'inprogress'>()
expectTypeOf(inProgressDeposition.submitted).toEqualTypeOf<true>()

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
// getDeposition
//

expectTypeOf(_.getDeposition(number)).toMatchTypeOf<
  ReaderTaskEither<ZenodoAuthenticatedEnv, Error | DecodeError | Response, Deposition>
>()

//
// createDeposition
//

expectTypeOf(_.createDeposition(depositMetadata)).toMatchTypeOf<
  ReaderTaskEither<ZenodoAuthenticatedEnv, Error | DecodeError | Response, UnsubmittedDeposition>
>()

//
// unlockDeposition
//

expectTypeOf(_.unlockDeposition(submittedDeposition)).toMatchTypeOf<
  ReaderTaskEither<ZenodoAuthenticatedEnv, Error | DecodeError | Response, InProgressDeposition>
>()

//
// updateDeposition
//

expectTypeOf(_.updateDeposition(depositMetadata, emptyDeposition)).toMatchTypeOf<
  ReaderTaskEither<ZenodoAuthenticatedEnv, Error | DecodeError | Response, UnsubmittedDeposition>
>()
expectTypeOf(_.updateDeposition(depositMetadata, inProgressDeposition)).toMatchTypeOf<
  ReaderTaskEither<ZenodoAuthenticatedEnv, Error | DecodeError | Response, InProgressDeposition>
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
