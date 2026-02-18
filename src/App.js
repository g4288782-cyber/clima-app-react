import React, { useState } from 'react';
import './App.css';

function App() {
  // Configuração da API
  const api = {
    key: "3ee32176fbc4070662893138e0e9dea6",
    base: "https://api.openweathermap.org/data/2.5/"
  };

  // Estados do componente
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [error, setError] = useState('');

  // Função para buscar o clima
  const search = async (e) => {
    if (e.key === "Enter") {
      try {
        setError('');
        const response = await fetch(
          `${api.base}weather?q=${query}&lang=pt_br&units=metric&APPID=${api.key}`
        );
        
        if (!response.ok) {
          throw new Error('Cidade não encontrada!');
        }
        
        const result = await response.json();
        setWeather(result);
        setQuery('');
      } catch (err) {
        setError(err.message);
        setWeather({});
      }
    }
  };

  // Função para formatar a data
  const dateBuilder = (d) => {
    const months = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    const days = [
      "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
      "Quinta-feira", "Sexta-feira", "Sábado"
    ];
    
    const day = days[d.getDay()];
    const date = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    
    return `${day}, ${date} de ${month} de ${year}`;
  };

  // Determina a classe do background baseado na temperatura
  const getBackgroundClass = () => {
    if (!weather.main) return '';
    return weather.main.temp > 15 ? 'app-warm' : 'app-cold';
  };

  return (
    <div className={`app ${getBackgroundClass()}`}>
      <main>
        <div className="search-container">
          <h1>Consulta de Clima</h1>
          <div className="search-box">
            <input
              type="text"
              className="search-bar"
              placeholder="Digite o nome da cidade..."
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              onKeyPress={search}
            />
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {weather.main && (
          <div className="weather-info">
            <div className="location-box">
              <div className="location">
                {weather.name}, {weather.sys.country}
              </div>
              <div className="date">
                {dateBuilder(new Date())}
              </div>
            </div>

            <div className="weather-box">
              <div className="temp-container">
                <div className="temp">
                  {Math.round(weather.main.temp)}°C
                </div>
                <div className="feels-like">
                  Sensação térmica: {Math.round(weather.main.feels_like)}°C
                </div>
              </div>

              <div className="weather-details">
                <div className="weather-icon-container">
                  <img
  src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
  alt={weather.weather[0].description}
  className="weather-icon"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = 'https://openweathermap.org/img/wn/01d@2x.png'; // ícone padrão
  }}
/>
                  <div className="weather-description">
                    {weather.weather[0].description}
                  </div>
                </div>

                <div className="extra-info">
                  <div className="info-item">
                    <span className="info-label">Umidade:</span>
                    <span className="info-value">{weather.main.humidity}%</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Vento:</span>
                    <span className="info-value">{weather.wind.speed} m/s</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Pressão:</span>
                    <span className="info-value">{weather.main.pressure} hPa</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Máx/Mín:</span>
                    <span className="info-value">
                      {Math.round(weather.main.temp_max)}° / {Math.round(weather.main.temp_min)}°
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!weather.main && !error && (
          <div className="welcome-message">
            <p>👋 Bem-vindo ao Clima App!</p>
            <p>Digite o nome de uma cidade para consultar o clima</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;