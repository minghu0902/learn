

function isTypeof(o, t) {
  return Object.prototype.toString.call(o) === '[object ' + t + ']'
}

const requestAnimationFrame = window.requestAnimationFrame ||
                              window.WebKitAnimationEvent ||
                              function (func) {
                                return setTimeout(func, 1000 / 60)
                              }

const cancelAnimationFrame = window.cancelAnimationFrame ||
                             window.webkitCancelAnimationFrame ||
                             function (id) {
                               return clearTimeout(id)
                             }

const STATE = {
  PENDDING: 'pendding',
  RUNNING: 'running',
  PAUSED: 'paused',
  END: 'end'
}

function Animate(options = {}) {

  const defaultOptions = {
    from: 0,
    to: 0,
    duration: 0,
    easing: 'Linear.None',
    delay: 0,
    repeat: 0,
    reverse: false,
    onStart: () => void 0,
    onEnd: () => void 0,
    onUpdate: () => void 0
  }

  options = Object.assign(defaultOptions, options)

  this._options = options
  this._from = options.from
  this._to = options.to
  this._duration = options.duration
  this._easing = options.easing
  this._delay = options.delay
  this._repeat = options.repeat
  this._reverse = options.reverse
  this._startCallback = options.onStart
  this._endCallback = options.onEnd
  this._updateCallback = options.onUpdate

  this._startTime = Date.now()
  this._differenceTime = 0 
  this._repeatCount = options.repeat
  this._reversed = false
  this._state = STATE.PENDDING
  this._chainInstances = []

  this._normalize()
  this._updateValueFunc = this._updateValueFactory()
}

Animate.prototype = {
  
  constructor: Animate,

  start: function () {

    if (this._state === STATE.RUNNING) {
      return
    }
    
    this._state = STATE.RUNNING
    this._startTime = Date.now()

    if (isTypeof(this._delay, 'Number')) {

      this._startTime += this._delay * 1000
    }

    if (isTypeof(this._startCallback, 'Function')) {

      this._startCallback.call(this)
    }

    this._update()

    return this
  },

  pause: function () {

    if (this._state !== STATE.RUNNING) {
      return
    }

    this._state = STATE.PAUSED
    const nowTime = Date.now()
    this._differenceTime = nowTime - this._startTime

    return this
  },

  resume: function () {

    if (this._state !== STATE.PAUSED) {
      return
    }

    this._state = STATE.RUNNING
    const nowTime = Date.now()
    this._startTime = nowTime - this._differenceTime
    this._update()

    return this
  },

  chain: function (animate) {

    if (!animate || !(animate instanceof Animate)) {
      return
    }

    this._chainInstances.push(animate)

    return this
  },

  onUpdate: function (callback) {

    if (isTypeof(callback, 'Function')) {
      this._updateCallback = callback
    }

    return this
  },

  onStart: function (callback) {

    if (isTypeof(callback, 'Function')) {
      this._startCallback = callback
    }

    return this
  },

  onEnd: function (callback) {

    if (isTypeof(callback, 'Function')) {
      this._endCallback = callback
    }

    return this
  },

  _update: function () {

    const nowTime = Date.now()

    if (this._state !== STATE.RUNNING) {

      return
    }
    
    if (this._startTime > nowTime) {
      
      requestAnimationFrame(this._update.bind(this))
      return
    }

    // get rate
    let rate = 1
    if (this._duration !== 0) {
      
      rate = (nowTime - this._startTime) / (this._duration * 1000)
      rate = rate > 1 ? 1 : rate
    }

    // update
    const value = this._updateValueFunc(rate)

    if (isTypeof(this._updateCallback, 'Function')) {

      this._updateCallback.call(this, value, this._from, this._to)
    }

    // end
    if (rate >= 1) {

      if (this._reverse) {

        if (!this._reversed) {

          this._state = STATE.PENDDING
          this._reverseValue()
          this.start()

          return
        } 
        this._reverseValue()
      }

      if (this._repeatCount > 0) {

        this._repeatCount--
        this._state = STATE.PENDDING
        this.start()

        return
      }

      if (this._chainInstances.length) {
        this._state = STATE.PENDDING
        this._chainInstances.shift().start()

        return
      }

      this._state = STATE.END

      if (this._repeat > 0) {
        this._repeatCount = this._repeat
      }
      
      if (isTypeof(this._endCallback, 'Function')) {

        this._endCallback.call(this)
      }
    }

    requestAnimationFrame(this._update.bind(this))
  },

  _updateValueFactory: function () {

    if (
      (isTypeof(this._from, 'Number') || isTypeof(this._from, 'String')) && 
      (isTypeof(this._to, 'Number') || isTypeof(this._to, 'String'))
    ) {

      return this._updateValueSimple

    } else if (isTypeof(this._from, 'Object') && isTypeof(this._to, 'Object')) {

      return this._updateValueObject
    } else {

      throw new Error('数据格式不正确')
    }
  },

  _updateValueObject: function (rate) {

    const to = this._to
    const from = this._from
    const easingValue = this._easingFunc(rate)

    let value = {}

    for (let key in to) {

      if (isTypeof(to[key], 'Number') || isTypeof(to[key], 'String')) {

        if (from.hasOwnProperty(key)) {

          value[key] = easingValue * (to[key] - from[key]) + from[key]
        }
      }
    }

    return value
  },

  _updateValueSimple: function (rate) {

    return this._easingFunc(rate) * (this._to - this._from) + this._from
  },

  _normalize: function () {

    this._from = this._normalizeValue(this._from)
    this._to = this._normalizeValue(this._to)
    this._easingFunc = this._normalizeEasing()
    this._duration = parseFloat(this._duration)

    if (Number.isNaN(this._duration)) {
      this._duration = 0
    }
  },

  _normalizeEasing: function () {

    let easingFunc = Easing.Linear.None

    try {
      const easingArgs = this._easing.split('.')
      easingFunc = Easing[easingArgs[0]][easingArgs[1]]
    } catch (e) {
      console.log(e)
    }

    if (!isTypeof(easingFunc, 'Function')) {
      easingFunc = Easing.Linear.None
    }

    return easingFunc
  },

  _reverseValue: function () {
    const tmp = this._from
    this._from = this._to
    this._to = tmp
    this._reversed = !this._reversed
  },

  _normalizeValue: function (value) {

    let res

    if (isTypeof(value, 'Number') || isTypeof(value, 'String')) {

      res = parseFloat(value)

      if (Number.isNaN(value)) {
        
        res = 0        
      }
      
    } else if (isTypeof(value, 'Object')) {

      res = {}

      for (let key in value) {

        res[key] = this._normalizeValue(value[key])
      }
    }
    
    return res
  }
}



                          