import React, { Component } from 'react';
import './App.css';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/PlayList';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [{ 
        name: 'No Search Results',
        album: '',
        artist: 'Enter a Search above and click Search'
       }],
      playlistTracks: [],
      playlistName: 'New Playlist'
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    let updatePlaylist = this.state.playlistTracks;
    if (this.state.playlistTracks.indexOf(track) === -1) {
      updatePlaylist.push(track);
      this.setState({ playlistTracks: updatePlaylist });
    }
  }

  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(playlistTrack => { return playlistTrack.uri; })
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: [],
        searchResults: [{ 
          name: 'Play List was saved to your Spotify',
          album: '',
          artist: 'Enter a Search above and click Search'
         }]
      });
    });
  }

  removeTrack(track) {
    let trackIndex = this.state.playlistTracks.indexOf(track);
    if (trackIndex > -1) {
      this.state.playlistTracks.splice(trackIndex, 1);
      this.setState({ playlistTracks: this.state.playlistTracks })
    }
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  search(term) { //use promises
    Spotify.search(term).then(searchResults => {
      this.setState({ searchResults: searchResults });
    });
  }

  render() {
    return (
      <div>
        <h1>J<span className="highlight">ammm</span>ing</h1>
        <div className="App">
          <SearchBar
            onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
              onAdd={this.addTrack}
              searchResults={this.state.searchResults} />
            <Playlist
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks} />
          </div>
        </div>
      </div>
    );
  };
}

export default App;
