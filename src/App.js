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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      data: [],
      gameType: "",
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
    // this.getCurrentlyPlaying(_token);
  }

  selectGamePlay = (gameType) => {
// {/* /v1/albums */}
    if(gameType === "albums")
      this.getGameData('albums?limit=50')
    else
      this.getGameData(`${gameType}`)
    //  {/* /v1/me/tracks */}
    // {/* /v1/me/playlists */}
  }

  getGameData = (url) => {
    console.log(this.state.token)
    console.log(url)
    axios({
      url: `https://api.spotify.com/v1/me/${url}`,
      method: 'get',
      headers: { 
        'Authorization': 'Bearer ' + this.state.token,
        'Content-Type' : 'application/json'
      }
    }).then((response) => {
      console.log("Test")
      console.log(response)
      this.setState({ data: response.data.items })
      console.log(this.state.data)
    }
    )
  }

  render() {
    return ( 
      <div className="App">
          <nav class="navbar navbar-default">
            <span class="navbar-brand mb-0 h1" style={{color: "white"}}><h1>Guess That Year!</h1></span>
          </nav>
          <div>
          {/* <button onClick={notify}>Notify !</button> */}
          <ToastContainer />
        </div>

          {
            !this.state.token && ( 
              <div class="center">
                <FontAwesomeIcon icon={faSpotify} size="10x" />
                <div className="center">
                  <div style={{width: "100%"}}>
                    <h4>Guess That Year is a game that uses Spotify's Api to display
                    album covers from a user's saved albums list. The objective of 
                    the game is to guess what year the album was released. How well
                    do you know your music?<br/><br/>
                    <small>
                    Note: To play the game a user must have a Spotify account.
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
            && this.state.data.length === 0
            &&
            (<div className="container center">
              <h2>Choose what you would like to use to play the game:</h2>
              <small>
                    Note: The user must have saved albums, liked songs or created playlist.
                    </small>
              <div className="row">
                {/* /v1/albums */}
                <div className="col-lg colButton" onClick={() => this.selectGamePlay('albums')}>
                  <h2>Albums</h2>
                </div>
                {/* /v1/me/tracks */}
                <div className="col-lg colButton" onClick={() => this.selectGamePlay('tracks')}>
                  <h2>
                    Liked Songs
                  </h2>
                </div>
              </div>
              <div className="row">
                {/* /v1/me/playlists */}
                <div className="col-lg colButton" onClick={() => this.selectGamePlay('playlists')}>
                  <h2>
                    Playlists
                  </h2>
                </div>
                {/* /v1/me/tracks
                <div className="col-lg colButton" onClick={() => this.selectGamePlay()}>
                  <h2>
                    Liked Songs
                  </h2>
                </div> */}
              </div>
            </div>)
          }
          {
            this.state.token 
            && this.state.data.length !== 0
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