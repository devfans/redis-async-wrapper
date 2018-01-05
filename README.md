# redis-async-wrapper
Redis keys async wrapper

Get Started
```
const model = require('redis-async-wrapper')
model.init({url: "redis://host:port", keyPrefix: "app"})
Templates = {
  user: "user:%s:%s" //  user:userId:type
}
User = new model.Redis_Hash({tpl:Templates.user})

User.save = async (id, type,  infoObject) => {
  return User.hmset([id, type], infoObject)
}


```
