// adapted from: https://github.com/TONEnoTONE/Tone.js/blob/master/Tone/effect/Freeverb.js

var combFilterTunings = [1557 / 44100, 1617 / 44100, 1491 / 44100, 1422 / 44100, 1277 / 44100, 1356 / 44100, 1188 / 44100, 1116 / 44100]
var allpassFilterFrequencies = [225, 556, 441, 341]

var LowpassCombFilter = require('./lib/lowpass-comb-filter')

module.exports = Freeverb

function Freeverb (audioContext) {
  var node = audioContext.createGain()
  node.channelCountMode = 'explicit'
  node.channelCount = 2

  var output = audioContext.createGain()
  var merger = audioContext.createChannelMerger(2)
  var splitter = audioContext.createChannelSplitter(2)
  var highpass = audioContext.createBiquadFilter()
  highpass.type = 'highpass'
  highpass.frequency.value = 200

  var wet = audioContext.createGain()
  var dry = audioContext.createGain()

  node.connect(dry)
  node.connect(wet)
  wet.connect(splitter)
  merger.connect(highpass)
  highpass.connect(output)
  dry.connect(output)

  var combFilters = []
  var allpassFiltersL = []
  var allpassFiltersR = []
  var roomSize = 0.8
  var dampening = 3000

  // make the allpass filters on the right
  for (var l = 0; l < allpassFilterFrequencies.length; l++) {
    var allpassL = audioContext.createBiquadFilter()
    allpassL.type = 'allpass'
    allpassL.frequency.value = allpassFilterFrequencies[l]
    allpassFiltersL.push(allpassL)

    if (allpassFiltersL[l - 1]) {
      allpassFiltersL[l - 1].connect(allpassL)
    }
  }

  // make the allpass filters on the left
  for (var r = 0; r < allpassFilterFrequencies.length; r++) {
    var allpassR = audioContext.createBiquadFilter()
    allpassR.type = 'allpass'
    allpassR.frequency.value = allpassFilterFrequencies[r]
    allpassFiltersR.push(allpassR)

    if (allpassFiltersR[r - 1]) {
      allpassFiltersR[r - 1].connect(allpassR)
    }
  }

  allpassFiltersL[allpassFiltersL.length - 1].connect(merger, 0, 0)
  allpassFiltersR[allpassFiltersR.length - 1].connect(merger, 0, 1)

  // make the comb filters
  for (var c = 0; c < combFilterTunings.length; c++) {
    var lfpf = LowpassCombFilter(audioContext)
    lfpf.delayTime.value = combFilterTunings[c]
    if (c < combFilterTunings.length / 2) {
      splitter.connect(lfpf, 0)
      lfpf.connect(allpassFiltersL[0])
    } else {
      splitter.connect(lfpf, 1)
      lfpf.connect(allpassFiltersR[0])
    }
    combFilters.push(lfpf)
  }

  Object.defineProperties(node, {
    roomSize: {
      get: function () {
        return roomSize
      },
      set: function (value) {
        roomSize = value
        refreshFilters()
      }
    },
    dampening: {
      get: function () {
        return dampening
      },

      set: function (value) {
        dampening = value
        refreshFilters()
      }
    }
  })

  refreshFilters()

  node.connect = output.connect.bind(output)
  node.wet = wet.gain
  node.dry = dry.gain

  // expose combFilters for direct automation
  node.combFilters = combFilters

  return node

  // scoped

  function refreshFilters () {
    for (var i = 0; i < combFilters.length; i++) {
      combFilters[i].resonance.value = roomSize
      combFilters[i].dampening.value = dampening
    }
  }
}
