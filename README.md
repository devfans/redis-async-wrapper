# redis-async
Redis keys async wrapper

Get Started
```
const model = require('redis-async')

Templates = {
  user: "user:%s" //  user:userId
}
User = new model.Redis_Hash({tpl:Templates.user})

User.save = async (id, infoObject) => {
  return User.hmset([id], infoObject)
}

```
