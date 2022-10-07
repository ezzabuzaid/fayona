# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

### [0.5.2](https://github.com/ezzabuzaid/fayona/compare/0.5.1...0.5.2) (2022-10-07)


### Bug Fixes

* **routing:** remove assigning bulk properties to FromQuery model ([f83b413](https://github.com/ezzabuzaid/fayona/commit/f83b41368161c63c8a134665e18b73e318951c1d))

### [0.5.1](https://github.com/ezzabuzaid/fayona/compare/0.5.0...0.5.1) (2022-10-04)


### Bug Fixes

* **core:** make CreateFayona options optional ([3cfeb88](https://github.com/ezzabuzaid/fayona/commit/3cfeb887459c626715da2d363b9fc17cd8296df8))
* **routing:** call class type functions before standard functions in FromQuery ([5b12d6b](https://github.com/ezzabuzaid/fayona/commit/5b12d6b8f016fc95a480248dba28dfb244ce466d))

## [0.5.0](https://github.com/ezzabuzaid/fayona/compare/0.4.0...0.5.0) (2022-06-22)

## [0.4.0](https://github.com/ezzabuzaid/fayona/compare/0.3.0...0.4.0) (2022-06-14)

## [0.3.0](https://github.com/ezzabuzaid/fayona/compare/0.2.10...0.3.0) (2022-06-12)


### Features

* **openapi:** add openapi generator ([472e0ab](https://github.com/ezzabuzaid/fayona/commit/472e0ab1180d91ff740b12a97b8a3b1179ce2f3b))

### [0.2.10](https://github.com/ezzabuzaid/fayona/compare/0.2.9...0.2.10) (2022-05-25)


### Bug Fixes

* **routing:** @FromBody returns user class type instead of the final instance ([c02f457](https://github.com/ezzabuzaid/fayona/commit/c02f457cf8cd01ce60c495ed9509733ef71ac330))

### [0.2.9](https://github.com/ezzabuzaid/fayona/compare/0.2.8...0.2.9) (2022-05-20)


### Bug Fixes

* delegate the responsibility of binding routes to the user ([9a4c0da](https://github.com/ezzabuzaid/fayona/commit/9a4c0dae83c4dce8da6dc1f8f51febd07571390f))
* remove express router deps ([c1c9e3f](https://github.com/ezzabuzaid/fayona/commit/c1c9e3f0ca1f19766f9e9de0dead1dab32e0ad1a))
* **Routing:** remove prior validation of http action return type ([dd9abe8](https://github.com/ezzabuzaid/fayona/commit/dd9abe893bd8750374bae050529be190dfa51329))

### [0.2.8](https://github.com/ezzabuzaid/fayona/compare/0.2.7...0.2.8) (2022-05-16)


### Bug Fixes

* **Identity:** add signature to authentication middleware ([2230add](https://github.com/ezzabuzaid/fayona/commit/2230addc4a5f89a0c781a0afa338c5dc1c4184d5))
* move Fayona class to core ([7547710](https://github.com/ezzabuzaid/fayona/commit/7547710cf6eac45a9b7eb91c7eddca6496551d87))

### [0.2.7](https://github.com/ezzabuzaid/fayona/compare/0.2.6...0.2.7) (2022-05-15)


### Bug Fixes

* **Routing:** remove RemoveMiddleware ([da57d74](https://github.com/ezzabuzaid/fayona/commit/da57d74a0382014aa257181194cfd2cd34c808b8))
* **Routing:** use Injector instance instead of custom service collection ([fe32423](https://github.com/ezzabuzaid/fayona/commit/fe32423182d711fd68cb472c4ae6ff69849f7ceb))

### [0.2.6](https://github.com/ezzabuzaid/fayona/compare/0.2.5...0.2.6) (2022-05-15)


### Bug Fixes

* **Routing:** export routing middlewares as functions ([29618cb](https://github.com/ezzabuzaid/fayona/commit/29618cbc4e7e1c4977d17221507215a5244e3cea))
* **Routing:** expose full path and final handler ([ad03fbb](https://github.com/ezzabuzaid/fayona/commit/ad03fbb9362522eb90f7a3235ebb69c8abfed3e7))

### [0.2.5](https://github.com/ezzabuzaid/fayona/compare/0.2.4...0.2.5) (2022-05-15)


### Bug Fixes

* **Routing:** change Errors to errors ([19b2fac](https://github.com/ezzabuzaid/fayona/commit/19b2facdf1bc582aaef9782d78d8f5d49c074f9c))
* **Routing:** pass the incoming body to Validate function ([621ff8a](https://github.com/ezzabuzaid/fayona/commit/621ff8a4cba911d4c55f8f6a5208aeedd1d0c75e))

### [0.2.4](https://github.com/ezzabuzaid/fayona/compare/0.2.3...0.2.4) (2022-05-14)


### Bug Fixes

* remove not Implemented functions ([3759458](https://github.com/ezzabuzaid/fayona/commit/375945822cf204fcebc77f6402821c45d0673454))

### [0.2.3](https://github.com/ezzabuzaid/fayona/compare/0.2.2...0.2.3) (2022-05-14)


### Bug Fixes

* **Routing:** remove the ability to add child controllers ([e9bd094](https://github.com/ezzabuzaid/fayona/commit/e9bd094c836be9f029bb400abee2b5dae271eacf))

### [0.2.2](https://github.com/ezzabuzaid/fayona/compare/0.2.1...0.2.2) (2022-05-13)


### Bug Fixes

* **Routing:** convert FromRoute param value to the specified type ([6da345b](https://github.com/ezzabuzaid/fayona/commit/6da345b9d042bcbba1ceddf50a9bce44cb51f7a8))
* **Routing:** throw an error if and http action is not HttpResponse ([5c81581](https://github.com/ezzabuzaid/fayona/commit/5c81581ad35c5b0e882854714c456af1de689dc6))
* **Routing:** throw error upfront if param constraint type is not as native type ([995618f](https://github.com/ezzabuzaid/fayona/commit/995618ffd979bebbc3d15a83ed5f8a767b37b555))
* **Routing:** throw validation error for body ([09a3902](https://github.com/ezzabuzaid/fayona/commit/09a3902675975edc252b6044b72ed81e3529ba10))
* **Routing:** throw validation error for query ([3077316](https://github.com/ezzabuzaid/fayona/commit/3077316da153330f2135e6ae95dfae3b268eaea4))
