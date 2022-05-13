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
- [constructors](#constructors)
  - [getRecord](#getrecord)
  - [getRecords](#getrecords)
- [model](#model)
  - [Record (type alias)](#record-type-alias)
  - [Records (type alias)](#records-type-alias)
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

# constructors

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

# model

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

## ZenodoEnv (interface)

**Signature**

```ts
export interface ZenodoEnv extends FetchEnv {
  zenodoUrl?: URL
}
```

Added in v0.1.1
