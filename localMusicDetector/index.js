const Spotify = require('node-spotify-api');
const getPlayibngTrack = require("./getPlayingTrack");
const { setInterval } = require('timers');

const server = require('http').createServer();
const io = require('socket.io')(server);

let currentPlayingTrack = null;

io.on("connection", s => {
  currentPlayingTrack = null;
  checkNewTrackPlaying();
})

server.listen(3000);


const spotify = new Spotify({
  id: "08ec2001dc224dbc9f36c10302352052",
  secret: "8c7f32c74c5f49ed9d8cb7cbc2ea1944"
});




checkNewTrackPlaying() 
setInterval(() => {
  checkNewTrackPlaying() 
}, 3000);


async function checkNewTrackPlaying() {
  const newCheckTrack = getPlayibngTrack();
  if (newCheckTrack !== null && currentPlayingTrack === null) {
    currentPlayingTrack = null;
    stopSong();
  }

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