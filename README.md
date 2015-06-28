freeverb
===

A Web Audio implementation of [freeverb](https://ccrma.stanford.edu/~jos/pasp/Freeverb.html) (Schroeder Reverberator).

Extracted from [TONE.js](https://github.com/TONEnoTONE/Tone.js) by [Yotam Mann](https://github.com/tambien).

## [Install via npm](https://www.npmjs.com/package/freeverb)

```bash
$ npm install freeverb
```

## API

```
var Freeverb = require('freeverb')
```

### `var reverb = Freeverb(audioContext)`

Returns an instance of [AudioNode](https://developer.mozilla.org/en-US/docs/Web/API/AudioNode)

### `reverb.roomSize` (attribute)

A value between `0` and `1`.

### `reverb.dampening` (attribute)

A value between `0` and `20000` (in Hertz).

### `reverb.dry` ([AudioParam](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam))

### `reverb.wet` ([AudioParam](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam))

### `reverb.connect(target)`

### `reverb.disconnect()`

## License

MIT

## Example

```js
var Freeverb = require('freeverb')

var audioContext = new AudioContext()
var osc = audioContext.createOscillator()

osc.type = 'sawtooth'
osc.start(audioContext.currentTime+0.1)
osc.stop(audioContext.currentTime+0.4)

var reverb = Freeverb(audioContext)
reverb.roomSize = 0.9
reverb.dampening = 3000
reverb.wet.value = 0.8
reverb.dry.value = 1

osc.connect(reverb)
reverb.connect(audioContext.destination)
```