import React, { Component } from 'react'
import toastr from 'toastr'
import "./Player.css";

class Player extends Component {
  constructor() {
    super();
    this.state = {
      gameList: [],
      selectedAlbum: null,
      gameStart: true,
      userInput: "",

  };
  }
  componentDidMount (){
    this.setState({ gameList: this.props.albums})
    if(this.state.gameList.length > 0)
      this.setAlbum()
  }

  setAlbum = () => {
    //get index
    let selectedIndex = this.getRandomIndex(this.state.gameList.length)

    this.setState({ selectedAlbum: this.state.gameList[selectedIndex].album})

    this.updateValidAlbums(selectedIndex)

  }

  getRandomIndex = (listSize) =>{
    return Math.floor(Math.random() * listSize)
  }

  updateValidAlbums = (index) => {
    let newList = this.state.gameList
    newList.splice(index, 1)
    this.setState({ gameList: newList})
  }

  displayButtons = () => {
    if(this.state.gameStart === true)
    {
      return <div>
        <div className="">
          <button className="btn btn-success btn-lg"onClick={()=>this.startGame()}>Start</button>
        </div>
      </div>
    }
    else{
      return <div>
        <button onClick={()=>this.checkUserAnswer()}>Submit</button>
        <button>Finish</button>
      </div>
    }
  }

  startGame = () => {
    this.setAlbum()
    if(this.state.gameStart === true)
    {
      this.setState({gameStart: false})
    }
  }

  setUserInput = (year) => {
    this.setState({ userInput: year})
  }

  checkUserAnswer = () =>{
    const albumYear = this.state.selectedAlbum.release_date.substring(0,4)
    if(this.state.userInput === albumYear)
    {
      console.log("correct answer")
      toastr.success(`The album was released in ${albumYear}`, 'Correct!')
      // this.props.container.success(`The album was released in ${albumYear}`, 'Correct', { closeButton: true })
    }
    else{
      console.log("wrong answer")
      toastr.error(`The album was released in ${albumYear}`, 'Incorrect!')
      // this.props.container.error(`The album was released in ${albumYear}`, 'Incorrect', { closeButton: true })
    }

    this.setAlbum()
    this.setState({userInput: ""})
  }

  finishGame = () =>{
// TODO
  }

  render() {
    return (
      <div className="center" style={{height: "500px", width: "300px"}}>
        
        <div>
          <div className="center" style={{width: "300px"}}>
              { this.state.selectedAlbum
              &&
              <div>
                <div className="row">
                  <div style={{width: "500px"}}>
                    <img alt="album" src={this.state.selectedAlbum.images[0].url} />
                  </div>

                  <div>
                    <label name="userInput">What year was this ablum released?</label>
                    <input type="number" name="userInput"required  value={this.state.userInput} minLength="4" max="2020" onChange={((e)=>this.setUserInput(e.target.value))}></input>
                  </div>
                </div>
              </div> 
              }

              {
                this.gameList === undefined && this.displayButtons()
              }
          </div>
        </div>
      </div>
    )
  }
}

export default Player;
