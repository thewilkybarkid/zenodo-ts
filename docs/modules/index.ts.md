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
  - [EmptyDepositionC](#emptydepositionc)
  - [RecordC](#recordc)
  - [RecordsC](#recordsc)
  - [SubmittedDepositionC](#submitteddepositionc)
  - [UnsubmittedDepositionC](#unsubmitteddepositionc)
- [constructors](#constructors)
  - [createDeposition](#createdeposition)
  - [createEmptyDeposition](#createemptydeposition)
  - [getCommunityRecords](#getcommunityrecords)
  - [getRecord](#getrecord)
  - [getRecords](#getrecords)
  - [publishDeposition](#publishdeposition)
  - [updateDeposition](#updatedeposition)
  - [uploadFile](#uploadfile)
- [model](#model)
  - [DepositMetadata (type alias)](#depositmetadata-type-alias)
  - [EmptyDeposition (type alias)](#emptydeposition-type-alias)
  - [Record (type alias)](#record-type-alias)
  - [Records (type alias)](#records-type-alias)
  - [SubmittedDeposition (type alias)](#submitteddeposition-type-alias)
  - [UnsubmittedDeposition (type alias)](#unsubmitteddeposition-type-alias)
  - [ZenodoAuthenticatedEnv (interface)](#zenodoauthenticatedenv-interface)
  - [ZenodoEnv (interface)](#zenodoenv-interface)

---

# codecs

## EmptyDepositionC

**Signature**

```ts
export declare const EmptyDepositionC: C.Codec<string, string, EmptyDeposition>
```

Added in v0.1.10

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
  deposition: UnsubmittedDeposition
) => ReaderTaskEither<ZenodoAuthenticatedEnv, Error | DecodeError | Response, SubmittedDeposition>
```

Added in v0.1.3

## updateDeposition

**Signature**

```ts
export declare const updateDeposition: <T extends EmptyDeposition | UnsubmittedDeposition>(
  metadata: DepositMetadata,
  deposition: T
) => ReaderTaskEither<ZenodoAuthenticatedEnv, Error | DecodeError | Response, UnsubmittedDeposition>
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
  keywords?: NonEmptyArray<string>
  related_identifiers?: NonEmptyArray<{
    scheme: string
    identifier: string
    relation: string
    resource_type?: string
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

## Record (type alias)

**Signature**

```ts
export type Record = {
  conceptdoi: Doi
  conceptrecid: number
  files: NonEmptyArray<{
    key: string
    links: {
      self: URL
    }
    size: number
  }>
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
    description: string
    doi: Doi
    language?: string
    license: {
      id: string
    }
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
          subtype: 'diagram' | 'drawing' | 'figure' | 'other' | 'photo' | 'plot'
        }
      | {
          type: 'publication'
          subtype:
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
    title: string
  }
}
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
