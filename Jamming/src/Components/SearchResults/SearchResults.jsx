import React from "react";
import './SearchResults.css';
import Tracklist from "../TrackList/TrackList";

function SearchResults (props) {
    return (
        <div className="SearchResults">
        {/* <!-- Add a TrackList component --> */}
        <Tracklist userSearchResults={props.userSearchResults} isRemoval={false} onAdd={props.onAdd}/>
      </div>
        );
}

export default SearchResults;