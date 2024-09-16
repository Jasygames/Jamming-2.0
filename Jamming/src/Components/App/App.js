import React, {useState} from 'react';
import './App.css';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/PlayList';
import SearchBar from '../SearchBar/SearchBar';
import {Spotify} from '../../util/Spotify/Spotify';

function App() {
  const [searchResults, setSearchResults] = useState ([
    {
      name: "example track 1",
      artist: "example artist 1",
      album: "example track album 1",
      id: 1,
    },
    {
      name: "example track 2",
      artist: "example artist 2",
      album: "example track album 2",
      id: 2,
    }
  ]);
  const [playlistName, setPlaylistName] = useState ("Example Playlist Name");
  const [playlistTracks, setPlaylistTrack]  = useState ([
    {
      name: "example  playlist track 1",
      artist: "example playlist artist 1",
      album: "example  playlist  album 1",
      id: 1,
    },
    {
      name: "example playlist track 2",
      artist: "example playlist artist 2",
      album: "example playlist  album 2",
      id: 2,
    }

  ]);

function addTrack(track) {
    const existingTrack = playlistTracks.find((t) => t.id === track.id);
   const newTrack = playlistName.concat(track);
    if (existingTrack) {
     console.log("Track already in playlist");
    } else {
      setPlaylistTrack(newTrack);
    }
  }

function removeTrack(track) {
  const existingTrack = playlistTracks.filter((t) => t.id!== track.id);
  setPlaylistTrack(existingTrack);
}
function updatePlaylistName(name) {
  setPlaylistName(name);
}
function savePlaylist() {
  const trackURIs= playlistTracks.map((t) => t.uri);
  Spotify.savePlaylist(playlistName, trackURIs).then(() => {
    setPlaylistName("New Playlist");
    setPlaylistTrack([]);
  });
}
function search(term) {
  Spotify.search(term).then(result => setSearchResults(result));
      console.log(term);
}
  return (
    <div>
    <h1>
      Jammming
    </h1>
    <div className="App">
      {/* <!-- Add a SearchBar component --> */}
      <SearchBar onSearch={search}/>
      <div className="App-playlist">
        {/* <!-- Add a SearchResults component --> */}
        <SearchResults userSearchResults={searchResults} onAdd={addTrack} />
        {/* <!-- Add a Playlist component --> */}
        <Playlist playlistName={playlistName} playlistTracks={playlistTracks} onRemove={removeTrack} onNameChange={updatePlaylistName} onSave={savePlaylist}/>
      </div>
    </div>
  </div>
  );
}

export default App;
