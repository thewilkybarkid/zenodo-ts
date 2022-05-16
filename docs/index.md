---
title: Home
nav_order: 1
---

A [Zenodo API] client for use with [fp-ts].

# Examples

## Reading a record

```ts
import fetch from 'cross-fetch'
import * as C from 'fp-ts/Console'
import * as RTE from 'fp-ts/ReaderTaskEither'
import { pipe } from 'fp-ts/function'
import { ZenodoEnv, getRecord } from 'zenodo-ts'

const env: ZenodoEnv = {
  fetch,
}

void pipe(
  getRecord(5770712),
  RTE.chainFirstIOK(record => C.log(`Title is "${record.metadata.title}"`)),
)(env)()
/*
Title is "Open Reviewers Africa – A workshop to empower the next generation of African Peer Reviewers"
*/
```

## Creating and publishing a deposition on the sandbox

```ts
import fetch from 'cross-fetch'
import * as C from 'fp-ts/Console'
import * as RTE from 'fp-ts/ReaderTaskEither'
import { pipe } from 'fp-ts/function'
import { ZenodoAuthenticatedEnv, createDeposition, publishDeposition, uploadFile } from 'zenodo-ts'

const env: ZenodoAuthenticatedEnv = {
  fetch,
  zenodoApiKey: 'my-api-key',
  zenodoUrl: new URL('https://sandbox.zenodo.org/'),
}

void pipe(
  createDeposition({
    title: 'Toward a Unified Theory of High-Energy Metaphysics: Silly String Theory',
    description: 'The characteristic theme of the works of Stone is the bridge between culture and ...',
    creators: [{ name: 'Josiah Carberry' }],
    upload_type: 'publication',
    publication_type: 'article',
  }),
  RTE.chainFirst(
    uploadFile({
      name: 'silly-string-theory.txt',
      type: 'text/plain',
      content: 'The characteristic theme of the works of Stone is the bridge between culture and ...',
    }),
  ),
  RTE.chain(publishDeposition),
  RTE.chainFirstIOK(deposition => C.log(`State is "${deposition.state}"`)),
)(env)()
/*
State is "done"
*/
```

[fp-ts]: https://gcanti.github.io/fp-ts/
[zenodo api]: https://developers.zenodo.org/
