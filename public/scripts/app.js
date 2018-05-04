
// Older browsers might not implement mediaDevices at all, so we set an empty object first
if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}


// Some browsers partially implement mediaDevices. We can't just assign an object
// with getUserMedia as it would overwrite existing properties.
// Here, we will just add the getUserMedia property if it's missing.
if (navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = function (constraints) {

    // First get ahold of the legacy getUserMedia, if present
    var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    // Some browsers just don't implement it - return a rejected promise with an error
    // to keep a consistent interface
    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }

    // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
    return new Promise(function (resolve, reject) {
      getUserMedia.call(navigator, constraints, resolve, reject);
    });
  }
}

const audioEl = document.querySelector('audio')
const canvas = document.querySelector('.visualizer');
const canvasCtx = canvas.getContext("2d");
const intendedWidth = document.querySelector('.wrapper').clientWidth;
const visualSelect = document.getElementById("visual");
const voiceSelect = document.getElementById("voice");
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

var analyser = audioCtx.createAnalyser();
var distortion = audioCtx.createWaveShaper();
var gainNode = audioCtx.createGain();
var biquadFilter = audioCtx.createBiquadFilter();
var convolver = audioCtx.createConvolver();
var delayNode = audioCtx.createDelay(100),
  feedbackNode = audioCtx.createGain(),
  bypassNode = audioCtx.createGain(),
  masterNode = audioCtx.createGain()
var drawVisual;
var source
var started = false

canvas.setAttribute('width', intendedWidth);
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0.85;

function init() {
  started = true
  if (navigator.mediaDevices.getUserMedia) {
    console.log('getUserMedia supported.');
    var constraints = { audio: true }
    navigator.mediaDevices.getUserMedia(constraints)
      .then(
        function (stream) {
          source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);
          analyser.connect(biquadFilter);
          biquadFilter.connect(gainNode); 

          visualize();
        //  voiceChange()
          audioEl.srcObject = source.mediaStream
        })
      .catch(function (err) { console.log('The following gUM error occured: ' + err); })
  } else {
    console.log('getUserMedia not supported on your browser!');
  }
}

function voiceChange(mediaStream) {
  var voiceSetting = voiceSelect.value;
  biquadFilter.gain.setTargetAtTime(0, audioCtx.currentTime, 0)
  console.log(voiceSetting);
  if (voiceSetting == "distortion") {
    distortionVoice()
    return
  }
  if (voiceSetting == "biquad") {
    baseVoice()
    return
  }
  if (voiceSetting == "specialVoice") {
    specialVoice()
    return
  }
  if (voiceSetting == "specialVoice2") {
    specialVoice2()
    return
  }
  if (voiceSetting == "specialVoice3") {
    specialVoice3()
    return
  }
  if (voiceSetting == "delayVoice") {
    delayVoice()
    return
  }
  if (voiceSetting == "delayVoice2") {
    delayVoice2()
    return
  }
  if (voiceSetting == "delayVoice3") {
    delayVoice2()
    return
  }
  if (voiceSetting == "delayVoice4") {
    delayVoice4()
    return
  }
  if (voiceSetting == "off") {
    console.log("Voice settings turned off");
    return
  }
}

function baseVoice() {
  analyser.connect(biquadFilter);
  biquadFilter.connect(gainNode);  
  biquadFilter.type = 'lowshelf'// '' // 'notch' // /'lowpass''highshelf' 'bandpass' "lowshelf";
  biquadFilter.frequency.setTargetAtTime(1000, audioCtx.currentTime, 0)
  biquadFilter.gain.setTargetAtTime(25, audioCtx.currentTime, 0)
  gainNode.connect(audioCtx.destination);
}

function distortionVoice() {
  analyser.connect(distortion);
  distortion.connect(gainNode);
  
  distortion.oversample = '4x';
  distortion.curve = makeDistortionCurve(400);
  biquadFilter.gain.setTargetAtTime(0, audioCtx.currentTime, 0)
  biquadFilter.type = 'allpass'   // 'peaking' "lowshelf";
  biquadFilter.frequency.setTargetAtTime(1050, audioCtx.currentTime, 0)
  biquadFilter.gain.setTargetAtTime(25, audioCtx.currentTime, 0)
  gainNode.connect(audioCtx.destination);
}

