class WetAgents{constructor(audioContext){this.context=audioContext;this.contextNode={};this.sourceNode={};this.streamNode={};this.analyserNode={};this.drawVisual="";this.applicables={};this.appliesWith={}}inputStreamSource(done,sourceName,stream){try{if(this.streamNode[sourceName]===void 0&&this.sourceNode[sourceName]===void 0&&this.contextNode[sourceName]===void 0&&sourceName){if(0===stream){done(!1);return}this.sourceNode[sourceName]=this.context.createMediaStreamSource(stream);setTimeout(()=>{this.sourceNode[sourceName].onRemove=()=>{};done(!1,stream)},100)}else{done(sourceName+" already exists or no argumet value!!")}}catch(err){done(err)}}setElementSource(done,sourceName,mediaElement){try{if(this.streamNode[sourceName]===void 0&&this.sourceNode[sourceName]===void 0&&this.contextNode[sourceName]===void 0&&sourceName){this.sourceNode[sourceName]=this.context.createMediaElementSource(mediaElement);setTimeout(()=>{this.sourceNode[sourceName].onRemove=()=>{}},100);done(!1)}else{done(sourceName+" already exists or no argumet value!!")}}catch(err){done(err)}}setStreamDestination(done,streamName,contextNode){try{if(this.streamNode[streamName]===void 0&&streamName){this.streamNode[streamName]=this.context[contextNode]();done(!1,this.streamNode[streamName])}else{done(sourceName+" already exists or no argumet value!!")}}catch(err){done(err)}}analyser(done,nodename){try{if(!this.analyserNode[nodename]&&nodename){this.analyserNode[nodename]=this.context.createAnalyser();this.analyserNode[nodename].minDecibels=-90;this.analyserNode[nodename].maxDecibels=-10;this.analyserNode[nodename].smoothingTimeConstant=.85;setTimeout(()=>{this.analyserNode[nodename].onRemove={};done()},100)}else{done(nodename+" already exists or no argumet value!!")}}catch(err){done(err)}}gain(done,gainNode,destination){try{if(this.sourceNode[gainNode]===void 0&&this.contextNode[gainNode]===void 0&&gainNode){if(!0!==destination){this.contextNode[gainNode]=this.context.createGain();setTimeout(()=>{this.contextNode[gainNode].onRemove=()=>{};done()},100)}else{this.setStreamDestination((state,node)=>{done(state,node)},gainNode,"createGain")}}else{done()}}catch(err){done("gainNode error");throw new Error(err)}}waveShaper(done,waveName,overS,amount){try{if(this.sourceNode[waveName]===void 0&&this.contextNode[waveName]===void 0&&waveName&&overS&&amount){this.contextNode[waveName]=this.context.createWaveShaper();this.contextNode[waveName].oversample=`${overS}x`;this.contextNode[waveName].curve=this.makeDistortionCurve(parseInt(amount));setTimeout(()=>{this.contextNode[waveName].onRemove=()=>{};done()},100)}else{done("already exists")}}catch(err){done("waveShaper error");throw new Error(err)}}makeDistortionCurve(amount){var _MathPI=Math.PI,k="number"===typeof amount?amount:50,n_samples=44100,curve=new Float32Array(n_samples),i=0,x;for(;i<n_samples;++i){x=2*i/n_samples-1;curve[i]=20*((3+k)*x)*(_MathPI/120)/(_MathPI+k*Math.abs(x))}return curve}panner(done,pann){try{if(this.sourceNode[pann]===void 0&&this.contextNode[pann]===void 0&&pann){this.contextNode[pann]=this.context.createPanner();setTimeout(()=>{this.contextNode[pann].onRemove=()=>{};done(null)},100)}else{done("already exists")}}catch(err){done("panner error");throw new Error(err)}}delay(done,delay){console.log(delay);try{if(this.sourceNode[delay]===void 0&&this.contextNode[delay]===void 0&&delay){this.contextNode[delay]=this.context.createDelay(179);setTimeout(()=>{this.contextNode[delay].onRemove=()=>{};done(null)},100)}else{done("already exists")}}catch(err){done("panner error");throw new Error(err)}}compressor(done,compressor){try{if(this.sourceNode[compressor]===void 0&&this.contextNode[compressor]===void 0&&compressor){this.contextNode[compressor]=this.context.createDynamicsCompressor();setTimeout(()=>{this.contextNode[compressor].onRemove=()=>{};done(null,this.contextNode[compressor])},100)}else{done("already exists",void 0)}}catch(err){done("compressor error",void 0);throw new Error(err)}}listner(listen,forwardX,forwardY,forwardZ,upX,upY,upZ){this.contextNode[listen].forwardX.value=forwardX||0;this.contextNode[listen]=this.context.listener;this.contextNode[listen].forwardY.value=forwardY||0;this.contextNode[listen].forwardZ.value=forwardZ||-1;this.contextNode[listen].upX.value=upX||0;this.contextNode[listen].upY.value=upY||1;this.contextNode[listen].upZ.value=upZ||0}connectAgents(done,agent1,agent2,connect){try{if(!0==connect){agent1.connect(agent2);agent2.connected=agent1}else{agent1.disconnect(agent2);agent2.connected=!1}done()}catch(err){done(err)}}setAgentParamTo(done,agent,param1,param2,to,to1,to2,func){try{if(!0===func){agent[param1][param2](to,this.context.currentTime+to1,to2);console.log(param1,param2,to,to1,to2,func);done(null)}else{console.log(param1,param2,to,to1,to2,func);if("function"!==typeof agent[param1]){if(null!==param2){agent[param2]="curve"===param2?this.makeDistortionCurve(parseInt(to1)):to1}else{agent[param1]=to}}else{agent[param1](to,to1,to2)}done(null)}}catch(err){done(err)}}removeAgents(done,context,agent){this[context][agent].onRemove();delete this[context][agent];done()}setApplicable(done,obj){if(obj.elemTitle!==void 0){if(!this.applicables[obj.elemTitle]){this.applicables[obj.elemTitle]=obj}else{this.applicables[obj.elemTitle].arr.push(obj.arr[0])}}done()}setAppliesWith(done,obj){if(!this.appliesWith[obj.name]){this.appliesWith[obj.name]=Array(obj)}else{let arr=this.appliesWith[obj.name];arr.push(obj);this.appliesWith[obj.name]=arr}done()}revoveAppliesWith(done,obj){let arr1=[];for(let i=0;i<this.appliesWith[obj.name].length;i++){if(this.appliesWith[obj.name][i].titleFuncion!==obj.titleFuncion){arr1.push(this.appliesWith[obj.name][i])}}this.appliesWith[obj.name]=arr1;done()}revoveElemTitle(done,elemTitle){if(this.applicables[elemTitle]){delete this.appliesWith[elemTitle];delete this.applicables[elemTitle]}done()}revoveApplicables(done,elemTitle,titleFunction){let arr2=[];for(let j=0;j<this.applicables[elemTitle].arr.length;j++){if(this.applicables[elemTitle].arr[j].titleFuncion!==titleFunction){arr2.push(this.applicables[elemTitle].arr[j])}}this.applicables[elemTitle].arr=arr2;done()}revoveFunction(done,elemTitle,titleFunction){if(this.appliesWith[elemTitle]){this.revoveAppliesWith(()=>{},elemTitle,titleFunction)}this.revoveApplicables(()=>{},elemTitle,titleFunction);done()}sineWave(done,canvasCtx,width,height,nodename){try{if(this.analyserNode[nodename]&&nodename){const WIDTH=width,HEIGHT=height;this.analyserNode[nodename].fftSize=2048;var bufferLength=this.analyserNode[nodename].fftSize,dataArray=new Uint8Array(bufferLength);canvasCtx.clearRect(0,0,WIDTH,HEIGHT);var draw=()=>{this.drawVisual=requestAnimationFrame(draw.bind(this));this.analyserNode[nodename].getByteTimeDomainData(dataArray);canvasCtx.fillStyle="rgb(200, 200, 200)";canvasCtx.fillRect(0,0,WIDTH,HEIGHT);canvasCtx.lineWidth=2;canvasCtx.strokeStyle="rgb(0, 0, 0)";canvasCtx.beginPath();for(var x=0,i=0;i<bufferLength;i++){var v=dataArray[i]/128,y=v*HEIGHT/2;if(0===i){canvasCtx.moveTo(x,y)}else{canvasCtx.lineTo(x,y)}x+=1*WIDTH/bufferLength}canvasCtx.lineTo(WIDTH,HEIGHT/2);canvasCtx.stroke()};done();draw()}else{done(nodename+` doesn't exist or no argumet value!!`)}}catch(err){done(err)}}bubbleBurst(done,canvasCtx,width,height,nodename){try{if(this.analyserNode[nodename]&&nodename){const WIDTH=width,HEIGHT=height;var stdSize=50,stdSize2=WIDTH/3+stdSize,stdSize3=WIDTH/1.5+stdSize;this.analyserNode[nodename].fftSize=256;var bufferLengthAlt=this.analyserNode[nodename].frequencyBinCount,dataArrayBubl=new Uint8Array(bufferLengthAlt);canvasCtx.clearRect(0,0,WIDTH,HEIGHT);var drawBubl=()=>{this.drawVisual=requestAnimationFrame(drawBubl);this.analyserNode[nodename].getByteFrequencyData(dataArrayBubl);canvasCtx.fillStyle="rgb(0, 0, 0)";canvasCtx.fillRect(0,0,WIDTH,HEIGHT);canvasCtx.beginPath();var barWidth=1.5*(WIDTH/dataArrayBubl),barHeight;this.circles(canvasCtx,dataArrayBubl,bufferLengthAlt,stdSize+25,barHeight,barWidth,HEIGHT,!0,0,0);this.circles(canvasCtx,dataArrayBubl,bufferLengthAlt,stdSize2-25,barHeight,barWidth,HEIGHT,0,!0,0);this.circles(canvasCtx,dataArrayBubl,bufferLengthAlt,stdSize3-80,barHeight,barWidth,HEIGHT,0,0,!0)};done();drawBubl()}else{done(nodename+` doesn't exist or no argumet value!!`)}}catch(err){done(err)}}circles(canvasCtx,dataArrayBubl,bufferLengthAlt,stdsize,barHeight,barWidth,HEIGHT,fixed1,fixed2,fixed3){for(var _MathPI2=Math.PI,x=stdsize,i=0;i<bufferLengthAlt;i++){if(!0!==fixed1){x=x+barHeight||barHeight+stdsize}else if(0===fixed1){x=stdsize}barHeight=dataArrayBubl[i];canvasCtx.beginPath();canvasCtx.strokeStyle=`rgb( ${barHeight+HEIGHT}, 100, ${barHeight})`;canvasCtx.arc(x,70,barHeight/3.5,0,2*_MathPI2);canvasCtx.stroke();x+=barWidth+5e3}for(var i=0;i<bufferLengthAlt;i++){if(!0!==fixed2){x=x+barHeight||barHeight+stdsize}else if(0===fixed1){x=stdsize}barHeight=dataArrayBubl[i];canvasCtx.beginPath();canvasCtx.strokeStyle=`rgb(100, ${barHeight},  ${barHeight+HEIGHT}, ${HEIGHT+100})`;canvasCtx.arc(x,70,barHeight/5,0,2*_MathPI2);canvasCtx.stroke();x+=barWidth+5e3}for(var i=0;i<bufferLengthAlt;i++){if(!0!==fixed3){x=barHeight+stdsize||x+barHeight}else if(0===fixed1){x=stdsize}barHeight=dataArrayBubl[i];canvasCtx.beginPath();canvasCtx.strokeStyle=`rgb(${barHeight+50},  ${HEIGHT+100}, ${barHeight})`;canvasCtx.arc(x,70,barHeight/8,0,2*_MathPI2);canvasCtx.stroke();x+=barWidth+5e3}}barGraph(done,canvasCtx,width,height,nodename){try{if(this.analyserNode[nodename]&&nodename){const WIDTH=width,HEIGHT=height;this.analyserNode[nodename].fftSize=256;var bufferLengthAlt=this.analyserNode[nodename].frequencyBinCount,stdSize2=WIDTH/3+50,dataArrayAlt=new Uint8Array(bufferLengthAlt);canvasCtx.clearRect(0,0,WIDTH,HEIGHT);var drawAlt=()=>{this.drawVisual=requestAnimationFrame(drawAlt);this.analyserNode[nodename].getByteFrequencyData(dataArrayAlt);canvasCtx.fillStyle="rgb(0, 0, 0)";canvasCtx.fillRect(0,0,WIDTH,HEIGHT);var barWidth=1.5*(WIDTH/bufferLengthAlt),barHeight;this.bars(canvasCtx,dataArrayAlt,bufferLengthAlt,barWidth,barHeight,HEIGHT);this.circles(canvasCtx,dataArrayAlt,bufferLengthAlt,stdSize2,barHeight,barWidth,HEIGHT,!0,0,0)};drawAlt();done()}else{done(nodename+` doesn't exist or no argumet value!!`)}}catch(err){done(err)}}bars(canvasCtx,dataArrayAlt,bufferLengthAlt,barWidth,barHeight,HEIGHT){for(var x=0,i=0;i<bufferLengthAlt;i++){canvasCtx.beginPath();barHeight=dataArrayAlt[i];canvasCtx.fillStyle="rgb("+(barHeight+100)+",50,50)";canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);canvasCtx.stroke();x+=barWidth+1}}killVisual(context2d,width,height){context2d.fillStyle="#000000";context2d.fillRect(0,0,width,height);window.cancelAnimationFrame(this.drawVisual)}whiteNoise(){this.newBuffer("whitenoise",2);for(let channel=0;channel<this.whitenoise.numberOfChannels;channel++){for(let i=0;i<this.whitenoise.length;i++){this.buffering[i]=2*Math.random()-1}}this.bufferSource();this.source.buffer=this.whitenoise}}