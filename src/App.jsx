import { useEffect, useState } from "react";
import { Sun, Cloud, CloudRain, Snowflake, CloudDrizzle, CloudLightning, Thermometer, Wind } from "lucide-react";

const BACKEND_URL = "https://weather-app-backend--JoseWilliams1.replit.app";

// Icon component mapping
const WeatherIcon = ({ condition, size = 48 }) => {
  const iconProps = { size, strokeWidth: 1.5 };
  
  switch (condition) {
    case "Clear":
      return <Sun {...iconProps} className="text-yellow-400" />;
    case "Clouds":
      return <Cloud {...iconProps} className="text-gray-300" />;
    case "Rain":
      return <CloudRain {...iconProps} className="text-blue-400" />;
    case "Snow":
      return <Snowflake {...iconProps} className="text-blue-200" />;
    case "Drizzle":
      return <CloudDrizzle {...iconProps} className="text-blue-300" />;
    case "Thunderstorm":
      return <CloudLightning {...iconProps} className="text-purple-400" />;
    default:
      return <Cloud {...iconProps} className="text-gray-300" />;
  }
};

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [cityInput, setCityInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/weather/auto`)
      .then(res => res.json())
      .then(data => {
        setWeather(data);
        fetchForecast(data.city);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const fetchForecast = (city) => {
    fetch(`${BACKEND_URL}/weather?city=${city}`)
      .then(res => res.json())
      .then(data => {
        if (data.list) {
          setForecast(data.list.filter((_, i) => i % 8 === 0).slice(0, 5));
        } else {
          setForecast([data]);
        }
      });
  };

  const searchCity = () => {
    if (!cityInput) return;
    setLoading(true);

    fetch(`${BACKEND_URL}/weather?city=${cityInput}`)
      .then(res => res.json())
      .then(data => {
        setWeather({ city: cityInput, weather: data });
        fetchForecast(cityInput);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-lg font-medium">Loading weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">Weather Forecast</h1>
          <p className="text-gray-300 text-lg">Stay updated with real-time weather information</p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-12">
          <div className="w-full max-w-md relative">
            <div className="flex shadow-2xl rounded-full overflow-hidden">
              <input
                type="text"
                className="flex-1 px-6 py-4 text-gray-700 focus:outline-none text-lg"
                placeholder="Search for a city..."
                value={cityInput}
                onChange={e => setCityInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && searchCity()}
              />
              <button
                className="bg-gray-700 text-white px-8 hover:bg-gray-600 transition-colors duration-200 font-semibold"
                onClick={searchCity}
              >
                Search
              </button>
            </div>
            
            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute w-full mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden z-10">
                {suggestions.map((city, idx) => (
                  <button
                    key={idx}
                    className="w-full px-6 py-3 text-left text-gray-700 hover:bg-gray-100 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                    onClick={() => selectSuggestion(city)}
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 mx-auto max-w-2xl">
            <div className="bg-red-500/20 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-red-500/30">
              <p className="text-red-200 text-center">{error}</p>
            </div>
          </div>
        )}

        {/* Current Weather Card */}
        {weather && weather.weather && (
          <div className="mb-12 mx-auto max-w-2xl">
            <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/30">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-6">
                  {weather.city}{weather.country && `, ${weather.country}`}
                </h2>
                
                <div className="flex justify-center mb-6">
                  <WeatherIcon 
                    condition={weather.weather.weather?.[0]?.main} 
                    size={120}
                  />
                </div>
                
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-7xl font-bold text-white">
                    {Math.round(weather.weather.main?.temp)}°
                  </span>
                </div>
                
                <p className="text-2xl text-gray-200 capitalize mb-6">
                  {weather.weather.weather?.[0]?.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Thermometer className="text-red-300" size={24} />
                      <span className="text-gray-200 text-sm">Feels Like</span>
                    </div>
                    <p className="text-white text-2xl font-semibold">
                      {Math.round(weather.weather.main?.feels_like)}°C
                    </p>
                  </div>
                  
                  <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Wind className="text-blue-200" size={24} />
                      <span className="text-gray-200 text-sm">Wind Speed</span>
                    </div>
                    <p className="text-white text-2xl font-semibold">
                      {weather.weather.wind?.speed} m/s
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5-Day Forecast */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {forecast.map((f, idx) => (
            <div 
              key={idx} 
              className="bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/30 hover:bg-white/30 transition-all duration-200 hover:scale-105"
            >
              <p className="font-semibold text-white text-lg mb-4 text-center">
                {f.dt_txt ? new Date(f.dt_txt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : "Today"}
              </p>
              
              <div className="flex justify-center mb-4">
                <WeatherIcon 
                  condition={f.weather?.[0]?.main} 
                  size={56}
                />
              </div>
              
              <p className="text-4xl font-bold text-white text-center mb-2">
                {Math.round(f.main?.temp)}°
              </p>
              
              <p className="text-gray-200 capitalize text-center text-sm">
                {f.weather?.[0]?.description}
              </p>
              
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex justify-between text-xs text-gray-300">
                  <span>H: {Math.round(f.main?.temp_max)}°</span>
                  <span>L: {Math.round(f.main?.temp_min)}°</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;