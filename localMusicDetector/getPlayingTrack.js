const execSync = require('child_process').execSync;


module.exports = () => {
    const obj = JSON.parse(execSync('GetPlayingTrack.exe'));
    if (obj) {
        return {artist: obj.Artist, title: obj.Title};
    } else {
        return null;
    }
}