const Spotify = require('node-spotify-api');
const getPlayibngTrack = require("./getPlayingTrack");
const { setInterval } = require('timers');

var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

let currentPlayingTrack = null;


let spotify = null;


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on("connection", s => {
  currentPlayingTrack = null;
  s.on("sendDetails", ({id, secret}) => {
    currentPlayingTrack = null;
    checkNewTrackPlaying();
    spotify = new Spotify({
      id,
      secret
    });
  })
})

http.listen(3000, () => {
  console.log('Go To http://localhost:3000');
});







checkNewTrackPlaying() 
setInterval(() => {
  checkNewTrackPlaying() 
}, 3000);


async function checkNewTrackPlaying() {
  if (!spotify) return; 
  const newCheckTrack = getPlayibngTrack();
  if (newCheckTrack !== null && currentPlayingTrack === null) {
    currentPlayingTrack = null;
    stopSong();
  }
  if (!newCheckTrack) return;

  const name = newCheckTrack.title + " " + newCheckTrack.artist;
  if (currentPlayingTrack === name) return;

  currentPlayingTrack = name;
  let getURL = null;
  try {
    getURL = await spotifyGetFirstURL(name);
    startSong(getURL)
  }catch(er) {
    console.log(er)
  }
}

function stopSong() {
  // close spotify
  console.log("stop song")
}

function startSong(url) {
  console.log(url);
  setTimeout(() => {
    io.emit('openURL', url);
  }, 500);
}


function spotifyGetFirstURL(name) {
  return new Promise((res, rej) => {
    spotify.search({ type: 'track', query: name }, function(err, data) {
      if (err) {
        rej(err);
        return;
      }
      if (!data.tracks.items.length) {
        rej("no music");
        return;
      }
      res(data.tracks.items[0].external_urls.spotify);
    });
  })
}