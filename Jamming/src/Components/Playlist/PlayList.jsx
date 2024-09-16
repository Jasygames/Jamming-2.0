import React from "react";
import './Playlist.css';
import Tracklist from "../TrackList/TrackList";

function Playlist(props) {
  function handleNameChange({target}) {
    props.onNameChange(target.value);
  }
  return (
    <div className="Playlist">
      <input defaultValue={"New Playlist"} onChange={handleNameChange}/>
      {/* <!-- Add a TrackList component --> */}
      <Tracklist userSearchResults={props.playlistTracks} onRemove={props.onRemove} isRemoval={true}/>
      <button className="Playlist-save" onClick={props.onSave}>
        SAVE TO SPOTIFY
      </button>
    </div>
  );
}

export default Playlist;