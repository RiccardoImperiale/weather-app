import { reactive } from 'vue'

export const store = reactive({
    savedLocations: [],
    cityWeather: [],
    weatherData: [],
    searchError: false,
    isListOpen: false,
    cityTime: '',
    cityDate: '',
    savedLocations: [],
    saveToLocalStorage() {
        const cityData = {
            cityName: this.cityWeather.name,
            weatherData: this.weatherData,
            cityWeather: this.cityWeather
        };
        if (cityData.cityWeather.length !== 0) {
            this.savedLocations.push(cityData);
            localStorage.setItem('savedLocations', JSON.stringify(this.savedLocations));
        }
    },
    getSavedCityWeather(index) {
        const savedWeatherData = JSON.parse(localStorage.getItem('savedLocations'));
        if (savedWeatherData) {
            this.cityWeather = savedWeatherData[index].cityWeather;
            this.weatherData = savedWeatherData[index].weatherData;
            this.getCityDateTime(this.weatherData);
        }
    }
})