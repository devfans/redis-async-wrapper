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

  async getExp(params) {
    return wrapper.db.ttlAsync(this.composeKeyStr(params));
  }

  async expireKey(params, delta) {
    return wrapper.db.expireAsync(this.composeKeyStr(params), delta)
  }

  async deleteKey(params) {
    return wrapper.db.deleteAsync(this.composeKeyStr(params))
  }

  async exists(params) {
    let exist = await wrapper.db.existsAsync(this.composeKeyStr(params));
    return exist == 1;
  }

}

class Redis_String extends Redis_Key {
  async get(params) {
    return wrapper.db.getAsync(this.composeKeyStr(params))
  }

  async set(params, value, exp=null) {
    let ex = exp || this.exp;
    if (ex == null) {
      return wrapper.db.setAsync(this.composeKeyStr(params), value)
    } else {
      return wrapper.db.setAsync(this.composeKeyStr(params), value, 'EX', ex)
    }
  }

  async incr(params) {
    return wrapper.db.incrAsync(this.composeKeyStr(params))
  }

}

class Redis_Hash extends Redis_Key {
  async hset(params, field, value) {
    return wrapper.db.hsetAsync(this.composeKeyStr(params), field, value)
  }

  async hget(params, field) {
    return wrapper.db.hgetAsync(this.composeKeyStr(params), field)
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

  async hkeys(params) {
    return wrapper.db.hkeysAsync(this.composeKeyStr(params))
  }

  async hexists(params, field) {
    return wrapper.db.hexistsAsync(this.composeKeyStr(params), field)
  }

  async hgetall(params) {
    return wrapper.db.hgetallAsync(this.composeKeyStr(params));
  }

}

class Redis_Set extends Redis_Key {
  async sadd(params, value) {
    return wrapper.db.saddAsync(this.composeKeyStr(params), value)
  }

  async sismember(params, value) {
    let ismemeber = await wrapper.db.sismemberAsync(this.composeKeyStr(params), value)
    return ismemeber == 1
  }

  async smembers(params, value) {
    return wrapper.db.smembersAsync(this.composeKeyStr(params), value)
  }
}

class Redis_List extends Redis_Key {
  async lrange(params, l, r) {
    return wrapper.db.lrangeAsync(this.composeKeyStr(params), l, r)
  }

  async rpush(params, value) {
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

  async publish(params, message) {
    return this.pubClient.publishAsync(this.composeKeyStr(params), message)
  }
}

class Redis_SSet extends Redis_Key {
  async zadd(params, score, value) {
    return db.zaddAsync(this.composeKeyStr(params), score, value)
  }

  async zrange(params, ...args) {
    return db.zrangeAsync(this.composeKeyStr(params), ...arg)
  }

  async zrangebyscore(params, ...args) {
    return db.zrangebyscoreAsync(this.composeKeyStr(params), ...args)
  }

  async zrem(params, value) {
    return db.zremAsync(this.composeKeyStr(params), value)
  }

  async zremrangebyscore(params, low, high) {
    return db.zremrangebyscoreAsync(this.composeKeyStr(params), low, high)
  }
}


Object.assign(Dal, { Redis_Key, Redis_String, Redis_List, Redis_Hash, Redis_Chan, Redis_Set, Redis_SSet })
module.exports = Dal;
