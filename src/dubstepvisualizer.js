 // An IIFE ("Iffy") - see the notes in mycourses
    (function(){
        "use strict";
        
        //var variables defined
        var NUM_SAMPLES = 256;
        var SOUND_1 = 'media/Vinyl-BreakingUpMyBones.mp3';
        var SOUND_2 = 'media/Matoma-Running Out.mp3';
        var SOUND_3 = 'media/Tongues-Joywave.mp3';
        var audioElement;
        var analyserNode;
        var canvas,ctx;
        var maxRadius=150;
        var delayAmount=0.0;
        var delayNode;
        var barMode=0;
        var dataMode=0;
        var invert=false,tintRed=false,noise=false,lines=false,grayscale=false,gradient=false,bCurve=false,qCurve=false;
        var r=10;
        var g=0;
        var b=0;
        var a=0.5;
        function init(){
            // set up canvas stuff
            canvas=document.querySelector('canvas');
            ctx=canvas.getContext("2d"); 
            // get reference to <audio> element on page
            audioElement=document.querySelector('audio');
            analyserNode=createWebAudioContextWithAnalyserNode(audioElement);
            setupUI();
            playStream(audioElement,SOUND_1);
            update();
        }

        //
        function createWebAudioContextWithAnalyserNode(audioElement){
            var audioCtx,analyserNode,sourceNode;
            audioCtx=new(window.AudioContext||window.webkitAudioContext);
            analyserNode=audioCtx.createAnalyser();
            delayNode=audioCtx.createDelay();
            delayNode.delayTime.value=delayAmount;
            analyserNode.fftSize=NUM_SAMPLES;
            sourceNode=audioCtx.createMediaElementSource(audioElement);
            sourceNode.connect(audioCtx.destination);
            sourceNode.connect(delayNode);
            delayNode.connect(analyserNode);
            analyserNode.connect(audioCtx.destination);
            return analyserNode;
        }

        //setup method which sets up document.querySelectors for each method change I'm planning to use
        function setupUI(){
            document.querySelector("#trackSelect").onchange=function(e){
                playStream(audioElement,e.target.value);
            };

            document.querySelector("#modeSelect").onchange=function(e){
                barMode=e.target.value;
            };

            document.querySelector("#canvasApi").onchange=function(e){
                dataMode=e.target.value;
            };

            document.querySelector("#fsButton").onclick=function(){
                requestFullscreen(canvas);
            };

            document.querySelector("#slider1").onchange=function(e){
                document.querySelector("#sliderStats").innerHTML=e.target.value;
                maxRadius=300*e.target.value;
            };

            document.querySelector("#delaySlider1").onchange=function(e){
            document.querySelector("#delaySliderStats").innerHTML=e.target.value;
            delayAmount=e.target.value;
            };

            document.querySelector("#rSlider1").onchange=function(e){
                document.querySelector("#redSliderStats").innerHTML=e.target.value;
                r=e.target.value;
            };

            document.querySelector("#gSlider1").onchange=function(e){
                document.querySelector("#greSliderStats").innerHTML=e.target.value;
                g=e.target.value;
            };

            document.querySelector("#bSlider1").onchange=function(e){
                document.querySelector("#bluSliderStats").innerHTML=e.target.value;b=e.target.value;
            };

            document.querySelector("#aSlider1").onchange=function(e){
                document.querySelector("#aSliderStats").innerHTML=e.target.value;a=e.target.value;
            };

            document.getElementById('invertBox').onchange=function(e){
                invert=e.target.checked;
            };

            document.getElementById('gradientBox').onchange=function(e){
                gradient=e.target.checked;
            };

            document.getElementById('bCurveBox').onchange=function(e){
                bCurve=e.target.checked;
            };

            document.getElementById('qCurveBox').onchange=function(e){
                qCurve=e.target.checked;
            };

            document.getElementById('tintRedBox').onchange=function(e){
                tintRed=e.target.checked;
            };

            document.getElementById('noiseBox').onchange=function(e){
                noise=e.target.checked;
            };

            document.getElementById('linesBox').onchange=function(e){
                lines=e.target.checked;
            };

            document.getElementById('grayscaleBox').onchange=function(e){
                grayscale=e.target.checked;
            };
            //end of document onchanges
        }

        //function which checks the mp3 file playing and displays it as well as the audio volume amount
        function playStream(audioElement,path){
            audioElement.src=path;audioElement.play();
            audioElement.volume=0.2;
            document.querySelector('#status').innerHTML="Currently on Jam: "+path;
        }

        //update function keeps updating animation frame
        function update(){
            requestAnimationFrame(update);
            var data=new Uint8Array(NUM_SAMPLES/2);

            if(dataMode==0){
                analyserNode.getByteFrequencyData(data);
            }
            else{
                analyserNode.getByteTimeDomainData(data);
            }
            ctx.clearRect(0,0,800,600);
            var barWidth=7;
            var barSpacing=10;
            var barHeight=100;
            var topSpacing=50;

            for(var i=0;i<data.length;i++){
                ctx.fillStyle=makeColor(r,g,b,a);
                ctx.strokeStyle=makeColor(r,g,b,a);
                ctx.lineWidth=6;

                if(gradient){
                    var grad=ctx.createLinearGradient(0,0,600,600);
                    grad.addColorStop(0,makeColor(r,g,b,a));
                    grad.addColorStop(1,'white');
                    ctx.fillStyle=grad;
                    ctx.strokeStyle=grad;
                }

                //if statements to change the spacing of the bars, if certain methods are called changes these levels
                if(barMode==2){
                    ctx.fillRect(i*(barWidth+barSpacing),topSpacing+256-data[i],barWidth,barHeight);
                    ctx.fillRect(640-i*(barWidth+barSpacing),topSpacing+256-data[i]-20,barWidth,barHeight);
                }
                else if(barMode==3){
                    ctx.beginPath();
                    ctx.arc(i*(barWidth+barSpacing),topSpacing+256-data[i],barWidth,0,2*Math.PI);
                    ctx.closePath();
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(640-i*(barWidth+barSpacing),topSpacing+256-data[i]-20,barWidth,0,2*Math.PI);
                    ctx.closePath();
                    ctx.fill();
                }
                else if(barMode==1){
                    ctx.beginPath();
                    ctx.moveTo(i*(barWidth+barSpacing),topSpacing+350-data[i]-20);
                    ctx.lineTo(i*(barWidth+barSpacing),600);
                    ctx.closePath();
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(640-i*(barWidth+barSpacing),topSpacing+350-data[i]-20);
                    ctx.lineTo(640-i*(barWidth+barSpacing),600);
                    ctx.closePath();
                    ctx.stroke();
                }
                else{
                    ctx.beginPath();
                    ctx.moveTo(i*(barWidth+barSpacing),topSpacing+256-data[i]-20);
                    ctx.lineTo(i*(barWidth+barSpacing),600);ctx.closePath();
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(640-i*(barWidth+barSpacing),topSpacing+256-data[i]-20);
                    ctx.lineTo(640-i*(barWidth+barSpacing),0);
                    ctx.closePath();
                    ctx.stroke();
                }
                var percent=data[i]/255;
                var circleRadius=percent*maxRadius;
                ctx.beginPath();
                ctx.fillStyle=makeColor(255,111,111,.34-percent/3.0);
                ctx.arc(canvas.width/2,canvas.height/2,circleRadius,0,2*Math.PI,false);
                ctx.fill();
                ctx.closePath();
                ctx.beginPath();
                ctx.fillStyle=makeColor(0,0,255,.10-percent/10.0);
                ctx.arc(canvas.width/2,canvas.height/2,circleRadius*1.5,0,2*Math.PI,false);
                ctx.fill();
                ctx.closePath();
                ctx.save();
                ctx.beginPath();
                ctx.fillStyle=makeColor(200,200,0,.5-percent/5.0);
                ctx.arc(canvas.width/2,canvas.height/2,circleRadius*.50,0,2*Math.PI,false);
                ctx.fill();
                ctx.closePath();
            }

            var dataNum=0;

            //for loop for adding in curves, depending on whether a quadratic or beizer curve is selected
            for(var j=0;j<data.length;j++){
                dataNum+=data[j];
            }

            dataNum=dataNum/255;if(bCurve){
                    ctx.beginPath();
                    ctx.moveTo(0,0);
                    ctx.bezierCurveTo(200,400,dataNum*10,256-(dataNum*10),640,400);
                    ctx.stroke();
                    ctx.closePath();
                }

                if(qCurve){ctx.beginPath();
                    ctx.moveTo(0,200);
                    ctx.quadraticCurveTo(200,dataNum*10,640,200);
                    ctx.stroke();
                    ctx.closePath();
                }
                manipulatePixels();
                delayNode.delayTime.value=delayAmount;
            }

            //function to change RGB values as well as Alpha Value
            function makeColor(red,green,blue,alpha){
            var color='rgba('+red+','+green+','+blue+', '+alpha+')';
            return color;
        }

        //manipulate pixels function, puts in basic properties including invert, noise, lines, tint red, from original Audio Vis 2
            function manipulatePixels(){
                var imageData=ctx.getImageData(0,0,canvas.width,canvas.height);
                var data=imageData.data;
                var length=data.length;
                var width=imageData.width;
                for(var i=0;i<length;i+=4){
                    if(tintRed){
                        data[i]=data[i]+100;
                    }
                    if(invert){
                        var red=data[i],green=data[i+1],blue=data[i+2];
                        data[i]=255-red;
                        data[i+1]=255-green;
                        data[i+2]=255-blue;
                    }
                    if(noise&&Math.random()<.10){
                        data[i]=data[i+1]=data[i+2]=128;
                        data[i+3]=255;
                    }
                    if(lines){
                        var row=Math.floor(i/4/width);
                        if(row%50==0){
                            data[i]=data[i+1]=data[i+2]=data[i+3]=255;
                            data[i+(width*4)]=data[i+(width*4)+1]=data[i+(width*4)+2]=data[i+(width*4)+3]=255;}}
                            if(grayscale){
                                var avg=(data[i]+data[i+1]+data[i+2])/3;
                                data[i]=avg;
                                data[i+1]=avg;
                                data[i+2]=avg;}}
                                ctx.putImageData(imageData,0,0);}
                                function requestFullscreen(element){
                                if(element.requestFullscreen){
                                        element.requestFullscreen();
                                    }
                                else if(element.mozRequestFullscreen){
                                        element.mozRequestFullscreen();
                                    }
                                    else if(element.mozRequestFullScreen){
            element.mozRequestFullScreen();
        }
        else if(element.webkitRequestFullscreen){
            element.webkitRequestFullscreen();}};
    window.addEventListener("load",init);
}());