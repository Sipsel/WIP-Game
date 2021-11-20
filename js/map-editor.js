const labelOwnSong = document.getElementById('labelOwnSong');
const ownSong = document.getElementById('ownSong');
const ownMap = document.getElementById('customMap');
const automap = document.getElementById('autoMap');
const saveMap = document.getElementById('createMap');
const inputCSV = document.getElementById('csvMap');
const content = document.getElementById('divContent');
const cv = document.getElementById('showMap');
const ctx = cv.getContext('2d');

let songDuration;
let songAvail = false;
var mapLayout;
var customSong;

var secOneArr;
var secTwoArr;
var secThrArr;

ownMap.style.display = 'none';
ctx.canvas.style.display = 'none';
automap.style.display = 'none';
saveMap.style.display = 'none';




//Hier werden die Dateien eingelesen. Der User kann nur Audio Dateien einlesen.

ownSong.addEventListener('change', (event) => {
  const fileList= event.target.files;
  customSong = fileList[0]
  const objectURL = URL.createObjectURL(customSong);
  localStorage['customSong'] = objectURL;

  labelOwnSong.style.display = 'none';
  ownMap.style.display = 'grid';
  ctx.canvas.style.display = 'grid';
  automap.style.display = 'grid';
  ctx.fillStyle = localStorage['primary-color'];
  ctx.font= "20px Lucida Handwriting";
  ctx.textAlign = "center";
  ctx.fillText(customSong.name, ctx.canvas.width/2, 20);

})

inputCSV.addEventListener('change', (e)=> {
  e.preventDefault();
  const input = inputCSV.files[0];
  const reader = new FileReader();
  reader.onload = function (e){
    const text = e.target.result;
    const data = csvToArray(text);
    mapLayout = getMapTile(data);
    drawMap(data);
  };
  reader.readAsText(input);

  saveMap.style.display = 'grid';
  automap.style.display = 'none';
  ownMap.style.display = 'none';
})

saveMap.addEventListener('click', function(e){

  var retrievedItems = localStorage.getItem("customMaps");
    //console.log(retrievedItems);
    var customMaps = JSON.parse(retrievedItems);

    console.log(customMaps);
    console.log(JSON.stringify(customMaps));
    customMaps[customMaps.length] = mapLayout;
  localStorage.setItem("customMaps", JSON.stringify(customMaps));
});

 automap.addEventListener('click', function(e) {
  var audio = new Audio(localStorage['customSong']);
  audio.onloadedmetadata = function() {
    buildMap(audio.duration);
    }
  

 })

//Hier wird eine csv Datei zu einem zweidimensionalen Array zusammengeführt.
function csvToArray(str){
  const rows = str.split("\n");
  return rows.map(function (row){
    return row.split(";");
  });
};


function getMapTile(data){
  var map = createMapTile(data);
  localStorage["MapId"] = parseInt(localStorage["MapId"]) + 1;
  return map;
}

//Eine Map wird im gewünschten Format zusammengebaut.
function createMapTile(data){
  return {
    id: localStorage["MapId"],
    cols: data[0].length,
    rows: data.length,
    tsize: data[0].length * data.length,
    tiles: data,
    song: localStorage["customSong"],
    getTile: function(col, row) {
      return this.tiles[row*this.cols + col];
    }
  };
}

function drawMap(data) {
  let cubeThickness = ctx.canvas.width/data[0].length;
  ctx.canvas.width  = content.offsetWidth;
  
  ctx.canvas.height = (content.offsetHeight/cubeThickness) + 60;

  ctx.fillStyle = localStorage['primary-color'];
  ctx.font= "20px Lucida Handwriting";
  ctx.textAlign = "center";
  ctx.fillText(customSong.name, ctx.canvas.width/2, 20);
  
  for(let i = 0; i< data[0].length; i++){
    for(let k = 0; k< data.length; k++){
      if(data[k][i] != 0){

        let x = i*cubeThickness;
        let y = (k*cubeThickness) + (ctx.canvas.height-(data.length-1)*cubeThickness);

        if(data[k][i] == 1){
          ctx.fillStyle = localStorage['primary-color'];
        } else if(data[k][i] == 2){
          ctx.fillStyle = localStorage['secondary-color'];
        } else if(data[k][i] == 3){
          ctx.fillStyle = "yellow";
        }
        
        ctx.fillRect(x, y,cubeThickness,cubeThickness);
      }
      
    }
  }


}



