/*
  Sick? Definitely!
*/

var isPlaying = false;
var audioContext;
var mooSound;
var gainNode;
var reverbNode;
var pannerNode;
var π = Math.PI;
var tick = 3/2*π;
var updateTime = 200;
var timeForOneRev = 30000;
// From 0 to 2π should take timeForOneRev ms
var increaseFactor = (π * 2) / (timeForOneRev / updateTime);

function updatePanValue() {
  if(isPlaying) {
    var panValue = Math.sin(tick);
    pannerNode.pan.value = panValue;

    var gainValue = (Math.cos(tick) / 2 + 0.5) * 0.9 + 0.1;
    gainNode.gain.value = gainValue;
  }
  tick += increaseFactor;
}

// http://stackoverflow.com/questions/21797299/convert-base64-string-to-arraybuffer
function base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var len = binaryString.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++)        {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

function initSound() {
  audioContext = new AudioContext();
  
  // soundData is defined in another Pen
  // It is an ogg file encoded as a Data URI
  // (MIME type plus base64 string).
  mooSound = new Audio(mooSoundDataUri);
  
  mooSound.crossOrigin = "anonymous";
  mooSound.loop = true;
  var source = audioContext.createMediaElementSource(mooSound);

  // The gain node lets us toggle sound on/off,
  // but we also use it to increase volume when
  // the object is near and decrease volume when
  // far away.
  gainNode = audioContext.createGain();
  gainNode.gain.value = 0;
  
  reverbNode = audioContext.createConvolver();
  // impulseResponse is defined in another Pen
  // It's a base64 encoded string.
  // Convert it to a binary array first
  var reverbSoundArrayBuffer = base64ToArrayBuffer(impulseResponse);
  audioContext.decodeAudioData(reverbSoundArrayBuffer, 
    function(buffer) {
      reverbNode.buffer = buffer;
    },
    function(e) {
      alert("Error when decoding audio data" + e.err);
    }
  );

  // Pans the sound left/right. Synced with the
  // object's screen position.
  pannerNode = audioContext.createStereoPanner();
  
  // Connect the audio chain together
  source.connect(gainNode);
  gainNode.connect(pannerNode);
  pannerNode.connect(reverbNode);
  reverbNode.connect(audioContext.destination);
  
  mooSound.play();
  var intervalId = setInterval(updatePanValue, updateTime);
}

function toggleSound(toggleButton) {
  isPlaying = !isPlaying;
  if(isPlaying) {
    toggleButton.innerHTML = "<h3>Stop sound!</h3>";
  } else {
    gainNode.gain.value = 0;
    toggleButton.innerHTML = "<h3>Start sound</h3>";    
  }
}

function random(max) {
  return Math.floor(Math.random() * max);
}

function addStar(type, zIndex) {
  var div = document.createElement("div");
  div.classList.add("star", type);
  div.style.top = random(window.innerHeight) + "px";
  div.style.zIndex = zIndex;
  document.body.appendChild(div);
}

function initGraphics(){
  for(var i = 0; i < 20; ++i) {
    var delay = i * 333;
    window.setTimeout(addStar, delay, "small", -200);
    window.setTimeout(addStar, delay + 333, "medium", -100);
    window.setTimeout(addStar, delay + 666, "big");
  }
}


initSound();
initGraphics();

