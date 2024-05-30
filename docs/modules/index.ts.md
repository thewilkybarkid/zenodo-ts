---
title: index.ts
nav_order: 1
parent: Modules
---

## index overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [codecs](#codecs)
  - [DepositionC](#depositionc)
  - [EmptyDepositionC](#emptydepositionc)
  - [InProgressDepositionC](#inprogressdepositionc)
  - [RecordC](#recordc)
  - [RecordsC](#recordsc)
  - [SubmittedDepositionC](#submitteddepositionc)
  - [UnsubmittedDepositionC](#unsubmitteddepositionc)
- [constructors](#constructors)
  - [createDeposition](#createdeposition)
  - [createEmptyDeposition](#createemptydeposition)
  - [getCommunityRecords](#getcommunityrecords)
  - [getDeposition](#getdeposition)
  - [getRecord](#getrecord)
  - [getRecords](#getrecords)
  - [publishDeposition](#publishdeposition)
  - [unlockDeposition](#unlockdeposition)
  - [updateDeposition](#updatedeposition)
  - [uploadFile](#uploadfile)
- [model](#model)
  - [DepositMetadata (type alias)](#depositmetadata-type-alias)
  - [Deposition (type alias)](#deposition-type-alias)
  - [EmptyDeposition (type alias)](#emptydeposition-type-alias)
  - [InProgressDeposition (type alias)](#inprogressdeposition-type-alias)
  - [Record (type alias)](#record-type-alias)
  - [Records (type alias)](#records-type-alias)
  - [SubmittedDeposition (type alias)](#submitteddeposition-type-alias)
  - [UnsubmittedDeposition (type alias)](#unsubmitteddeposition-type-alias)
  - [ZenodoAuthenticatedEnv (interface)](#zenodoauthenticatedenv-interface)
  - [ZenodoEnv (interface)](#zenodoenv-interface)
- [refinements](#refinements)
  - [depositionIsEmpty](#depositionisempty)
  - [depositionIsInProgress](#depositionisinprogress)
  - [depositionIsSubmitted](#depositionissubmitted)
  - [depositionIsUnsubmitted](#depositionisunsubmitted)
- [utils](#utils)
  - [isEmbargoedRecord](#isembargoedrecord)
  - [isOpenRecord](#isopenrecord)
  - [isRestrictedRecord](#isrestrictedrecord)

---

# codecs

## DepositionC

**Signature**

```ts
export declare const DepositionC: C.Codec<string, string, Deposition>
```

Added in v0.1.17

## EmptyDepositionC

**Signature**

```ts
export declare const EmptyDepositionC: C.Codec<string, string, EmptyDeposition>
```

Added in v0.1.10

## InProgressDepositionC

**Signature**

```ts
export declare const InProgressDepositionC: C.Codec<string, string, InProgressDeposition>
```

Added in v0.1.17

## RecordC

**Signature**

```ts
export declare const RecordC: C.Codec<string, string, Record>
```

Added in v0.1.0

## RecordsC

**Signature**

```ts
export declare const RecordsC: C.Codec<string, string, Records>
```

Added in v0.1.1

## SubmittedDepositionC

**Signature**

```ts
export declare const SubmittedDepositionC: C.Codec<string, string, SubmittedDeposition>
```

Added in v0.1.3

## UnsubmittedDepositionC

**Signature**

```ts
export declare const UnsubmittedDepositionC: C.Codec<string, string, UnsubmittedDeposition>
```

Added in v0.1.2

# constructors

## createDeposition

**Signature**

```ts
export declare const createDeposition: (
  metadata: DepositMetadata
) => ReaderTaskEither<ZenodoAuthenticatedEnv, Error | DecodeError | Response, UnsubmittedDeposition>
```

Added in v0.1.2

## createEmptyDeposition

**Signature**

```ts
export declare const createEmptyDeposition: () => ReaderTaskEither<
  ZenodoAuthenticatedEnv,
  Error | DecodeError | Response,
  EmptyDeposition
>
```

Added in v0.1.10

## getCommunityRecords

**Signature**

```ts
export declare const getCommunityRecords: (
  community: string
) => (query: URLSearchParams) => ReaderTaskEither<ZenodoEnv, Error | DecodeError | Response, Records>
```

Added in v0.1.16

## getDeposition

**Signature**

```ts
export declare const getDeposition: (
  id: number
) => ReaderTaskEither<ZenodoAuthenticatedEnv, Error | DecodeError | Response, Deposition>
```

Added in v0.1.17

## getRecord

**Signature**

```ts
export declare const getRecord: (id: number) => ReaderTaskEither<ZenodoEnv, Error | DecodeError | Response, Record>
```

Added in v0.1.0

## getRecords

**Signature**

```ts
export declare const getRecords: (
  query: URLSearchParams
) => ReaderTaskEither<ZenodoEnv, Error | DecodeError | Response, Records>
```

Added in v0.1.1

## publishDeposition

**Signature**

```ts
export declare const publishDeposition: (
  deposition: InProgressDeposition | UnsubmittedDeposition
) => ReaderTaskEither<ZenodoAuthenticatedEnv, Error | DecodeError | Response, SubmittedDeposition>
```

Added in v0.1.3

## unlockDeposition

**Signature**

```ts
export declare const unlockDeposition: (
  deposition: SubmittedDeposition
) => ReaderTaskEither<ZenodoAuthenticatedEnv, Error | DecodeError | Response, InProgressDeposition>
```

Added in v0.1.17

## updateDeposition

**Signature**

```ts
export declare const updateDeposition: {
  (metadata: DepositMetadata, deposition: InProgressDeposition): ReaderTaskEither<
    ZenodoAuthenticatedEnv,
    Error | DecodeError | Response,
    InProgressDeposition
  >
  <T extends EmptyDeposition | UnsubmittedDeposition>(metadata: DepositMetadata, deposition: T): ReaderTaskEither<
    ZenodoAuthenticatedEnv,
    Error | DecodeError | Response,
    UnsubmittedDeposition
  >
}
```

Added in v0.1.10

## uploadFile

**Signature**

```ts
export declare const uploadFile: (upload: {
  readonly name: string
  readonly content: string
}) => <T extends EmptyDeposition | UnsubmittedDeposition>(
  deposition: T
) => ReaderTaskEither<ZenodoAuthenticatedEnv, Error | Response, void>
```

Added in v0.1.3

# model

## DepositMetadata (type alias)

**Signature**

```ts
export type DepositMetadata = {
  communities?: NonEmptyArray<{
    identifier: string
  }>
  contributors?: NonEmptyArray<{
    name: string
    orcid?: Orcid
    type: string
  }>
  creators: NonEmptyArray<{
    name: string
    orcid?: Orcid
  }>
  description: string
  imprint_publisher?: string
  keywords?: NonEmptyArray<string>
  license?: string
  publication_date?: Date
  related_identifiers?: NonEmptyArray<{
    scheme: string
    identifier: string
    relation: string
    resource_type?: string
  }>
  subjects?: NonEmptyArray<{
    scheme: string
    identifier: string
    term: string
  }>
  title: string
} & (
  | {
      upload_type:
        | 'dataset'
        | 'figure'
        | 'lesson'
        | 'other'
        | 'physicalobject'
        | 'poster'
        | 'presentation'
        | 'software'
        | 'video'
    }
  | {
      upload_type: 'image'
      image_type: 'diagram' | 'drawing' | 'figure' | 'other' | 'photo' | 'plot'
    }
  | {
      upload_type: 'publication'
      publication_type:
        | 'annotationcollection'
        | 'article'
        | 'book'
        | 'conferencepaper'
        | 'datamanagementplan'
        | 'deliverable'
        | 'milestone'
        | 'other'
        | 'patent'
        | 'peerreview'
        | 'preprint'
        | 'proposal'
        | 'report'
        | 'section'
        | 'softwaredocumentation'
        | 'taxonomictreatment'
        | 'technicalnote'
        | 'thesis'
        | 'workingpaper'
    }
)
```

Added in v0.1.2

## Deposition (type alias)

**Signature**

```ts
export type Deposition = EmptyDeposition | InProgressDeposition | SubmittedDeposition | UnsubmittedDeposition
```

Added in v0.1.17

## EmptyDeposition (type alias)

**Signature**

```ts
export type EmptyDeposition = {
  id: number
  links: {
    bucket: URL
    self: URL
  }
  metadata: {
    prereserve_doi: {
      doi: Doi
    }
  }
  state: 'unsubmitted'
  submitted: false
}
```

Added in v0.1.10

## InProgressDeposition (type alias)

**Signature**

```ts
export type InProgressDeposition = {
  id: number
  links: {
    publish: URL
    self: URL
  }
  metadata: DepositMetadata & {
    doi: Doi
    prereserve_doi: {
      doi: Doi
    }
  }
  state: 'inprogress'
  submitted: true
}
```

Added in v0.1.17

## Record (type alias)

**Signature**

```ts
export type Record = {
  conceptdoi?: Doi
  conceptrecid: number
  id: number
  links: {
    latest: URL
    latest_html: URL
  }
  metadata: {
    communities?: NonEmptyArray<{
      id: string
    }>
    contributors?: NonEmptyArray<{
      name: string
      orcid?: Orcid
      type: string
    }>
    creators: NonEmptyArray<{
      name: string
      orcid?: Orcid
    }>
    description?: string
    doi: Doi
    language?: string
    keywords?: NonEmptyArray<string>
    notes?: string
    publication_date: Date
    related_identifiers?: NonEmptyArray<{
      scheme: string
      identifier: string
      relation: string
      resource_type?: string
    }>
    resource_type:
      | {
          type:
            | 'dataset'
            | 'figure'
            | 'lesson'
            | 'other'
            | 'physicalobject'
            | 'poster'
            | 'presentation'
            | 'software'
            | 'video'
        }
      | {
          type: 'image'
          subtype?: 'diagram' | 'drawing' | 'figure' | 'other' | 'photo' | 'plot'
        }
      | {
          type: 'publication'
          subtype?:
            | 'annotationcollection'
            | 'article'
            | 'book'
            | 'conferencepaper'
            | 'datamanagementplan'
            | 'datapaper'
            | 'deliverable'
            | 'milestone'
            | 'other'
            | 'patent'
            | 'peerreview'
            | 'preprint'
            | 'proposal'
            | 'report'
            | 'section'
            | 'softwaredocumentation'
            | 'taxonomictreatment'
            | 'technicalnote'
            | 'thesis'
            | 'workingpaper'
        }
    subjects?: NonEmptyArray<{
      scheme: string
      identifier: string
      term: string
    }>
    title: string
  }
} & (
  | {
      files: NonEmptyArray<{
        key: string
        links: {
          self: URL
        }
        size: number
      }>
      metadata: { access_right: 'open'; license: { id: string } }
    }
  | { metadata: { access_right: 'embargoed'; embargo_date: Date; license: { id: string } } }
  | { metadata: { access_right: 'restricted'; license?: { id: string } } }
)
```

Added in v0.1.0

## Records (type alias)

**Signature**

```ts
export type Records = {
  hits: {
    hits: Array<Record>
    total: number
  }
}
```

Added in v0.1.1

## SubmittedDeposition (type alias)

**Signature**

```ts
export type SubmittedDeposition = {
  id: number
  links: {
    edit: URL
  }
  metadata: DepositMetadata & {
    doi: Doi
  }
  state: 'done'
  submitted: true
}
```

Added in v0.1.3

## UnsubmittedDeposition (type alias)

**Signature**

```ts
export type UnsubmittedDeposition = {
  id: number
  links: {
    bucket: URL
    publish: URL
    self: URL
  }
  metadata: DepositMetadata & {
    prereserve_doi: {
      doi: Doi
    }
  }
  state: 'unsubmitted'
  submitted: false
}
```

Added in v0.1.2

## ZenodoAuthenticatedEnv (interface)

**Signature**

```ts
export interface ZenodoAuthenticatedEnv extends ZenodoEnv {
  zenodoApiKey: string
}
```

Added in v0.1.2

## ZenodoEnv (interface)

**Signature**

```ts
export interface ZenodoEnv extends FetchEnv {
  zenodoApiKey?: string
  zenodoUrl?: URL
}
```

Added in v0.1.1

# refinements

## depositionIsEmpty

**Signature**

```ts
export declare const depositionIsEmpty: Refinement<Deposition, EmptyDeposition>
```

Added in v0.1.17

## depositionIsInProgress

**Signature**

```ts
export declare const depositionIsInProgress: Refinement<Deposition, InProgressDeposition>
```

Added in v0.1.17

## depositionIsSubmitted

**Signature**

```ts
export declare const depositionIsSubmitted: Refinement<Deposition, SubmittedDeposition>
```

Added in v0.1.17

## depositionIsUnsubmitted

**Signature**

```ts
export declare const depositionIsUnsubmitted: Refinement<Deposition, UnsubmittedDeposition>
```

Added in v0.1.17

# utils

## isEmbargoedRecord

**Signature**

```ts
export declare function isEmbargoedRecord(
  record: Record
): record is Extract<Record, { metadata: { access_right: 'embargoed' } }>
```

Added in v0.1.19

## isOpenRecord

**Signature**

```ts
export declare function isOpenRecord(record: Record): record is Extract<Record, { metadata: { access_right: 'open' } }>
```

Added in v0.1.19

## isRestrictedRecord

**Signature**

```ts
export declare function isRestrictedRecord(
  record: Record
): record is Extract<Record, { metadata: { access_right: 'restricted' } }>
```

Added in v0.1.19
