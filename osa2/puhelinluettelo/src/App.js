import React, { useState, useEffect } from 'react'
import personService from './services/persons'


const Notification = ({message}) => {
  if(message === null) {
    return null
  }
  
  const successStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  const errorStyle = {...successStyle, color: 'red'}
  
  const messageStyle = message.type === 'success' ? successStyle : errorStyle

  return (
    <div style={messageStyle}>
      {message.content}
    </div>
  )
}

const Filter = ({filter, handleFilterChange}) => (
  <div>
    filter shown with <input value={filter} onChange={handleFilterChange} />
  </div>
)

const PersonForm = (props) => {
  return(
    <form onSubmit={props.addPerson}>
    <div>
      name: <input value={props.newName} onChange={props.handleNameChange} />
    </div>
    <div>
      number: <input value={props.newNumber} onChange={props.handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  )
}

const Persons =({personsToShow, deletePerson}) => (
  <div>
    {personsToShow.map(person => <Person key={person.name} person={person} deletePerson={deletePerson}/>)}
  </div>  
)

const Person = ({person, deletePerson}) => {
  return (
    <div>
      {person.name} {person.number} <button onClick={() => deletePerson(person.id)}>delete</button>
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const showMessage = (message) => {
    setMessage(message)
    setTimeout(() => {
      setMessage(null)
    }, 4000)  
  }

  const addPerson = (event) => {
    event.preventDefault()
    const names = persons.map(person => person.name.toLowerCase())
    if (names.includes(newName.toLowerCase())) {
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(person => person.name === newName)
        const changedPerson = {...person, number: newNumber}
  
        personService
          .update(changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.name !== newName ? person : returnedPerson))
            showMessage({content: `Changed the phone number of ${newName}`, type: 'success'})
          })
          .catch(error => {
            showMessage({content: `Information of ${person.name} has already been removed from server`, type: 'error'})
            setPersons(persons.filter(p => p.id !== person.id))
          })   
      }
      
    } else {
      if (newName.trim().length > 0) {
        const personObject = {name: newName, number: newNumber}
        personService
          .create(personObject)
          .then(returnedPerson => {
            setPersons(persons.concat(returnedPerson))
        })
        showMessage({content: `Added ${newName}`, type: 'success'})
      }
    }
    setNewName('')
    setNewNumber('')
  }

  const deletePerson = (id) => {
    const person = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(id)
        .catch(error => {
          alert(
            `${person.name} was already deleted from server`
          )
          setPersons(persons.filter(person => person.id !== id))
        })

      setPersons(persons.filter(person => person.id !== id))
      showMessage({content: `Deleted ${person.name}`, type: 'success'})
    }
  } 

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  /*const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()) || person.number.includes(filter)) */
  /*const personsToShow = persons.filter(person => new RegExp(filter, 'i').test(person.name) || person.number.includes(filter))*/
  const personsToShow = persons.filter(person => new RegExp(filter, 'i').test(`${person.name} ${person.number}`))
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}  />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />  
    </div>
  );
}

export default App;
