import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "reactstrap";

const styleNode = {
  fontSize: "80px",
  color: "orange"
};

let x = <i className="fas fa-skull" style={styleNode} />;
let y = <i className="fas fa-poop" style={styleNode} />;

const styleSquare = {
  width: 150,
  height: 150
};

const Square = ({ onClick, value }) => (
  <Button
    className="square m-1 p-2"
    color="success"
    style={styleSquare}
    onClick={() => onClick()}
  >
    {value}
  </Button>
);
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div className="m-5 p-2">
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
        </div>
        <div className="board-row">
          {this.renderSquare(2)}
          {this.renderSquare(3)}
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
          squares: Array(4).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? x : y;
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <Button onClick={() => this.jumpTo(move)}>{desc}</Button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + (this.state.xIsNext ? "Sh*t" : "Skull");
    } else {
      status = "Next player: " + (this.state.xIsNext ? "Skull" : "Sh*t");
    }

    return (
      <div className="game d-flex justify-content-center align-self-center m-3">
        <div className="game-board ">
          <Board squares={current.squares} onClick={i => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

// function calculateWinner(squares) {
//   const winnerLines = [[0, 1], [2, 3], [0, 2], [1, 3]];
//   for (let i = 0; i < winnerLines.length; i++) {
//     const [a, b] = winnerLines[i];
//     if (squares[a] && squares[a] === squares[b]) {
//       return squares[a];
//     }
//   }
//   return null;
// }

function calculateWinner(squares) {
  // First, let's check horizontal.
  if (squares[0] && squares[0] == squares[1]) {
    return squares[0];
  }
  if (squares[2] && squares[2] == squares[3]) {
    return squares[2];
  }
  if (squares[0] && squares[0] == squares[2]) {
    return squares[0];
  }
  if (squares[1] && squares[1] == squares[3]) {
    return squares[1];
  }
  return null;
}
