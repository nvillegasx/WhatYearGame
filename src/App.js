import React, {
  Component
} from "react";
import hash from "./hash";
import "./App.css";
import Player from "./Player"
import $ from "jquery"
import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import axios from "axios"
import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { faSpotify, } from '@fortawesome/free-brands-svg-icons'

class App extends Component {
  constructor() {
      super();
      this.state = {
        token: null,
      item: {
        album: {
          images: [{ url: "" }]
        },
        name: "",
        artists: [{ name: "" }],
        duration_ms:0,
      },
      is_playing: "Paused",
      progress_ms: 0,
      albums: [],
      selectedHref: "",
      tracks: []
    };
    this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);

  }

  // getCurrentlyPlaying = (token) => {
  //   // Make a call using the token
  //   $.ajax({
  //     url: "https://api.spotify.com/v1/me/player",
  //     type: "GET",
  //     beforeSend: (xhr) => {
  //       xhr.setRequestHeader("Authorization", "Bearer " + token);
  //     },
  //     success: (data) => {
  //       this.setState({
  //         item: data.item,
  //         is_playing: data.is_playing,
  //         progress_ms: data.progress_ms,
  //       });
  //     }
  //   });

  //   console.log(this.state)
  // }

  // gets the pl
  getCurrentlyPlaying(token) {
    // Make a call using the token
    $.ajax({
      url: "https://api.spotify.com/v1/me/albums?limit=50",
      type: "GET",
      beforeSend: xhr => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: data => {
        console.log(data)
        this.setState({
          item: data.item,
          albums: data.items
        });
      },
      error: (xhr, ajaxOptions, thrownError)=> {
        console.log(xhr.responseText)
        console.log(thrownError)
      }
    });
  }

  componentDidMount() {
    // Set token
    let _token = hash.access_token;
    if (_token) {
      // Set token
      this.setState({
        token: _token
      });
    }
    this.getCurrentlyPlaying(_token);
  }

  getPlaylistSongs = () => {
    axios({
      method: 'get',
      url: this.state.selectedHref,
      headers: { Authorization: "Bearer " + this.state.token}
    }).then((response) => {
      console.log("Test")
      console.log(response)
      this.setState({ tracks: response.data.tracks.items })
      console.log(this.state.tracks)
    }
    )
  }

  render() {
    return ( 
      <div className="App">
          {/* <ToastContainer
            ref={ref => container = ref}
            className="toast-top-bottom"
          /> */}
          <nav class="navbar navbar-default">
            <span class="navbar-brand mb-0 h1" style={{color: "white"}}><h1>Guess That Year!</h1></span>
          </nav>

          {
            !this.state.token && ( 
              <div class="center">
                <FontAwesomeIcon icon={faSpotify} size="10x" />
                <div className="center">
                  <div style={{width: "300px"}}>
                    <h4>Guess That Year is a game that uses Spotify's Api to display
                    album covers from a user's saved albums list. The objective of 
                    the game is to guess what year the album was released. How well
                    do you know your music?<br/><br/>
                    <small>
                    Note: To play the game a user must have a Spotify account and albums
                    saved. 
                    </small>
                    </h4>
                    
                    <a className = "btn btn-primary btn--loginApp-link"
                      href = {
                        `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`
                      } >
                    Login to Spotify </a>
                  </div>
                </div>
              </div>
              )
            } 

          {
            this.state.token
            && this.state.albums.length !== 0
            && (
              <div>

              <Player
                albums={this.state.albums}
                />
                </div>
            )
          }
        <div class="footer">
          <p>By: Nathaniel Villegas</p>
        </div>
      </div>
    );
  }
}
export default App;