# redis-async-wrapper
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]
Redis keys async wrapper

### Get Started
```
const model = require('redis-async-wrapper')
model.init({url: "redis://host:port", keyPrefix: "app"})
Templates = {
  user: "user:%s:%s" //  user:userId:type
}
User = new model.Redis_Hash({tpl:Templates.user})

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