function specialVoice() {
  analyser.connect(distortion);
  distortion.connect(biquadFilter);
  biquadFilter.connect(gainNode);
 
  distortion.oversample = '4x';
  distortion.curve = makeDistortionCurve(400);
  biquadFilter.gain.setTargetAtTime(0, audioCtx.currentTime, 0)
  biquadFilter.type = 'notch' //"lowshelf";
  biquadFilter.frequency.setTargetAtTime(1050, audioCtx.currentTime, 0)
  biquadFilter.gain.setTargetAtTime(25, audioCtx.currentTime, 0)
  gainNode.connect(audioCtx.destination);
}

function specialVoice2() {
  analyser.connect(distortion);
  distortion.connect(biquadFilter);
  biquadFilter.connect(gainNode);
  
  distortion.oversample = '4x';
  distortion.curve = makeDistortionCurve(400);
  biquadFilter.gain.setTargetAtTime(0, audioCtx.currentTime, 0)
  biquadFilter.type = 'highshelf' //"lowshelf";
  biquadFilter.frequency.setTargetAtTime(1050, audioCtx.currentTime, 0)
  biquadFilter.gain.setTargetAtTime(25, audioCtx.currentTime, 0)

  gainNode.connect(audioCtx.destination);
}

function specialVoice3() {
  analyser.connect(distortion);
  distortion.connect(gainNode);
  //biquadFilter.connect(gainNode);
 
  distortion.oversample = '4x';
  distortion.curve = makeDistortionCurve(400);
  biquadFilter.gain.setTargetAtTime(0, audioCtx.currentTime, 0)
  biquadFilter.type = 'bandpass' //"lowshelf";
  biquadFilter.frequency.setTargetAtTime(1050, audioCtx.currentTime, 0)
  biquadFilter.gain.setTargetAtTime(25, audioCtx.currentTime, 0)

  gainNode.connect(audioCtx.destination);
}


function delayVoice() {
  // delayNode.delayTime.value = 1;
  delayNode.delayTime.setTargetAtTime(1, audioCtx.currentTime, 0)
  source.connect(delayNode);

  source.connect(audioCtx.destination);
  delayNode.connect(audioCtx.destination);
}

function delayVoice2() {
  delayNode.delayTime.setTargetAtTime(1, audioCtx.currentTime, 0)
  feedbackNode.gain.setTargetAtTime(0.5, audioCtx.currentTime, 0)
  bypassNode.gain.setTargetAtTime(0.5, audioCtx.currentTime, 0)
  source.connect(delayNode);
  delayNode.connect(feedbackNode);
  feedbackNode.connect(delayNode);
  delayNode.connect(bypassNode);
  bypassNode.connect(masterNode);
  source.connect(masterNode);
  
  masterNode.connect(audioCtx.destination);
}

function delayVoice3() {
  delayNode.delayTime.setTargetAtTime(1, audioCtx.currentTime, 0)
  feedbackNode.gain.setTargetAtTime(0.5, audioCtx.currentTime, 0)
  delayNode.connect(feedbackNode);
  feedbackNode.connect(delayNode);
  delayNode.connect(masterNode);
  source.connect(masterNode);
  masterNode.connect(audioCtx.destination);
}

function delayVoice4() {
  delayNode.delayTime.setTargetAtTime(1, audioCtx.currentTime, 0)
  feedbackNode.gain.setTargetAtTime(0.5, audioCtx.currentTime, 0)
  biquadFilter.frequency.setTargetAtTime(1000, audioCtx.currentTime, 0)

  delayNode.connect(feedbackNode);
  feedbackNode.connect(biquadFilter);
  biquadFilter.connect(delayNode);

  source.connect(delayNode);

  source.connect(audioCtx.destination);
  delayNode.connect(audioCtx.destination);
}

function release() {
  if (started === true) {
    delayNode.delayTime.value = 0;
    feedbackNode.gain.value = 0;
    bypassNode.gain.value = 0;
    distortion.oversample = '0x';
    distortion.curve = makeDistortionCurve(0);
    biquadFilter.frequency.value = 0;
    biquadFilter.frequency.setTargetAtTime(0, audioCtx.currentTime, 0)
    biquadFilter.gain.setTargetAtTime(0, audioCtx.currentTime, 0)
    console.log("turned off");
    started = false
  }
}

