import { reactive } from 'vue'

export const store = reactive({
    weatherData: [],
    cityWeather: [],
    savedLocations: [],
    saveToLocalStorage() {
        const cityData = {
            cityName: this.cityWeather.name,
            weatherData: this.weatherData,
            cityWeather: this.cityWeather
        };
        if (cityData.cityWeather.length !== 0 && !this.isCityAlreadySaved(cityData.cityName)) {
            this.savedLocations.push(cityData);
            localStorage.setItem('savedLocations', JSON.stringify(this.savedLocations));
        }
    },
    isCityAlreadySaved(cityName) {
        return this.savedLocations.some(location => location.cityName === cityName);
    }
})

