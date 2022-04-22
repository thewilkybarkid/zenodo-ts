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
- [constructors](#constructors)
  - [getRecord](#getrecord)
- [model](#model)
  - [Record (type alias)](#record-type-alias)
  - [ZenodoEnv (interface)](#zenodoenv-interface)

---

# codecs

## RecordC

**Signature**

```ts
export declare const RecordC: C.Codec<string, string, Record>
```

Added in v0.1.0

# constructors

## getRecord

**Signature**

```ts
export declare const getRecord: (id: number) => ReaderTaskEither<ZenodoEnv, unknown, Record>
```

Added in v0.1.0

# model

## Record (type alias)

**Signature**

```ts
export type Record = {
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

## ZenodoEnv (interface)

**Signature**

```ts
export interface ZenodoEnv extends FetchEnv {
  zenodoUrl?: URL
}
```

Added in v0.1.0