function buildMap(duration) {
  duration = parseInt(duration);
  var secOneSecondsLimit = Math.round(duration / 2);
  var secTwoSecondsLimit = Math.round(secOneSecondsLimit + ((duration - secOneSecondsLimit) / 2));
  var secThrSecondsLimit = duration;


  
  var mapArr = new Array(10);
  for(let i = 0; i < 10; i++){
    mapArr[i] = new Array(duration);
  }
  
  
  
   //getTextFromFile("csvMapTiles/secOne.txt", duration, secOneArr);
   //secTwoArr = getTextFromFile("csvMapTiles/secTwo.txt", duration);
   //secThrArr = getTextFromFile("csvMapTiles/secThr.txt", duration);

  

}




function getTextFromFile(filePath, duration,){
  var mapArr = new Array(10);
  for(let i = 0; i < 10; i++){
    mapArr[i] = new Array(duration);
  }
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", filePath, true);
  rawFile.onreadystatechange = function() {
     if (rawFile.readyState === 4) {
        if (rawFile.status === 200 || rawFile.status == 0) {
           var allText = rawFile.responseText;
           secOneArr = splitAndSortArrays(allText);
           return;
        }
     }
  }
  rawFile.send(null);
}

function splitAndSortArrays(arr){
  var mapArr = []
  var textArr = arr.split("#");
  for(let m = 0; m < textArr.length; m++){
    mapArr[m] = textArr[m].split(";");
  }
  mapArr.sort(function(a,b){return a.length - b.length});
  return mapArr;
}



/*
// Die Datei wird in den temporären speicher geladen. 
  button.addEventListener('click', function(e) {
    var audio = new Audio(localStorage['customSong']);
    audio.volume = localStorage['volume']/1000;
    //audio.playbackRate = 16;
    audio.play();
    audio.onloadedmetadata = function() {
      let arrLength = highestOutputArr.length;
      for(let i = 0; i < (audio.duration/2 - arrLength);i++){
        highestOutputArr[highestOutputArr.length] = 0;
        highestOutputTimestamp[highestOutputTimestamp.length] = 0;
      }

  };
    
    audioAnalysis(audio);
  });

function audioAnalysis(audio){
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const audioElement = audio;
    const canvasElement = document.querySelector('canvas');
    const canvasCtx = canvasElement.getContext('2d');


    const WIDTH = canvasElement.clientWidth;
    const HEIGHT = canvasElement.clientHeight;

    const source = audioCtx.createMediaElementSource(audioElement);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;

    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    const bufferLength = analyser.frequencyBinCount;
    //console.log(bufferLength);
    const dataArray = new Uint8Array(bufferLength);

    //console.log(dataArray.length);
    analyser.getByteFrequencyData(dataArray);
    //console.log(dataArray);

    

    function draw(){
      //console.log(songDuration);
      analyser.getByteFrequencyData(dataArray);
      canvasCtx.fillStyle = 'rgb(2,2,2)';
      canvasCtx.fillRect(0,0, WIDTH, HEIGHT);
      getHighOutput(dataArray, audio.currentTime);
      const barWidth = (WIDTH/bufferLength) * 0.8;
      let barHeigth;
      let x = 0;

      for(let i = 0; i< bufferLength;i++){
        barHeigth = dataArray[i] / 1.5;
        canvasCtx.fillStyle = localStorage['primary-color'];
        canvasCtx.fillRect(x, HEIGHT - barHeigth, barWidth, barHeigth);

        x += barWidth + 1;
      }

      requestAnimationFrame(draw);

    }
   draw();


  }

function getHighOutput(arr, audioCurrTime)
{
  let sum = 0;
  for(let i = 0; i<arr.length; i++){

    if(i >= 0 && i <= arr.length*0.05){
      sum += arr[i] * 16;
    } else if (i>= arr.length*0.05 && i <= arr.length*0.25){
      sum += arr[i] * 8;
    }else if (i>= arr.length*0.25 && i <= arr.length*0.5){
      sum += arr[i] * 4;
    }else{
      sum += arr[i] * 2;
    }
  }


  if(sum > highestOutputArr[highestOutputArr.length - 1]){
    for(let k = 0; k<highestOutputArr.length;k++)
    {
      if(sum > highestOutputArr[k]){
        highestOutputArr.pop();
        highestOutputArr.splice(k, 0, sum);
        highestOutputTimestamp.pop();
        highestOutputTimestamp.splice(k, 0, audioCurrTime);
        k = highestOutputArr.length;
        console.log(Date.now()/1000)
        //console.log(highestOutputArr);
        //console.log(highestOutputTimestamp);
      }
      
    }


    }
  
  
  }
  */