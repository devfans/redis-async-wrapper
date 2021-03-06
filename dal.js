/* dependencies */
const bluebird = require('bluebird');
const redis = require('redis');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const wrapper = {redisOption: {}}
const fmt = require('util').format;

Dal = {}

Dal.init = (option) => {
  wrapper.redisOption = option || {}
  wrapper.db = redis.createClient(wrapper.redisOption)
  wrapper.keyPrefix = wrapper.redisOption.keyPrefix || ''
}

class Redis_Key {
  constructor(opt) {
    this.tpl = opt.tpl;
    this.exp = opt.exp || null
    if (!wrapper.db) throw Error("Please init first")
  }

  composeKeyStr(params) {
    return fmt.apply(this, [wrapper.keyPrefix + ':' + this.tpl].concat(params))
  }

  ttl(params) {
    return wrapper.db.ttlAsync(this.composeKeyStr(params));
  }

  expire(params, delta) {
    if (typeof delta === undefined) delta = this.exp || 0
    return wrapper.db.expireAsync(this.composeKeyStr(params), delta)
  }

  delete(params) {
    return wrapper.db.delAsync(this.composeKeyStr(params))
  }

  async exists(params) {
    return 1 == await wrapper.db.existsAsync(this.composeKeyStr(params));
  }

  async call (method, params, ...args) {
    const caller = wrapper.db[method + 'Async']
    if (caller) return caller(this.composeKeyStr(params), ...args)
  }
}

class Redis_String extends Redis_Key {
  get(params) {
    return wrapper.db.getAsync(this.composeKeyStr(params))
  }

  set(params, value, exp=null) {
    let ex = exp || this.exp;
    if (ex == null) {
      return wrapper.db.setAsync(this.composeKeyStr(params), value)
    } else {
      return wrapper.db.setAsync(this.composeKeyStr(params), value, 'EX', ex)
    }
  }

  incr(params) {
    return wrapper.db.incrAsync(this.composeKeyStr(params))
  }

  decr(params) {
    return wrapper.db.decrAsync(this.composeKeyStr(params))
  }

  async setnx(params, value) {
    return 1 == await wrapper.db.setnxAsync(this.composeKeyStr(params), value)
  }

}

class Redis_Hash extends Redis_Key {
  hset(params, field, value) {
    return wrapper.db.hsetAsync(this.composeKeyStr(params), field, value)
  }

  hget(params, field) {
    return wrapper.db.hgetAsync(this.composeKeyStr(params), field)
  }

  hlen(params) {
    return wrapper.db.hlenAsync(this.composeKeyStr(params))
  }

  async hsetnx(params, field, value) {
    return 1 == await wrapper.db.hsetnxAsync(this.composeKeyStr(params), field, value)
  }

  async hmset(params, value, exp=null) {
    let ex = exp || this.exp;
    let res = await wrapper.db.hmsetAsync(this.composeKeyStr(params), value)
    if (ex != null) {
      wrapper.db.expireAsync(this.composeKeyStr(params), ex)
    }
    return res
  }

  hkeys(params) {
    return wrapper.db.hkeysAsync(this.composeKeyStr(params))
  }

  hexists(params, field) {
    return wrapper.db.hexistsAsync(this.composeKeyStr(params), field)
  }

  hgetall(params) {
    return wrapper.db.hgetallAsync(this.composeKeyStr(params));
  }
}

class Redis_Set extends Redis_Key {
  sadd(params, value) {
    return wrapper.db.saddAsync(this.composeKeyStr(params), value)
  }

  async sismember(params, value) {
    let ismemeber = await wrapper.db.sismemberAsync(this.composeKeyStr(params), value)
    return ismemeber == 1
  }

  smembers(params) {
    return wrapper.db.smembersAsync(this.composeKeyStr(params))
  }
}

class Redis_List extends Redis_Key {
  lrange(params, l, r) {
    return wrapper.db.lrangeAsync(this.composeKeyStr(params), l, r)
  }

  rpush(params, value) {
    return wrapper.db.rpushAsync(this.composeKeyStr(params), value)
  }
}

class Redis_Chan extends Redis_Key {
  constructor(opt) {
    super(opt);
    this.pubClient = redis.createClient(redisOption);
  }

  getClient() {
    return redis.createClient(redisOption);
  }

  onSubscribe(c, cb) {
    return c.on('subscribe', cb)
  }

  onMessage(c, cb) {
    return c.on('message', cb)
  }

  onPMessage(c, cb) {
    return c.on('pmessage', cb)
  }

  subscribe(c, params) {
    return c.subscribe(this.composeKeyStr(params))
  }

  psubscribe(c, pattern) {
    return c.psubscribe(pattern)
  }

  publish(params, message) {
    return this.pubClient.publishAsync(this.composeKeyStr(params), message)
  }
}

class Redis_SSet extends Redis_Key {
  zadd(params, score, value) {
    return wrapper.db.zaddAsync(this.composeKeyStr(params), score, value)
  }

  zrange(params, ...args) {
    return wrapper.db.zrangeAsync(this.composeKeyStr(params), ...args)
  }

  zrevrange(params, ...args) {
    return wrapper.db.zrevrangeAsync(this.composeKeyStr(params), ...args)
  }

  zrangebyscore(params, ...args) {
    return wrapper.db.zrangebyscoreAsync(this.composeKeyStr(params), ...args)
  }

  zrevrangebyscore(params, ...args) {
    return wrapper.db.zrevrangebyscoreAsync(this.composeKeyStr(params), ...args)
  }

  zrem(params, value) {
    return wrapper.db.zremAsync(this.composeKeyStr(params), value)
  }

  zremrangebyscore(params, low, high) {
    return wrapper.db.zremrangebyscoreAsync(this.composeKeyStr(params), low, high)
  }
}


Object.assign(Dal, { Redis_Key, Redis_String, Redis_List, Redis_Hash, Redis_Chan, Redis_Set, Redis_SSet })
module.exports = Dal;
