import getBlobDuration from "get-blob-duration";

const videoContainer = document.getElementById("jsVideoPlayer");
const videoPlayer = document.querySelector("#jsVideoPlayer video");
const playBtn = document.getElementById("jsPlayBtn");
const volumeBtn = document.getElementById("jsVolumeBtn");
const fullscreenBtn = document.getElementById("jsFullScreen");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("jsVolume");
const progressBar = document.querySelector(".progressBar");

const registerView = () => {
    const videoId = window.location.href.split("/videos/")[1];
    fetch(`/api/${videoId}/view`, {
        method: "POST"
    })
};

function handlePlayClick(){
    if(videoPlayer.paused){
        videoPlayer.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        videoPlayer.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

function handleVolumeClick(){
    if(videoPlayer.muted){
        videoPlayer.muted = false;
        volumeRange.value = videoPlayer.volume;
        if(videoPlayer.volume >= 0.6) {
            volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else if (videoPlayer.volume >= 0.2){
            volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
        } else {
            volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>';
        }
    } else {
        volumeRange.value = 0;
        videoPlayer.muted = true;
        volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
}

function exitFullScreen(){
    fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    fullscreenBtn.addEventListener("click", goFullScreen);
    if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
}

function goFullScreen(){
    if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
      } else if (videoContainer.mozRequestFullScreen) {
        videoContainer.mozRequestFullScreen();
      } else if (videoContainer.webkitRequestFullscreen) {
        videoContainer.webkitRequestFullscreen();
      } else if (videoContainer.msRequestFullscreen) {
        videoContainer.msRequestFullscreen();
      }
    fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
    fullscreenBtn.removeEventListener("click", goFullScreen);
    fullscreenBtn.addEventListener("click",exitFullScreen);
}

const formatDate = seconds => {
    const secondsNumber = parseInt(seconds, 10);
    let hours = Math.floor(secondsNumber / 3600);
    let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
    let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;
  
    if (hours < 10) {
      hours = `0${hours}`;
    }
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    if (totalSeconds < 10) {
        totalSeconds = `0${totalSeconds}`;
    }
    return `${hours}:${minutes}:${totalSeconds}`;
};
  
function getCurrentTime() {
    currentTime.innerHTML = formatDate(Math.floor(videoPlayer.currentTime));
}
  
async function setTotalTime() {
    // const blob = await fetch(videoPlayer.src, {mode: "no-cors"}).then(response => response.blob());
    // console.log(blob);
    // const duration = await getBlobDuration(blob);
    const duration = videoPlayer.duration
    const totalTimeString = formatDate(duration);
    totalTime.innerHTML = totalTimeString;
    setInterval(getCurrentTime, 1000);
}

function handleEnded(){
    registerView();
    videoPlayer.currentTime = 0;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
  }

function handleDrag(){
    const { target: {value}
} = event;
    videoPlayer.volume = value;
    if(value >= 0.6) {
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else if (value >= 0.2){
        volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
    } else {
        volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>';
    }

}

function handleTimeUpdate() {
    const progressPercent = Math.floor(
      (videoPlayer.currentTime / videoPlayer.duration) * 100
    );
    progressBar.style.width = `${progressPercent}%`;
  }

function init(){
    videoPlayer.volume = 0.5;
    videoPlayer.addEventListener("click", handlePlayClick);
    volumeBtn.addEventListener("click", handleVolumeClick);
    fullscreenBtn.addEventListener("click", goFullScreen);
    videoPlayer.addEventListener("timeupdate", handleTimeUpdate);
    videoPlayer.addEventListener("loadedmetadata", setTotalTime);
    videoPlayer.addEventListener("ended", handleEnded);
    volumeRange.addEventListener("input", handleDrag);
}

if(videoContainer){
    init();
}
