let handlefail = function (err) {
    console.log(err)
}

let appId = "2aeac657f7f24ca6b8d29980203150db";
let globalStream;
let isAudioMuted = false;
let isVidioMuted = false;

let client = AgoraRTC.createClient({
    mode: "live",
    codec: "h264"
})

client.init(appId, () => console.log("AgoraRTC Client Connected"), handlefail
)


// function addParticipantName(Username) {
//     let nameContainer = document.getElementById("namesList");
//     console.log("Creating names list");
//     let nameDiv = document.createElement("div");
//     let nameDivID = Username.replace(" ", "");
//     nameDiv.setAttribute("id", nameDivID);
//     nameContainer.appendChild(nameDiv);
//     document.getElementById(nameDivID).innerHTML = Username;
    
// }


function removeMyVideoStream() {
    globalStream.stop();
}

function removeVideoStream(evt) {
    let stream = evt.stream;
    stream.stop();
    let remDiv = document.getElementById(stream.getId())
    remDiv.parentNode.removeChild(remDiv);
}

function addVideoStream(streamId) {
    console.log()
    let remoteContainer = document.getElementById("remoteStream");
    let streamDiv = document.createElement("div");
    streamDiv.id = streamId;
    streamDiv.style.transform = "rotateY(180deg)";
    streamDiv.style.height = "250px"
    remoteContainer.appendChild(streamDiv)
}

// document.getElementById("leave").onclick = function () {
//     client.leave(function() {
//         console.log("Left!")
//     },handlefail)
//     removeMyVideoStream();
// }

document.getElementById("join").onclick = function () {
    let channelName = document.getElementById("channelName").value;
    let Username = document.getElementById("username").value;

    client.join(
        null,
        channelName,
        Username,
        () => {
            var localStream = AgoraRTC.createStream({
                video: true,
                audio: true,
            })

            localStream.init(function () {
                localStream.play("SelfStream")
                console.log(`App id: ${appId}\nChannel id: ${channelName}`)
                client.publish(localStream)
            })

            globalStream = localStream
        }
    )

    client.on("stream-added", function (evt) {
        console.log("Added Stream");
        client.subscribe(evt.stream, handlefail)
        
    })

    client.on("stream-subscribed", function (evt) {
        console.log("Subscribed Stream");
        // addParticipantName(Username);
        let stream = evt.stream;
        addVideoStream(stream.getId());
        stream.play(stream.getId());
    })


    client.on("peer-leave", function (evt) {
        alert("Doodler has left!");
        removeVideoStream(evt)
    }
    )
}

document.getElementById("video-mute").onclick = function () {
    if (!isVidioMuted) {
        globalStream.muteVideo();
        isVidioMuted = true;
    } else {
        globalStream.unmuteVideo();
        isVidioMuted = false;
    }
}

document.getElementById("audio-mute").onclick = function () {
    if (!isAudioMuted) {
        globalStream.muteAudio();
        isAudioMuted = true;
    } else {
        globalStream.unmuteAudio();
        isAudioMuted = false;
    }
}

// Canvas

var context;
if (window.addEventListener) {
    window.addEventListener('load', function () {

        var canvas, canvaso, contexto;
        // Default tool. (chalk, line, rectangle) 
        var tool;
        var tool_default = 'chalk';

        function init() {
            canvaso = document.getElementById('drawingCanvas');
            if (!canvaso) {
                alert('Error! The canvas element was not found!');
                return;
            }
            if (!canvaso.getContext) {
                alert('Error! No canvas.getContext!');
                return;
            }
            // Create 2d canvas. 
            contexto = canvaso.getContext('2d');
            if (!contexto) {
                alert('Error! Failed to getContext!');
                return;
            }
            // Build the temporary canvas. 
            var container = canvaso.parentNode;
            canvas = document.createElement('canvas');
            if (!canvas) {
                alert('Error! Cannot create a new canvas element!');
                return;
            }
            canvas.id = 'tempCanvas';
            canvas.width = canvaso.width;
            canvas.height = canvaso.height;
            container.appendChild(canvas);
            context = canvas.getContext('2d');
            context.strokeStyle = "#000000";// Default line color. 
            context.lineWidth = 1.0;// Default stroke weight. 

            // Fill transparent canvas with dark grey (So we can use the color to erase). 
            context.fillStyle = "#FFFFFF";
            context.fillRect(0, 0, 700, 600);//Top, Left, Width, Height of canvas.
            // Create a select field with our tools. 
            var tool_select = document.getElementById('selector');
            if (!tool_select) {
                alert('Error! Failed to get the select element!');
                return;
            }
            tool_select.addEventListener('change', ev_tool_change, false);

            // Activate the default tool (chalk). 
            if (tools[tool_default]) {
                tool = new tools[tool_default]();
                tool_select.value = tool_default;
            }
            // Event Listeners. 
            canvas.addEventListener('mousedown', ev_canvas, false);
            canvas.addEventListener('mousemove', ev_canvas, false);
            canvas.addEventListener('mouseup', ev_canvas, false);
        }
        // Get the mouse position. 
        function ev_canvas(ev) {
            if (ev.layerX || ev.layerX == 0) { // Firefox 
                ev._x = ev.layerX;
                ev._y = ev.layerY;
            } else if (ev.offsetX || ev.offsetX == 0) { // Opera 
                ev._x = ev.offsetX;
                ev._y = ev.offsetY;
            }
            // Get the tool's event handler. 
            var func = tool[ev.type];
            if (func) {
                func(ev);
            }
        }
        function ev_tool_change(ev) {
            if (tools[this.value]) {
                tool = new tools[this.value]();
            }
        }
        // Create the temporary canvas on top of the canvas, which is cleared each time the user draws. 
        function img_update() {
            contexto.drawImage(canvas, 0, 0);
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
        
        var tools = {};
        // Chalk tool. 
        tools.eraser = function() {
            context.strokeStyle = '#FFFFFF'; 
            context.lineWidth = '22';
            var tool = this;
            this.started = false;
            // Begin drawing with the chalk tool. 
            this.mousedown = function (ev) {
                context.beginPath();
                context.moveTo(ev._x, ev._y);
                tool.started = true;
            };
            this.mousemove = function (ev) {
                if (tool.started) {
                    context.lineTo(ev._x, ev._y);
                    context.stroke();
                }
            };
            this.mouseup = function (ev) {
                if (tool.started) {
                    tool.mousemove(ev);
                    tool.started = false;
                    img_update();
                }
            };
        }
        tools.chalk = function () {
            context.strokeStyle = '#000000'; 
            context.lineWidth = '1';
            var tool = this;
            this.started = false;
            // Begin drawing with the chalk tool. 
            this.mousedown = function (ev) {
                context.beginPath();
                context.moveTo(ev._x, ev._y);
                tool.started = true;
            };
            this.mousemove = function (ev) {
                if (tool.started) {
                    context.lineTo(ev._x, ev._y);
                    context.stroke();
                }
            };
            this.mouseup = function (ev) {
                if (tool.started) {
                    tool.mousemove(ev);
                    tool.started = false;
                    img_update();
                }
            };
        };
        init();
    }, false);
}