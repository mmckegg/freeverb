var Freeverb = require('./')

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