import React, { Component } from 'react'
// import toastr from 'toastr'
import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import "./Player.css";

class Player extends Component {
  constructor() {
    super();
    this.state = {
      gameList: [],
      originalList: [],
      selectedAlbum: null,
      gameStart: true,
      userInput: "",
      gameOver: false,
      numOfCorrect: 0,
      totalAnswered: 0,
      gameType: ""
    };
  }
  componentDidMount (){
    if(this.props.data.length > 0)
    {
      // let albums = this.removeDuplicateAblums(this.props.data)
        this.setState({ 
          gameList: this.props.data,
          originalList: this.props.data,
          gameType: this.props.gameType
        })
      this.setAlbum()

      if(this.state.originalList.length === 0 && this.props.data.length !== 0)
        this.setState({ 
          gameOver: false,
          originalList: this.props.data })
    }
  }

  // to do fix this to remove duplicates
  removeDuplicateAblums = (albums) => {
    let noDuplicateAlbums = albums.filter((album,i,albums)=>
    albums.findIndex(t=>(t.album.name === album.album.name))===i)
    debugger;
    return noDuplicateAlbums
  }

  // sets up the data to play the game
  setAlbum = () => {
    let remainingRounds = this.state.gameList.length

    if( remainingRounds > 0)
    {
      let selectedIndex = this.getRandomIndex(remainingRounds)

      if(this.state.gameType === "albums")
        this.setState({ selectedAlbum: this.state.gameList[selectedIndex].album})
      else
        this.setState({ selectedAlbum: this.state.gameList[selectedIndex].track.album})
  
      this.updateValidAlbums(selectedIndex)
    }
    else{
      this.setState({ gameOver: true})
    }

  }

  // gets a random index to the the item to be displayed
  getRandomIndex = (listSize) =>{
    return Math.floor(Math.random() * listSize)
  }

  // update the data that the user has no answered
  updateValidAlbums = (index) => {
    let newList = this.state.gameList
    newList.splice(index, 1)
    this.setState({ gameList: newList})
  }

  // displays the buttons for the user to submit answer, end game, and sets up game
  displayButtons = () => {
    if(this.state.gameStart === true)
    {
      return <div>
        <div className="">
          <button className="btn btn-block btn-success btn-lg" onClick={()=>this.startGame()}>Start Game</button>
        </div>
      </div>
    }
    else{
      return <div>
        <button className="btn btn-success btn-lg" onClick={()=>this.checkUserAnswer()}>Submit</button>
        <button className="btn btn-danger btn-lg" onClick={()=> this.setState({ gameOver: true})}>End Game</button>
      </div>
    }
  }

  // sets up the game by choosing the first item/question to display to the user
  startGame = () => {
    this.setAlbum()
    if(this.state.gameStart === true)
    {
      this.setState({gameStart: false})
    }
  }

  // saves the users response
  setUserInput = (year) => {
    this.setState({ userInput: year})
  }

  // validates the users answer and displays whether the user is correct or not
  checkUserAnswer = () =>{
    const albumYear = this.state.selectedAlbum.release_date.substring(0,4)
    let newCorrect = this.state.numOfCorrect
    let totalAnswered = this.state.totalAnswered
    
    if(this.state.userInput === "" || this.state.userInput.length !== 4)
    {
      toast.warning(`Error, please enter a year after 1500`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });

        return;
    }

    if(this.state.userInput === albumYear)
    {
      this.setState({ numOfCorrect: newCorrect+1 })
      toast.success(`Correct! The album was released in ${albumYear}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }
    else{
      toast.error(`Incorrect! The album was released in ${albumYear}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }

    this.setAlbum()
    this.setState({userInput: "", totalAnswered: totalAnswered+1})
  }

  // allows the user to play again
  restartGame = () => {
    debugger;
    this.setState({
      selectedAlbum: null,
      gameStart: false,
      gameList: this.state.originalList, 
      gameType: this.state.gameType,
      userInput: "",
      gameOver: false,
      numOfCorrect: 0,
      totalAnswered: 0,
    })

    if(this.state.gameList.length > 0)
      this.setAlbum()
    
  }

  render() {
    return (
      <div className="center" style={{height: "500px", width: "300px"}}>
        <div>
          <div className="center" style={{width: "300px"}}>
              { !this.state.gameOver
              && this.state.selectedAlbum
              &&
              <div>
                <div className="row">
                  <div style={{width: "500px"}}>
                    <img alt="album" src={this.state.selectedAlbum.images[0].url} />
                  </div>

                  <div>
                    <label name="userInput">What year was this ablum released?</label>
                    <input type="number" name="userInput"required  value={this.state.userInput} minLength="4" min="1500" max="2020" onChange={((e)=>this.setUserInput(e.target.value))}></input>
                  </div>
                </div>
              </div> 
              }

              {
               !this.state.gameOver && this.state.gameList !== undefined && this.displayButtons()
              }

              {
                this.state.gameOver &&
                <div>
                  <h2>Game Over</h2>
                  <div> Stats:
                    {this.state.numOfCorrect} out of {this.state.totalAnswered}
                    <br/>
                    <button className="btn btn-success btn-lg" onClick={() => this.restartGame()}>Play Again</button>
                    <button className="btn btn-danger btn-lg" onClick={this.props.goToMainMenu}>Main Menu</button>

                  </div>
                </div>
              }
          </div>
        </div>
      </div>
    )
  }
}

export default Player;
