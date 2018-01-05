# redis-async-wrapper
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
