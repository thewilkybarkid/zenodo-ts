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
  - [RecordC](#recordc)
  - [RecordsC](#recordsc)
  - [SubmittedDepositionC](#submitteddepositionc)
  - [UnsubmittedDepositionC](#unsubmitteddepositionc)
- [constructors](#constructors)
  - [createDeposition](#createdeposition)
  - [getRecord](#getrecord)
  - [getRecords](#getrecords)
  - [publishDeposition](#publishdeposition)
  - [uploadFile](#uploadfile)
- [model](#model)
  - [DepositMetadata (type alias)](#depositmetadata-type-alias)
  - [Record (type alias)](#record-type-alias)
  - [Records (type alias)](#records-type-alias)
  - [SubmittedDeposition (type alias)](#submitteddeposition-type-alias)
  - [UnsubmittedDeposition (type alias)](#unsubmitteddeposition-type-alias)
  - [ZenodoAuthenticatedEnv (interface)](#zenodoauthenticatedenv-interface)
  - [ZenodoEnv (interface)](#zenodoenv-interface)

---

# codecs

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
) => ReaderTaskEither<ZenodoAuthenticatedEnv, unknown, UnsubmittedDeposition>
```

Added in v0.1.2

## getRecord

**Signature**

```ts
export declare const getRecord: (id: number) => ReaderTaskEither<ZenodoEnv, unknown, Record>
```

Added in v0.1.0

## getRecords

**Signature**

```ts
export declare const getRecords: (query: URLSearchParams) => ReaderTaskEither<ZenodoEnv, unknown, Records>
```

Added in v0.1.1

## publishDeposition

**Signature**

```ts
export declare const publishDeposition: (
  deposition: UnsubmittedDeposition
) => ReaderTaskEither<ZenodoAuthenticatedEnv, unknown, SubmittedDeposition>
```

Added in v0.1.3

## uploadFile

**Signature**

```ts
export declare const uploadFile: (upload: {
  readonly name: string
  readonly type: string
  readonly content: string
}) => (deposition: UnsubmittedDeposition) => ReaderTaskEither<ZenodoAuthenticatedEnv, unknown, void>
```

Added in v0.1.3

# model

## DepositMetadata (type alias)

**Signature**

```ts
export type DepositMetadata = {
  creators: NonEmptyArray<{
    name: string
  }>
  description: string
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

## Record (type alias)

**Signature**

```ts
export type Record = {
  conceptdoi: Doi
  conceptrecid: number
  id: number
  metadata: {
    communities?: NonEmptyArray<{
      id: string
    }>
    creators: NonEmptyArray<{
      name: string
    }>
    description: string
    doi: Doi
    language?: string
    license: {
      id: string
    }
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
  zenodoUrl?: URL
}
```

Added in v0.1.1
