// script.js
const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progress = document.getElementById('progress');
const volumeSlider = document.getElementById('volume');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const shuffleBtn = document.getElementById('shuffle');
const repeatBtn = document.getElementById('repeat');
const albumArt = document.getElementById('album-art');
const currentTimeE1 = document.getElementById('current-time');
const durationE1 = document.getElementById('duration');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const uploadBtn = document.getElementById('uploadBtn');
const fileUpload = document.getElementById('fileUpload');

const songs = [
  {
    name: 'song1',
    title: 'Space Adventure Intro',
    artist: 'FesliyanStudios ASCAP IPI 792929876, 792929974'
  },
  {
    name: 'song2',
    title: 'Trusted News v3',
    artist: 'FesliyanStudios.com ASCAP IPI 792929876, 792929974'
  },
  {
    name: 'song3',
    title: 'Track A',
    artist: 'FesliyanStudios.com ASCAP IPI 792929876, 792929974'
  }
];

let songIndex = 0;
let isShuffle = false;
let isRepeat =false;

function loadSong(song) {
  title.textContent = song.title;
  artist.textContent = song.artist;
  if (song.file) {
    audio.src = song.file;
  } else { 
  audio.src = `songs/${song.name}.mp3`;
  renderPlaylist();
  localStorage.setItem('lastPlayedIndex', songIndex);
}
}

function playSong() {
  audio.play();
  playBtn.textContent = '⏸';
  albumArt.classList.add('rotate');
}

function pauseSong() {
  audio.pause();
  playBtn.textContent = '▶';
  albumArt.classList.remove('rotate');
}

function togglePlay() {
  if (audio.paused) {
    playSong();
  } else {
    pauseSong();
  }
}

function prevSong() {
  if (isShuffle) {
    shuffleSong();
  } else {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}
}

function nextSong() {
  if (isShuffle) {
    shuffleSong();
  } else {
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}
}

function shuffleSong() {
  let newIndex;
  do {
    newIndex=Math.floor(Math.random() * songs.length);
  } while (newIndex === songIndex && songs.length > 1);
  songIndex = newIndex;
  loadSong(songs[songIndex])
  playSong();
}

function updateProgress() {
  const progressPercent = (audio.currentTime / audio.duration) * 100;
  progress.value = progressPercent || 0;
}

function setProgress() {
  const newTime = (progress.value * audio.duration) / 100;
  audio.currentTime = newTime;
}

function setVolume() {
  audio.volume = volumeSlider.value;
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2,'0');
  return `${minutes}:${seconds}`;
}

audio.addEventListener('loadedmetadata', () => {
  durationE1.textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', () => {
  updateProgress();
  currentTimeE1.textContent = formatTime(audio.currentTime);
});

function toggleShuffle() {
  isShuffle = !isShuffle;
  shuffleBtn.style.backgroundColor = isShuffle ? '#3498db' : 'transparent';
}

function toggleRepeat() {
  isRepeat = !isRepeat;
  repeatBtn.style.backgroundColor = isRepeat ? '#3498db' : 'transparent';
}

audio.addEventListener('ended', () => {
  if (isRepeat) {
    playSong();
  } else {
    nextSong();
  }
});

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkmode',document.body.classList.contains('dark'));
});

window.addEventListener('load', () => {
  if (localStorage.getItem('darkmode') === 'true') {
  document.body.classList.add('dark');
  }
});

document.getElementById('download').addEventListener('click', () => {
  const link = document.createElement('a');
  link.href = audio.src;
  link.download =`${title.textContent}.mp3`;
  link.click();
});

document.getElementById('mymusic').addEventListener('click', () => {
  alert('🎵 Open your custom music list (future feature)');
});

uploadBtn.addEventListener('click', () => {
  fileUpload.click();
});

fileUpload.addEventListener('change', (event) => {
  const files = Array.from(event.target.files);

  // Convert files into song objects
  const uploadedSongs = files.map((file) => ({
    name: file.name,
    title: file.name.replace(/\.[^/.]+$/, ""), // remove extension
    artist: 'Rakshith',
    file: URL.createObjectURL(file)
}));
songs.push(...uploadedSongs);

  // Auto play first uploaded song
  songIndex = songs.length - uploadedSongs.length;
  loadSong(songs[songIndex]);
 playSong();
});

const myMusicBtn = document.getElementById('mymusic');
const playlistPanel = document.getElementById('playlist-panel');
const closePlaylistBtn = document.getElementById('close-playlist');
const playlistUl = document.getElementById('playlist');

// Function to render playlist songs
function renderPlaylist() {
  playlistUl.innerHTML = ''; // Clear existing

  songs.forEach((song, index) => {
    const li = document.createElement('li');
    li.textContent = `${song.title} — ${song.artist}`;

    if (index === songIndex) {
      li.classList.add('active');
    }
    li.addEventListener('click', () => {
      songIndex = index;
      loadSong(songs[songIndex]);
      playSong(); 
      renderPlaylist();
    });
    playlistUl.appendChild(li);
  });
}

// Toggle playlist panel visibility on My Music button click
myMusicBtn.addEventListener('click', () => {
    playlistPanel.classList.add('show');
  renderPlaylist();
});
closePlaylistBtn.addEventListener('click', () => {
playlistPanel.classList.remove('show');
});
    
document.addEventListener('click', function (e) {
  if (
    !playlistPanel.contains(e.target) &&
    !myMusicBtn.contains(e.target)
  ) {
    playlistPanel.classList.remove('show');
 }
});

// Initial load
loadSong(songs[songIndex]);
volumeSlider.value = audio.volume;

window.addEventListener('load', () => {
  const savedIndex = localStorage.getItem('lastPlayedIndex');
  if (savedIndex !== null && songs[savedIndex]) {
    songIndex = parseInt(savedIndex,10);
  } 
    loadSong(songs[songIndex]);
});

// Event Listeners
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
progress.addEventListener('input', setProgress);
volumeSlider.addEventListener('input',setVolume);
shuffleBtn.addEventListener('click',toggleShuffle);
repeatBtn.addEventListener('click',toggleRepeat);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
    .register('service-worker.js')
      .then(reg =>{
        console.log('Service Worker registered!' ,reg);
  })
      .catch(err =>{ 
        console.error('Service Worker registration failed!',err);
      });
});
}