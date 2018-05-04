const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

import('./wetagents').then(Class=>{
    const agent = new Class.WetAgents()
})

const wrapper = document.querySelector('.wrapper');
const controlsRange = document.querySelectorAll('input[type=range]');
const controlsNumber = document.querySelectorAll('input[type=number]');
const biquadSelect = document.querySelector('#biquad');
const mute = document.querySelector('.mute');

visualSelect.onchange = function () {
    window.cancelAnimationFrame(drawVisual);
    visualize();
};

function createGain(type){    
    agen.gain()
    if (type == 'master'){
        wrapper.innerHTML = `<article class="wrapperArt">
        <label for="gain">gain</label>
        <input type="range" id="gain" name="gain" min="0" max="1" value="0.0" step="0.05"></input>
        <input type="number" name="gain" min="0" max="1" value="0.0" step="0.05"></input>
      </article>
      <article>`
    }

}



mute.onclick = voiceMute;
//gain
controlsRange[0].oninput = function (event) {
    gainNode.gain.setTargetAtTime(this.value, audioCtx.currentTime, 0)
    console.log(this.value)
    controlsNumber[0].value = this.value
}
controlsNumber[0].oninput = function (event) {
    gainNode.gain.setTargetAtTime(this.value, audioCtx.currentTime, 0)
    console.log(this.value)
    controlsRange[0].value = this.value
}
//delay
controlsRange[1].oninput = function (event) {
    delayNode.delayTime.setTargetAtTime(this.value, audioCtx.currentTime, 0)
    console.log(this.value)
    controlsNumber[1].value = this.value
}
controlsNumber[1].oninput = function (event) {
    delayNode.delayTime.setTargetAtTime(this.value, audioCtx.currentTime, 0)
    console.log(this.value)
    controlsRange[1].value = this.value
}
// feedback
controlsRange[2].oninput = function (event) {
    feedbackNode.gain.setTargetAtTime(this.value, audioCtx.currentTime, 0)
    controlsNumber[2].value = this.value
}
controlsNumber[2].oninput = function (event) {
    feedbackNode.gain.setTargetAtTime(this.value, audioCtx.currentTime, 0)
    controlsRange[2].value = this.value
}
//bypass
controlsRange[3].oninput = function (event) {
    bypassNode.gain.setTargetAtTime(this.value, audioCtx.currentTime, 0)
    controlsNumber[3].value = this.value
}
controlsNumber[3].oninput = function (event) {
    bypassNode.gain.setTargetAtTime(this.value, audioCtx.currentTime, 0)
    controlsRange[3].value = this.value
}
// biquad filter
controlsRange[4].oninput = function (event) {
    biquadFilter.gain.setTargetAtTime(this.value, audioCtx.currentTime, 0)
    controlsNumber[4].value = this.value
}
controlsNumber[4].oninput = function (event) {
    biquadFilter.gain.setTargetAtTime(this.value, audioCtx.currentTime, 0)
    controlsRange[4].value = this.value
}

controlsRange[5].oninput = function (event) {
    biquadFilter.frequency.setTargetAtTime(this.value, audioCtx.currentTime, 0)
    controlsNumber[5].value = this.value
}
controlsNumber[5].oninput = function (event) {
    biquadFilter.frequency.setTargetAtTime(this.value, audioCtx.currentTime, 0)
    controlsRange[5].value = this.value
}

biquadSelect.onchange = function (evt) {
    biquadFilter.type = this.value
    console.log(biquadFilter.type)
};

//waveShaper or distortion
controlsRange[6].oninput = function (event) {
    distortion.oversample = this.value;
    controlsNumber[6].value = this.value
}
controlsNumber[6].oninput = function (event) {
    distortion.oversample = this.value;
    controlsRange[6].value = this.value
}

controlsRange[7].oninput = function (event) {
    distortion.curve = makeDistortionCurve(this.value)
    controlsNumber[7].value = this.value
}
controlsNumber[7].oninput = function (event) {
    distortion.curve = makeDistortionCurve(this.value)
    controlsRange[7].value = this.value
}