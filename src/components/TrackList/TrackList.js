import React, { Component } from 'react';
import './TrackList.css';

import Track from '../Track/Track';

class TrackList extends Component {
    render() {
        if (typeof this.props.tracks === 'undefined') {
            let track = [{
                name: 'Search did not return results',
                artist: 'Try some different Search Terms',
                album: ' '
            }];

            return (
                <div className="TrackList">
                    <Track
                        trackInfo={track}
                        onAdd={this.props.onAdd}
                        isRemoval={this.props.isRemoval}
                        onRemove={this.props.onRemove} />
                </div>
            );
        }
        return (
            <div className="TrackList">
                {
                    this.props.tracks.map(track => {
                        return <Track
                            trackInfo={track}
                            key={track.id}
                            onAdd={this.props.onAdd}
                            isRemoval={this.props.isRemoval}
                            onRemove={this.props.onRemove} />
                    })
                }
            </div>
        );
    }
}

export default TrackList;
