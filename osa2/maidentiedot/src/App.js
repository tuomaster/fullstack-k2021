import React, { useState, useEffect } from 'react'
import axios from 'axios'


const Languages = ({country}) => country.languages.map(language => <li key={language.name}>{language.name}</li>)

const Flag = ({country}) => <img src={country.flag} alt={`flag of ${country.name}`} width="20%"/>

const Weather = ({country}) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const params = {
      access_key:  process.env.REACT_APP_API_KEY,
      query: country.capital,
      units: 'm'
    }

    axios
      .get('http://api.weatherstack.com/current', {params})
      .then(response => {
        setWeather(response.data)
    }).catch(error => {
        console.log(error) 
    })
  }, [country])

  if (weather === null) {
    return null
  }

  return (
    <div>
      <div><b>temperature:</b> {weather.current.temperature} Celcius</div>
      <img src={weather.current.weather_icons} alt={weather.current.weather_descriptions} />
      <div><b>wind:</b> {weather.current.wind_speed} m/s direction {weather.current.wind_dir}</div>
    </div>
  )
}

const Country = ({country}) => (
  <div>
    <h1>{country.name}</h1> 
    <div>Capital: {country.capital}</div>
    <div>Population: {country.population}</div>
    <h2>Languages</h2>
    <ul>
      <Languages country={country} />
    </ul>
    <Flag country={country} />
    <h2>Weather in {country.capital}</h2>
    <Weather country={country} />
  </div>
)

const Display = ({countriesToShow, handleShowClick}) => {
  if (countriesToShow.length > 10) {
    return (
      <div>Too many matches, specify another filter</div>
    )
  } else if (countriesToShow.length === 1) {
    return (
      <div>
        {countriesToShow.map(country => <Country key={country.name} country={country} />)}  
      </div>
    )
  }
  return (
    <div>
      {countriesToShow.map(country => (
        <div key={country.name}>
          {country.name} <button id={country.name} onClick={handleShowClick}>show</button>
        </div>))}
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleShowClick = (event) => {
    setFilter(event.target.id)
  }

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const countriesToShow = countries.filter(country => new RegExp(filter, 'i').test(country.name))

  return (
    <div>
      <div>
        find countries <input value={filter} onChange={handleFilterChange} /> 
      </div>
      <div>
        <Display countriesToShow={countriesToShow} handleShowClick={handleShowClick} />
      </div>
    </div>
  );
}

export default App;