function voiceMute() {
  if (mute.id === "") {
    gainNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0)
    mute.id = "activated";
    mute.innerHTML = "Unmute";
  } else {
    gainNode.gain.setTargetAtTime(1, audioCtx.currentTime, 0)
    mute.id = "";
    mute.innerHTML = "Mute";
  }
}
// distortion curve for the waveshaper, thanks to Kevin Ennis
// http://stackoverflow.com/questions/22312841/waveshaper-node-in-webaudio-how-to-emulate-distortion

function makeDistortionCurve(amount) {
  var k = typeof amount === 'number' ? amount : 50,
    n_samples = 44100,
    curve = new Float32Array(n_samples),
    deg = Math.PI / 120,
    i = 0,
    x;
  for (; i < n_samples; ++i) {
    x = i * 2 / n_samples - 1;
    curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
  }
  return curve;
};

function visualize() {
  WIDTH = canvas.width;
  HEIGHT = canvas.height;
  var stdSize = 50
  var stdSize2 = (WIDTH / 3) + stdSize
  var stdSize3 = (WIDTH / 1.5) + stdSize
  var visualSetting = visualSelect.value;
  console.log(visualSetting);

  if (visualSetting == "sinewave") {
    analyser.fftSize = 2048;
    var bufferLength = analyser.fftSize;
    console.log(bufferLength);
    var dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    var draw = function () {

      drawVisual = requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);
      //   analyser.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

      canvasCtx.beginPath();

      var sliceWidth = WIDTH * 1.0 / bufferLength;
      var x = 0;

      for (var i = 0; i < bufferLength; i++) {

        var v = dataArray[i] / 128.0;
        var y = v * HEIGHT / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };

    draw();

  } else if (visualSetting == "bublewave") {
    analyser.fftSize = 256;
    var bufferLengthAlt = analyser.frequencyBinCount;
    console.log(bufferLengthAlt);
    var dataArrayBubl = new Uint8Array(bufferLengthAlt);

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    var drawBubl = function () {
      drawVisual = requestAnimationFrame(drawBubl);
      //  analyser.getByteTimeDomainData(dataArrayBubl);
      analyser.getByteFrequencyData(dataArrayBubl);

      canvasCtx.fillStyle = 'rgb(0, 0, 0)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      canvasCtx.beginPath();

      var barWidth = (WIDTH / dataArrayBubl) * 1.5;
      var barHeight;

      cicles(canvasCtx, dataArrayBubl, bufferLengthAlt, stdSize, barHeight, barWidth, HEIGHT, true, 0, 0)
      cicles(canvasCtx, dataArrayBubl, bufferLengthAlt, stdSize2, barHeight, barWidth, HEIGHT, 0, true, 0)
      cicles(canvasCtx, dataArrayBubl, bufferLengthAlt, stdSize3, barHeight, barWidth, HEIGHT, 0, 0, true)
    }

    drawBubl();

  } else if (visualSetting == "frequencybars") {
    analyser.fftSize = 256;
    var bufferLengthAlt = analyser.frequencyBinCount;
    console.log(bufferLengthAlt);
    var dataArrayAlt = new Uint8Array(bufferLengthAlt);

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    var drawAlt = function () {
      drawVisual = requestAnimationFrame(drawAlt);
      //  analyser.getByteTimeDomainData(dataArrayAlt);
      analyser.getByteFrequencyData(dataArrayAlt);

      canvasCtx.fillStyle = 'rgb(0, 0, 0)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      var barWidth = (WIDTH / bufferLengthAlt) * 1.5;
      var barHeight;


      bars(canvasCtx, dataArrayAlt, bufferLengthAlt, barWidth, barHeight, HEIGHT)
     cicles(canvasCtx, dataArrayAlt, bufferLengthAlt, stdSize2, barHeight, barWidth, HEIGHT, 0, 0, 0)
      //cicles(canvasCtx, dataArrayBubl, bufferLengthAlt, stdSize2, barHeight, barWidth, HEIGHT, true, 0, 0)
      //cicles(canvasCtx, dataArrayAlt, bufferLengthAlt, stdSize3, barHeight, barWidth, HEIGHT)
    };

    drawAlt();

  } else if (visualSetting == "off") {
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    canvasCtx.fillStyle = "red";
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
  }

}
init();

