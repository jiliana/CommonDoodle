# CommonDoodle 
CommonDoodle is a video chat web application for artists.

## Functions
1. Log in
    * Users can log in with username and password
    * Users can enter a unique channel
2. Video Chat
    * Users can mute/Unmute microphone
    * Users can turn on/off camera
3. Drawing
    * Users can draw on a canvas
    * Users can save their drawing as an image file

## Implementation of Agora SDK

### Camera
```
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
```
### Audio
```
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
```
## Walkthrough
### Login Page
![](https://i.imgur.com/IKorcHY.gif)
### Video Call + Canvas
![](https://i.imgur.com/1UjEcJW.png)




