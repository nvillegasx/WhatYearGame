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
        data: [],
        gameType: "",
        retrievedData: false,
        selectedPlaylist: "",
        playlistHref: "",
        playlistDataRetrieved: false,
    };
  }

  // Stores the token to make the API call to Spotify
  componentDidMount() {
    // Set token
    let _token = hash.access_token;
    if (_token) {
      // Set token
      this.setState({
        token: _token
      });
    }
  }

  // Gets the data based on the game type the user selected
  // If playlist is chosen the user will get another option to 
  // select the playlist they would like to use
  selectGamePlay = (gameType) => {
    this.setState({ gameType })
    if(gameType === "albums")
      this.getGameData('albums?limit=50')
    else
      this.getGameData(`${gameType}`)

  }

  // API call to spotify to retrieve the data to play the game
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
      if(this.state.gameType !== "playlists")
      {
        this.setState({ 
          data: response.data.items,
          retrievedData: true
        })
      }
      else{
        this.setState({ 
          data: response.data.items,
        })
      }
    }
    )
  }

  setPlaylistInfo = (playlistInfo) => {
    console.log("Playlist href")
    console.log(playlistInfo)
    // playlistInfo.target.value gets the url of the playlist to get it's music
    console.log(playlistInfo.target.value)
    this.setState({ playlistHref: playlistInfo.target.value})

  }

  displayPlaylists = () => {
    return this.state.data.map((playlist) => (
      <div class="">
        <input class="" type="radio" name="playlist" id={playlist.name} value={playlist.href} onClick={(e)=>this.setPlaylistInfo(e)}/>
        {/* fix when clicking on the name it goes to first check box */}
        <label class="playlistName" for={playlist.name}>
        {playlist.name}
        </label>
      </div>
    ))
  }

  

  submitSelectedPlaylist = () => {
    axios({
      url: this.state.playlistHref,
      method: 'get',
      headers: { 
        'Authorization': 'Bearer ' + this.state.token,
        'Content-Type' : 'application/json'
      }
    }).then((response) => {
      debugger
      this.setState({ 
        data: response.data.tracks.items,
        retrievedData: true
      })
    })
  }

  render() {
    return ( 
      <div className="App">
          <nav class="navbar navbar-default">
            <span class="navbar-brand mb-0 h1" style={{color: "white"}}><h1>Guess That Year!</h1></span>
          </nav>
          <div>
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
                <div className="col-lg colButton" onClick={() => this.selectGamePlay("albums")}>
                  <h2>Albums</h2>
                </div>
                {/* /v1/me/tracks */}
                <div className="col-lg colButton" onClick={() => this.selectGamePlay("tracks")}>
                  <h2>
                    Liked Songs
                  </h2>
                </div>
              </div>
              <div className="row">
                {/* /v1/me/playlists */}
                <div className="col-lg colButton" onClick={() => this.selectGamePlay("playlists")}>
                  <h2>
                    Playlists
                  </h2>
                </div>
              </div>
            </div>)
          }
          {
            this.state.data.length !== 0
            && this.state.gameType === "playlists"
            &&
            (
              <div>
                <h1>Select a playlist:</h1>
                {this.displayPlaylists()}
                <br/>
                <button className="btn btn-lg btn-success" onClick={() => this.submitSelectedPlaylist()}>Submit</button>
              </div>
            )
          }
          {
            this.state.retrievedData
            && this.state.data.length === 0
            && 
            (
              <h1>Unable to play no saved data.</h1>
            )
          }
          {
            this.state.token 
            && this.state.data.length !== 0
            && this.state.gameType !== "playlists"
            && (
              <div>

                <Player
                  data={this.state.data}
                  gameType={this.state.gameType}
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