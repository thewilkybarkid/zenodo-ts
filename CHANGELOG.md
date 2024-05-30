# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.1.21](https://github.com/thewilkybarkid/zenodo-ts/compare/v0.1.20...v0.1.21) (2024-05-30)


### Features

* add subjects to Record and DepositMetadata ([5933e27](https://github.com/thewilkybarkid/zenodo-ts/commit/5933e27fb479f2fea9c09b4f7051a6e6dda16e8d))

### [0.1.20](https://github.com/thewilkybarkid/zenodo-ts/compare/v0.1.19...v0.1.20) (2024-04-19)


### Bug Fixes

* decode records with a datapaper subtype ([e57b812](https://github.com/thewilkybarkid/zenodo-ts/commit/e57b8122d6edfe1fb0dd0f49ed277a9180b53985))
* decode restricted records without a license ([50ce597](https://github.com/thewilkybarkid/zenodo-ts/commit/50ce5971a20dff1275a2a0fb69497c94377e67b2))

### [0.1.19](https://github.com/thewilkybarkid/zenodo-ts/compare/v0.1.18...v0.1.19) (2024-04-09)


### Features

* add access_right to Record ([f4bc2f3](https://github.com/thewilkybarkid/zenodo-ts/commit/f4bc2f32a65517eb422245efe49da42b8f5df8b2))


### Bug Fixes

* decode embargoed records ([6e6a796](https://github.com/thewilkybarkid/zenodo-ts/commit/6e6a7969cc349c212f556cd4f08d16bfcc37166f))
* decode records without a concept DOI ([6145f49](https://github.com/thewilkybarkid/zenodo-ts/commit/6145f49fe751be5de31cdc5c1060f43b9cf1e723))
* decode records without a description ([f9909c9](https://github.com/thewilkybarkid/zenodo-ts/commit/f9909c95cadea083f7c6f233a731a660f45a5190))
* decode restricted records ([5a36826](https://github.com/thewilkybarkid/zenodo-ts/commit/5a36826dbe81d6b4e33f5eda69c89868e8ec9875))

### [0.1.18](https://github.com/thewilkybarkid/zenodo-ts/compare/v0.1.17...v0.1.18) (2024-04-08)


### Bug Fixes

* decode records where there is no subtype ([c4004e4](https://github.com/thewilkybarkid/zenodo-ts/commit/c4004e43b81c523072a33a41117c3d181b76b643))

### [0.1.17](https://github.com/thewilkybarkid/zenodo-ts/compare/v0.1.16...v0.1.17) (2024-01-15)


### Features

* add an overall Deposition type ([1a30db0](https://github.com/thewilkybarkid/zenodo-ts/commit/1a30db0677d153708285dff9173c65fc9b90eff4))
* allow editing of published depositions ([08c177e](https://github.com/thewilkybarkid/zenodo-ts/commit/08c177eee86007df2264b068f0e22e0e5339170f))
* allow in-progress depositions to be published ([8b548e5](https://github.com/thewilkybarkid/zenodo-ts/commit/8b548e5c76ef021faf0fb5dcccf3c58fe127904f))
* allow in-progress depositions to be updated ([23643e9](https://github.com/thewilkybarkid/zenodo-ts/commit/23643e912c9f7b40386809966f56979021fa0850))
* distinguish between deposition types ([53aabe4](https://github.com/thewilkybarkid/zenodo-ts/commit/53aabe4860dce73d0e5bf9551457279de3dd67b2))
* get a deposition ([6a06ab7](https://github.com/thewilkybarkid/zenodo-ts/commit/6a06ab78517b1093f6583a3a0373a87b1a03d887))


### Bug Fixes

* support in-progress depositions ([36dbb70](https://github.com/thewilkybarkid/zenodo-ts/commit/36dbb706448aadead518c2c048c43d91643fceba))

### [0.1.16](https://github.com/thewilkybarkid/zenodo-ts/compare/v0.1.15...v0.1.16) (2024-01-15)


### Features

* add imprint publisher to DepositMetadata ([a43a7b9](https://github.com/thewilkybarkid/zenodo-ts/commit/a43a7b93783eb87d767107d1eb0e86c108444e1d))
* add license to DepositMetadata ([058926d](https://github.com/thewilkybarkid/zenodo-ts/commit/058926dae7525a963b56e0be319e690d7ce57853))
* add publication date to DepositMetadata ([9df7a4a](https://github.com/thewilkybarkid/zenodo-ts/commit/9df7a4a560f9361b99dcf5aca29ba610b97070c2))
* search for records in a community ([0ae8ff3](https://github.com/thewilkybarkid/zenodo-ts/commit/0ae8ff33b0f7bfce920dc6c8f0be0eab694f7757))


### Bug Fixes

* don't fail on an empty list of contributors ([347e705](https://github.com/thewilkybarkid/zenodo-ts/commit/347e705cc7889f1d9e510fe02f930defda67bd3e))
* match API breaking change ([5015e21](https://github.com/thewilkybarkid/zenodo-ts/commit/5015e214805a90678b6dda78bbee680b2f5c1b50))
* update records API path ([9bbada6](https://github.com/thewilkybarkid/zenodo-ts/commit/9bbada6cb891aead9fe4b919a2b1c144eb85e14b))

### [0.1.15](https://github.com/thewilkybarkid/zenodo-ts/compare/v0.1.14...v0.1.15) (2023-10-13)


### Features

* set Accept headers ([cdc03e6](https://github.com/thewilkybarkid/zenodo-ts/commit/cdc03e6e180a59d0ef3ed7ee41ca5b4b942c12b4))
* type errors ([6a123d6](https://github.com/thewilkybarkid/zenodo-ts/commit/6a123d6b47e548ad4298bbee62706c185900d8c7))

### [0.1.14](https://github.com/thewilkybarkid/zenodo-ts/compare/v0.1.13...v0.1.14) (2023-10-05)


### Features

* add notes to Record ([2a88d7f](https://github.com/thewilkybarkid/zenodo-ts/commit/2a88d7f19ddbf95b25c3066f9c98af0ce117a7b6))

### [0.1.13](https://github.com/thewilkybarkid/zenodo-ts/compare/v0.1.12...v0.1.13) (2023-06-30)


### Bug Fixes

* decode records with an empty community list ([9b2ca28](https://github.com/thewilkybarkid/zenodo-ts/commit/9b2ca280a61e7d0fdaae9437221f700d35efd40d))

### [0.1.12](https://github.com/thewilkybarkid/zenodo-ts/compare/v0.1.11...v0.1.12) (2023-06-27)


### Bug Fixes

* allow the compiler to infer correctly whether the deposition is empty or not ([9465edb](https://github.com/thewilkybarkid/zenodo-ts/commit/9465edba8cc17df340bdcf695bb76ec660e16775))

### [0.1.11](https://github.com/thewilkybarkid/zenodo-ts/compare/v0.1.10...v0.1.11) (2023-06-27)


### Features

* add contributors ([957a52d](https://github.com/thewilkybarkid/zenodo-ts/commit/957a52d5cb03bf049632ecdf7b65abf24ffe0e7c))
* upload files to empty depositions ([91dd08d](https://github.com/thewilkybarkid/zenodo-ts/commit/91dd08de836216598463f419ce8d69bb542371c1))

### [0.1.10](https://github.com/thewilkybarkid/zenodo-ts/compare/v0.1.9...v0.1.10) (2023-06-21)


### Features

* create an empty deposition ([ec85243](https://github.com/thewilkybarkid/zenodo-ts/commit/ec85243cb7975f9050e395a7117a2b07ae311058))
* update a deposition ([8b3aa49](https://github.com/thewilkybarkid/zenodo-ts/commit/8b3aa49cd134f4d9bbdbf1c98187dc35d28b80d2))

### [0.1.9](https://github.com/thewilkybarkid/zenodo-ts/compare/v0.1.8...v0.1.9) (2023-04-24)


### Features

* add the total number of hits ([72a7685](https://github.com/thewilkybarkid/zenodo-ts/commit/72a768548d601a7b31cf36b26ea564ebd77a4d53))

### [0.1.8](https://github.com/thewilkybarkid/zenodo-ts/compare/v0.1.7...v0.1.8) (2022-12-06)


### Bug Fixes

* add peer review as a publication type ([28cc200](https://github.com/thewilkybarkid/zenodo-ts/commit/28cc200a534c2d739cd0a51c5e1b5b59a07df383))

### [0.1.7](https://github.com/thewilkybarkid/zenodo-ts/compare/v0.1.6...v0.1.7) (2022-11-18)


### Features

* allow all requests to be authenticated ([0d961d7](https://github.com/thewilkybarkid/zenodo-ts/commit/0d961d7295f51b56908bf827b43e8a3a02d33fec))

### [0.1.6](https://github.com/thewilkybarkid/zenodo-ts/compare/v0.1.5...v0.1.6) (2022-07-05)


### Features

* add files to Record ([99dea7c](https://github.com/thewilkybarkid/zenodo-ts/commit/99dea7c5df46660ee4cd2f0383f39c138ea08091))
* add publication date to Record ([1d39872](https://github.com/thewilkybarkid/zenodo-ts/commit/1d398720bf8deda7c2b48551f120802fbac7f7a6))

### [0.1.5](https://github.com/thewilkybarkid/zenodo-ts/compare/v0.1.4...v0.1.5) (2022-06-06)


### Features

* use ORCID iD type ([56e4139](https://github.com/thewilkybarkid/zenodo-ts/commit/56e4139b3e8390425291af936387ecf8d03fd0be))

### [0.1.4](https://github.com/thewilkybarkid/zenodo-ts/compare/v0.1.3...v0.1.4) (2022-05-17)


### Features

* add communities ([9653d86](https://github.com/thewilkybarkid/zenodo-ts/commit/9653d868661716424c5b3eaad6aa928ff677a42f))
* add keywords to Record and DepositMetadata ([b1c1f72](https://github.com/thewilkybarkid/zenodo-ts/commit/b1c1f720f6d5641c8a93f2a21d7c45a484f522d1))
* add latest links to Record ([33dce45](https://github.com/thewilkybarkid/zenodo-ts/commit/33dce4569b77ebcac046de9b21e3e72fb4f25be9))
* add ORCIDs to creators ([a22ab7f](https://github.com/thewilkybarkid/zenodo-ts/commit/a22ab7f748e5925ed30741e3dedef29f0a82a04b))
* add related identifiers to DepositMetadata ([d8d0e72](https://github.com/thewilkybarkid/zenodo-ts/commit/d8d0e728a1f7d633665a68fb4772c068e15617ec))

### [0.1.3](https://github.com/thewilkybarkid/zenodo-ts/compare/v0.1.2...v0.1.3) (2022-05-16)


### Features

* publish a deposition ([325044b](https://github.com/thewilkybarkid/zenodo-ts/commit/325044b2fe13062fcbda9602a1132767dfd51fd9))
* upload a file to a deposition ([1077a5a](https://github.com/thewilkybarkid/zenodo-ts/commit/1077a5ac4596ad30440116d7df16677b201059c5))


### Bug Fixes

* treat a 200 response as a success ([d1147c0](https://github.com/thewilkybarkid/zenodo-ts/commit/d1147c065968b1d01dc842c0b957b25066628f59))

### [0.1.2](https://github.com/thewilkybarkid/zenodo-ts/compare/v0.1.1...v0.1.2) (2022-05-13)


### Features

* add pre-reserved DOI to UnsubmittedDeposition ([7431f0d](https://github.com/thewilkybarkid/zenodo-ts/commit/7431f0d59f37debbc3ba38e27d2100aad49f7a6d))
* add related identifiers to Record ([34334fa](https://github.com/thewilkybarkid/zenodo-ts/commit/34334fa5f3bae739064cd2bcb7acc0b4c4f682cd))
* create a deposition ([287fdb6](https://github.com/thewilkybarkid/zenodo-ts/commit/287fdb63edaf21c5e70545d1e0b9dab1efc00d45))

### [0.1.1](https://github.com/thewilkybarkid/zenodo-ts/compare/v0.1.0...v0.1.1) (2022-05-12)


### Features

* add communities, language and license to Record ([ada3b71](https://github.com/thewilkybarkid/zenodo-ts/commit/ada3b71e689668694ae8734f070b2b2b18cd470c))
* add concept IDs to Record ([fbeaf58](https://github.com/thewilkybarkid/zenodo-ts/commit/fbeaf5867e8888685e24911ba10c1ecaf8fbf91f))
* search for records ([bacef2d](https://github.com/thewilkybarkid/zenodo-ts/commit/bacef2d33033602551234fbae5bc36f496627f8f))
* set the base Zenodo URL ([5d3a39c](https://github.com/thewilkybarkid/zenodo-ts/commit/5d3a39c6d4942504cad28731e4655ae6063493fd))

## 0.1.0 (2022-04-21)


### Features

* add a Record codec ([c445b3f](https://github.com/thewilkybarkid/zenodo-ts/commit/c445b3fd02ea7492c98e01a786f57d2adde8b2c4))
* add basic Record metadata ([b7a73c8](https://github.com/thewilkybarkid/zenodo-ts/commit/b7a73c80eb0b39770ce3ac8a39deefe898a0ee2c))
* add Record model ([17e0c72](https://github.com/thewilkybarkid/zenodo-ts/commit/17e0c72b2cf0bf07b06bcdc31365e60105481158))
* get a record by its ID ([25497fb](https://github.com/thewilkybarkid/zenodo-ts/commit/25497fb595f1c9c7301eda82d1587dac2a7cc94a))
