import React, { useState } from 'react'

const Header = ({text}) => <h1>{text}</h1>

const Button = ({ handleClick, text}) => <button onClick={handleClick}>{text}</button>

const Stat = ({numberOfVotes}) => <div>has {numberOfVotes} votes</div>

const Anecdote = ({text}) => <div>{text}</div>
  
const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
  ]
  
  const [selected, setSelected] = useState(0)
  const [votes, setVote] = useState(Array.apply(null, new Array(anecdotes.length)).map(Number.prototype.valueOf, 0))
  const [mostPopular, setMostPopular] = useState(0)

  const handleSelectClick = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length))
  }

  const handleVoteClick = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVote(copy)
    setMostPopular(copy.indexOf(Math.max(...copy)))
  }

  return (
    <div>
      <Header text='Anecdote of the day' />
      <Anecdote text={anecdotes[selected]} />
      <Stat numberOfVotes={votes[selected]} />
      <div>
        <Button handleClick={handleVoteClick} text='vote' />
        <Button handleClick={handleSelectClick} text='next anecdote' />
      </div>
      <Header text='Anecdote with most votes' />
      <Anecdote text={anecdotes[mostPopular]} />
      <Stat numberOfVotes={votes[mostPopular]} />
    </div>
  );
}

export default App;