function bars(canvasCtx, dataArrayAlt, bufferLengthAlt, barWidth, barHeight, HEIGHT) {
  var x = 0;
  for (var i = 0; i < bufferLengthAlt; i++) {
    canvasCtx.beginPath();
    barHeight = dataArrayAlt[i];
    canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
    canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);
    canvasCtx.stroke()
    x += barWidth + 1;
  }
}

function circles(canvasCtx, dataArrayBubl, bufferLengthAlt, stdsize, barHeight, barWidth, HEIGHT, fixed1, fixed2, fixed3) {
  var x = stdsize;
  for (var i = 0; i < bufferLengthAlt; i++) {
    if (fixed1 !== true) {
      x = x + barHeight || barHeight + stdsize
    } else if (fixed1 === 0) {
      x = stdsize
    }
    barHeight = dataArrayBubl[i];
    canvasCtx.beginPath();
    canvasCtx.strokeStyle = `rgb( ${barHeight + HEIGHT}, 100, ${barHeight})`
    canvasCtx.arc(x, 50, (barHeight / 3.5), 0, 2 * Math.PI);
    canvasCtx.stroke()
    x += barWidth + 5000;
  }

  for (var i = 0; i < bufferLengthAlt; i++) {  
    if (fixed2 !== true) {
      x = x + barHeight || barHeight + stdsize
    } else if (fixed1 === 0) {
      x = stdsize
    }
    barHeight = dataArrayBubl[i];
    canvasCtx.beginPath();
    canvasCtx.strokeStyle = `rgb(100, ${barHeight},  ${barHeight + HEIGHT}, ${HEIGHT + 100})`
    canvasCtx.arc(x, 50, (barHeight / 5), 0, 2 * Math.PI);
    canvasCtx.stroke()
    x += barWidth + 5000;
  }

  for (var i = 0; i < bufferLengthAlt; i++) {
    if (fixed3 !== true) {
      x = barHeight + stdsize || x + barHeight
    } else if (fixed1 === 0) {
      x = stdsize
    }
    barHeight = dataArrayBubl[i];
    canvasCtx.beginPath();
    canvasCtx.strokeStyle = `rgb(${barHeight + 50},  ${HEIGHT + 100}, ${barHeight})`
    canvasCtx.arc(x, 50, (barHeight / 8), 0, 2 * Math.PI);
    canvasCtx.stroke()
    x += barWidth + 5000;
  }
}


/**
 * 
 *   var x = stdsize;
  for (var i = 0; i < bufferLengthAlt; i++) {
    barHeight = dataArrayBubl[i];
    canvasCtx.beginPath();
    canvasCtx.strokeStyle = `rgb( ${barHeight + HEIGHT}, 100, ${barHeight})`
    if (fixed1 !== true) {
      x = x + barHeight + stdsize || barHeight + stdsize
    } else if (fixed1 === 0){
      x = stdsize
    }
    canvasCtx.arc(x, 50, (barHeight / 3.5), 0, 2 * Math.PI);
    canvasCtx.stroke()
    x += barWidth + 5000;
  }

  for (var i = 0; i < bufferLengthAlt; i++) {
    barHeight = dataArrayBubl[i];
    canvasCtx.beginPath();
    canvasCtx.strokeStyle = `rgb(100, ${barHeight},  ${barHeight + HEIGHT}, ${HEIGHT + 100})`
    if (fixed2 !== true) {
      x = x + barHeight + stdsize || barHeight + stdsize
    } else if (fixed2 === 0){
      x = stdsize
    }

    canvasCtx.arc(x, 50, (barHeight / 5), 0, 2 * Math.PI);
    canvasCtx.stroke()
    x += barWidth + 5000;
  }

  for (var i = 0; i < bufferLengthAlt; i++) {
    barHeight = dataArrayBubl[i];
    canvasCtx.beginPath();
    canvasCtx.strokeStyle = `rgb(${barHeight + 50},  ${HEIGHT + 100}, ${barHeight})`
    if (fixed3 !== true) {
      x = x + barHeight + stdsize || x + barHeight
    } else if (fixed3 === 0){
      x = stdsize
    }
    canvasCtx.arc(x, 50, (barHeight / 8), 0, 2 * Math.PI);
    canvasCtx.stroke()
    x += barWidth + 5000;
  }
 * 
 * 
 * 
 */