# redis-async-wrapper

[![Join the chat at https://gitter.im/devfans/redis-async-wrapper](https://badges.gitter.im/devfans/redis-async-wrapper.svg)](https://gitter.im/devfans/redis-async-wrapper?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

Redis keys async wrapper

### Installation

```
npm install --save redis-async-wrapper
```

### Get Started

```
const dal = require('redis-async-wrapper')

// init with options
dal.init({url: "redis://host:port", keyPrefix: "app"})

// define keys conventions
const Templates = {
  user: "user:%s:%s" //  user:userId:type
}

// define model
const User = new dal.Redis_Hash({tpl:Templates.user})

User.save = async (id, type,  infoObject) => {
  await User.hmset([id, type], infoObject)
  const user = await User.hgetall([id, type])
  console.log(`user ${user.name} is saved`)
}

User.save(1, 1, {name: "stefan"})
```

### Contributors Wanted
Glad to get contributors to this library, contact me at stefanliu@outlook.com !

[npm-image]: https://img.shields.io/npm/v/redis-async-wrapper.svg
[npm-url]: https://npmjs.org/package/redis-async-wrapper
[travis-image]: https://img.shields.io/travis/devfans/redis-async-wrapper/master.svg
[travis-url]: https://travis-ci.org/devfans/redis-async-wrapper
[coveralls-image]: https://img.shields.io/coveralls/devfans/redis-async-wrapper/master.svg
[coveralls-url]: https://coveralls.io/r/devfans/redis-async-wrapper?branch=master
[downloads-image]: https://img.shields.io/npm/dm/redis-async-wrapper.svg
[downloads-url]: https://npmjs.org/package/redis-async-wrapper

