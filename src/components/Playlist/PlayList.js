import React, { Component } from 'react';
import './PlayList.css';

import TrackList from '../TrackList/TrackList';

class PlayList extends Component {
  constructor(props) {
    super(props);

    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleNameChange(event) {
    this.props.onNameChange(event.target.value)
  }

  render() {
    return (
      <div className="Playlist">
        <input 
          defaultValue={this.props.playlistName}
          onChange={this.handleNameChange} />
        <TrackList 
          isRemoval={true} 
          onRemove={this.props.onRemove} 
          tracks={this.props.playlistTracks} />
        <a className="Playlist-save"
            onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
      </div>
    );
  }
}

export default PlayList;