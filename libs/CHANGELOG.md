# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

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

* **Core:** remove .net classes ([67af9a7](https://github.com/ezzabuzaid/fayona/commit/67af9a735e9e037b30dd3c108a573bc873cf7435))
* **Core:** remove IWebApplicationBuilder ([6ec3283](https://github.com/ezzabuzaid/fayona/commit/6ec328390e4e33f7513b1fe13d31f06270dc1532))
* **Identity:**  add AuthenticationProblemDetailsException ([e07ff20](https://github.com/ezzabuzaid/fayona/commit/e07ff20be490400a35cf88ece7f10cc4a97cc455))
* **Identity:** throw an error if AuthenticationScheme name is null or undefined ([f485f5c](https://github.com/ezzabuzaid/fayona/commit/f485f5c335e79a541d71c0fe7853db17dcdf0138))
* **Routing:** remove RemoveMiddleware ([da57d74](https://github.com/ezzabuzaid/fayona/commit/da57d74a0382014aa257181194cfd2cd34c808b8))
* **Routing:** use Injector instance instead of custom service collection ([fe32423](https://github.com/ezzabuzaid/fayona/commit/fe32423182d711fd68cb472c4ae6ff69849f7ceb))

### [0.2.6](https://github.com/ezzabuzaid/fayona/compare/0.2.5...0.2.6) (2022-05-15)


### Bug Fixes

* **Core:** remove IWebApplication ([4705d37](https://github.com/ezzabuzaid/fayona/commit/4705d376d25de7b8f5fd110d1f92cc269c1683ac))
* **Identity:** change AuthenticationMiddleware to function ([6ebd3d3](https://github.com/ezzabuzaid/fayona/commit/6ebd3d3754c8f8f58acbf5f1da42bf2cea3998c5))
* **Routing:** export routing middlewares as functions ([29618cb](https://github.com/ezzabuzaid/fayona/commit/29618cbc4e7e1c4977d17221507215a5244e3cea))
* **Routing:** expose full path and final handler ([ad03fbb](https://github.com/ezzabuzaid/fayona/commit/ad03fbb9362522eb90f7a3235ebb69c8abfed3e7))

### [0.2.5](https://github.com/ezzabuzaid/fayona/compare/0.2.4...0.2.5) (2022-05-15)


### Bug Fixes

* **Core:** use root service collection ([578a562](https://github.com/ezzabuzaid/fayona/commit/578a56213f866e6b33d36c3c5c0332b0cd6d58e6))
* **Identity:** return ClaimsPrinicple instead of result class ([4da9143](https://github.com/ezzabuzaid/fayona/commit/4da9143ae58a430874e2be12f1cf1104b49e12b7))
* **Routing:** change Errors to errors ([19b2fac](https://github.com/ezzabuzaid/fayona/commit/19b2facdf1bc582aaef9782d78d8f5d49c074f9c))
* **Routing:** pass the incoming body to Validate function ([621ff8a](https://github.com/ezzabuzaid/fayona/commit/621ff8a4cba911d4c55f8f6a5208aeedd1d0c75e))

### [0.2.4](https://github.com/ezzabuzaid/fayona/compare/0.2.3...0.2.4) (2022-05-14)


### Bug Fixes

* remove not Implemented functions ([3759458](https://github.com/ezzabuzaid/fayona/commit/375945822cf204fcebc77f6402821c45d0673454))
