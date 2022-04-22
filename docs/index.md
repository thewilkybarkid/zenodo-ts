---
title: Home
nav_order: 1
---

A [Zenodo API] client for use with [fp-ts].

# Example

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

[fp-ts]: https://gcanti.github.io/fp-ts/
[zenodo api]: https://developers.zenodo.org/
