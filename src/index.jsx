/******** DO NOT DELETE THESE LINES ********/

import React from 'react';
import ReactDOM from 'react-dom';

import './assets/stylesheets/style.css'

/***** PASTE YOUR CODE AFTER THIS LINE *****/

function Square(props) {
  return (
    <button style={props.style} className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Spacer(props) {
  return (
    <div className="spacer"></div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  if(squares.filter(x => x!=null).length == squares.length){
    return "draw";
  }
  return null;
}

function getStatusColor(winner) {
  return winner == "draw" ? "#2d2d2d" : (winner ? "green" : "#131313");
}

class HistoryManager extends React.Component {

  handleClick(index) {
    this.props.rollbackHistoryCallback(index);
  }

  render(){
    const history = this.props.history.slice(1);
    const elements = [];
    for(let i in history){
      elements.push( 
        <button className="history-element history-button" onClick={ () => this.handleClick( (+i) + 1 ) }>
          { i == "0" ? "Start" : (+i) + 1}
        </button> 
      );
    }
    return(
      <div className="history-container">
        <button className="history-element" style={{ "--bg": getStatusColor(this.props.winner) }} >
          Current
        </button>
        {elements.reverse()} 
      </div> // reverse so the latest entry will be on the top
    );
  }
}

class Board extends React.Component {

  constructor(props){
    super(props);
  }

  renderSquare(i) {
    return <Square 
      style={{ "--bg": getStatusColor(this.props.winner) }} 
      value={this.props.squares[i]} 
      onClick={() => this.props.handleClick(i)} 
    />;
  }

  render() {

    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: [
            null, null, null,
            null, null, null,
            null, null, null,
          ],
          xIsNext: true,
        },
      ],
    };  
  }

  rollbackHistory(index) {
    this.setState(
      {
        ...this.state,
        history: this.state.history.slice(0, index),
      }
    );
  }

  isXnext(){
    const history = this.state.history;
    const current = history[history.length - 1];
    return current.xIsNext;
  }

  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    if(squares[i] == null){
      squares[i] = this.isXnext() ? 'X' : 'O';
    }
    const newHistory = [
      ...this.state.history, 
      {
        squares: squares,
        xIsNext: !this.isXnext()
      } 
    ];
    this.setState({
      ...this.state,
      history: newHistory,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.isXnext() ? 'X' : 'O');
    }
    return (
      <>
        <div className="game">
          <div className="game-history">
            <HistoryManager history={history} rollbackHistoryCallback={ (i)=>{this.rollbackHistory(i)} } winner={winner} />
          </div>
          <div className="game-board">
            <Board squares={current.squares} handleClick={ (i) => {this.handleClick(i)} } winner={winner} />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{/* TODO */}</ol>
          </div>
        </div>
      </>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
