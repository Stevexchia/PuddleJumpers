import React, { useState } from 'react'
import axios from 'axios'

function App() {
  const [data, setData] = useState({})
  const [location, setLocation] = useState('')
  const [error, setError] = useState('')

  // Update URL to fetch 5-day forecast
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=895284fb2d2c50a520ea537456963d9c`

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      axios.get(url)
        .then((response) => {
          setData(response.data)
          setError('')
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            setError('Location not found. Please try again.')
          } else {
            setError('An error occurred. Please try again later.')
          }
          setData({})
        });
      setLocation('')
    }
  }

  return (
    <div className="app">
      <div className="search">
        <input
          value={location}
          onChange={event => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder='Enter Location'
          type="text" />
      </div>
      <div className="container">
        <div className="top">
          <div className="location">
            <p>{data.city ? data.city.name : null}</p>
          </div>
          <div className="temp">
            {data.list && data.list[0] ? <h1>{data.list[0].main.temp.toFixed()}°C</h1> : null}
          </div>
          <div className="description">
            {data.list && data.list[0] ? (
              <>
                <img 
                  src={`http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`} 
                  alt={data.list[0].weather[0].description} 
                />
                <p>{data.list[0].weather[0].main}</p>
              </>
            ) : null}
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        {data.list && (
          <div className="forecast">
            {data.list.map((forecast, index) => {
              // Display forecast data for 3-hour intervals
              if (index % 8 === 0) { // Show every 8th forecast (24 hours)
                return (
                  <div key={index} className="forecast-item">
                    <p>{new Date(forecast.dt * 1000).toLocaleString()}</p>
                    <img 
                      src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`} 
                      alt={forecast.weather[0].description} 
                    />
                    <p>{forecast.main.temp.toFixed()}°C</p>
                    <p>{forecast.weather[0].main}</p>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
