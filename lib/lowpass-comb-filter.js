// adapted from: https://github.com/TONEnoTONE/Tone.js/blob/master/Tone/component/LowpassCombFilter.js

module.exports = LowpassCombFilter

function LowpassCombFilter(context){

  var node = context.createDelay(1)

  var output = this.output = context.createBiquadFilter()
  output.Q.value = 0
  output.type = "lowpass"
  node.dampening = output.frequency

  var feedback = context.createGain()
  node.resonance = feedback.gain

  node.connect(output)
  output.connect(feedback)
  feedback.connect(node)

  node.dampening.value = 3000
  node.delayTime.value = 0.1
  node.resonance.value = 0.5

  return node
}