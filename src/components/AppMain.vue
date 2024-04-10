<script>
import axios from 'axios';
import { DateTime } from 'luxon';
import { store } from '../store.js';


export default {
    name: 'AppMain',
    data() {
        return {
            mapboxAPIKey: import.meta.env.VITE_OPENWEATHERMAP_API_KEY,
            store,
            inputSearch: '',
            searchResults: [],
            searchError: false,
            isListOpen: false,
            cityTime: '',
            cityDate: '',
            savedWeatherData: null
        }
    },
    methods: {
        searchCity() {
            if (this.inputSearch !== '') {
                axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${this.inputSearch}.json?access_token=${this.mapboxAPIKey}&types=place`)
                    .then(res => {
                        this.isListOpen = true;
                        this.searchResults = res.data.features;
                        this.setError(this.searchResults);
                    })
                    .catch(err => {
                        this.searchError = true;
                        console.log(err.message);
                    })
            }
        },
        setError(res) {
            res.length === 0 ? this.searchError = true : this.searchError = false;
        },
        getCityWeather(city) {
            this.searchResults = [];
            const [lon, lat] = city.geometry.coordinates;
            this.isListOpen = false;
            this.getCurrentWeather(lon, lat);
            this.getWeatherData(lon, lat);
            this.inputSearch = '';
        },
        getCurrentWeather(lon, lat) {
            axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=7efa332cf48aeb9d2d391a51027f1a71&units=metric`)
                .then(res => {
                    store.cityWeather = res.data;
                })
                .catch(err => {
                    this.searchError = true;
                    console.log(err.message);
                })
        },
        getWeatherData(lon, lat) {
            axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=7efa332cf48aeb9d2d391a51027f1a71&units=metric`)
                .then(res => {
                    store.weatherData = res.data;
                    this.getCityDateTime(res.data)
                })
                .catch(err => {
                    this.searchError = true;
                    console.log(err.message);
                })
        },
        getCityDateTime(city) {
            const unixTimestamp = city.current.dt;
            const currentTimeUTC = DateTime.fromSeconds(unixTimestamp, { zone: city.timezone });
            this.cityDate = currentTimeUTC.toFormat('EEE, MMMM dd');
            this.cityTime = currentTimeUTC.toFormat('hh:mm a');
        },
        getHourlyTime(dt) {
            const currentTimeUTC = DateTime.fromSeconds(dt);
            const formattedTime = currentTimeUTC.toFormat('h a');
            return formattedTime;
        },
        getDayOfWeek(dt) {
            const dateTime = DateTime.fromSeconds(dt);
            const dayOfWeek = dateTime.weekdayLong;
            return dayOfWeek;
        },
        getSavedCityWeather(index) {
            this.savedWeatherData = JSON.parse(localStorage.getItem('savedLocations'));
            if (this.savedWeatherData && store.savedLocations.length !== 0) {
                store.cityWeather = this.savedWeatherData[index].cityWeather;
                store.weatherData = this.savedWeatherData[index].weatherData;
                this.getCityDateTime(store.weatherData);
            }
        },
        deleteCity(index) {
            store.savedLocations.splice(index, 1);

            if (store.savedLocations.length === 0) {
                localStorage.removeItem('savedLocations');
            } else {
                localStorage.setItem('savedLocations', JSON.stringify(store.savedLocations));
            }
        },
        openList() {
            this.inputSearch === '' ? this.isListOpen = false : this.isListOpen = true;
        }
    },
    mounted() {
        const localStoreData = JSON.parse(localStorage.getItem('savedLocations'));
        if (localStoreData && localStoreData.length > 0) {
            localStoreData.forEach(city => store.savedLocations.push(city));
            store.cityWeather = localStoreData[localStoreData.length - 1].cityWeather;
            store.weatherData = localStoreData[localStoreData.length - 1].weatherData;
        }
    },
    beforeUpdate() {
        this.saveLocation === true && store.saveToLocalStorage();
    }
}

</script>

<template>
    <main class="container">
        <div class="search">
            <input @keyup="openList" @keyup.enter="searchCity" v-model="inputSearch" type="text"
                placeholder="Search City...">
            <ul v-if="searchResults.length > 0 && isListOpen">
                <li @click="getCityWeather(city)" v-for=" city in searchResults" :key="city.id">
                    {{ city.place_name }}
                </li>
            </ul>
            <div v-if="searchError" class="error">No cities found...</div>
        </div>
        <!-- saved locations -->
        <Transition name="pop">
            <div v-if="store.savedLocations.length !== 0" class="saved_cities">
                <h3 class="capitalize">saved locations</h3>
                <div class="cities_container">
                    <div @click="getSavedCityWeather(index)" v-for="(city, index) in store.savedLocations" class="city">
                        <div class="city_name">{{ city.cityName }}</div>
                        <i @click="deleteCity(index)" class="fa-regular fa-trash-can"></i>
                    </div>
                </div>
            </div>
        </Transition>
        <!-- weather -->
        <Transition name="pop">
            <div v-if="store.cityWeather.length !== 0" class="weather">
                <div class="top">
                    <h2>{{ store.cityWeather.name }}</h2>
                    <h5>{{ cityDate }}<br>{{ cityTime }}</h5>
                </div>
                <div class="middle">
                    <h1>{{ store.cityWeather.main.temp.toFixed(0) }}<span>°</span></h1>
                    <img :src="'/img/' + store.cityWeather.weather[0].icon + '.png'" alt="wheather icon">
                    <h5 class="capitalize">Feels Like {{ store.cityWeather.main.temp.toFixed(0)
                        }}°<br>{{ store.cityWeather.weather[0].description }}</h5>
                </div>
            </div>
        </Transition>
        <!-- hourly weather -->
        <div v-if="store.weatherData.length !== 0" class="hourly_weather">
            <h3 class="capitalize">Hourly weather</h3>
            <div class="hours_container">
                <div v-for="hourly in store.weatherData.hourly" class="hour" :key="hourly.dt">
                    <p>{{ getHourlyTime(hourly.dt) }}</p>
                    <img :src="'/img/' + hourly.weather[0].icon + '.png'" alt="weather icon">
                    <div class="temp">{{ Math.round(hourly.temp) }}°</div>
                </div>
            </div>
        </div>
        <!-- weekly weather -->
        <div v-if="store.weatherData.length !== 0" class="weekly_weather">
            <h3 class="capitalize">weekly weather</h3>
            <div class="days_container">
                <div v-for="daily in store.weatherData.daily" class="day" :key="daily.dt">
                    <p>{{ getDayOfWeek(daily.dt) }}</p>
                    <img :src="'/img/' + daily.weather[0].icon + '.png'" alt="weather icon">
                    <div class="temp">
                        <p>H: {{ Math.round(daily.temp.max) }}°</p>
                        <p>L: {{ Math.round(daily.temp.min) }}°</p>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
.pop-enter-active,
.pop-leave-active {
    transition: all .25s ease;
}

.pop-enter-from {
    transform: scale(0.5);
}

.pop-leave-to {
    opacity: 0;
    transform: scale(0);
}

main {
    .search {
        position: relative;
        display: flex;
        justify-content: center;

        & input {
            padding: 1.5rem 0;
            background-color: transparent;
            outline: none;
            border: none;
            text-align: center;
            font-size: 1rem;
            color: var(--wtr-light);
            border-bottom: 1px solid var(--wtr-primary);
            display: block;
            width: 100%;
            margin: 0 auto;
            caret-color: var(--wtr-accent);
            font-weight: 800;

            &:hover {
                background-image: linear-gradient(90deg, var(--wtr-dark) 0%, var(--wtr-darker) 49%, var(--wtr-dark) 100%);
            }

            &::placeholder {
                color: var(--wtr-primary);
                font-weight: 100;
                letter-spacing: .05rem;
            }
        }

        & ul {
            position: absolute;
            top: 67px;
            color: var(--wtr-light);
            border-bottom: 1px solid var(--wtr-primary);
            text-align: center;
            padding: .5rem 0;
            width: 100%;
            list-style: none;

            background: linear-gradient(90deg, var(--wtr-dark) 0%, var(--wtr-darker) 49%, var(--wtr-dark) 100%);

            & li {
                padding: .5rem 0;
                cursor: pointer;

                &:hover {
                    background: linear-gradient(90deg, var(--wtr-dark) 0%, var(--wtr-darkest) 50%, var(--wtr-dark) 100%);
                }
            }
        }

        .error {
            position: absolute;
            top: 67px;
            padding: 1rem 0;
            color: var(--wtr-primary);
            background: linear-gradient(90deg, var(--wtr-dark) 0%, var(--wtr-darker) 49%, var(--wtr-dark) 100%);
            width: 100%;
            text-align: center;
            border-bottom: 1px solid var(--wtr-primary);
        }
    }

    .saved_cities {
        padding: 2rem 0;
        color: var(--wtr-primary);
        /* border-top: 1px solid var(--wtr-primary); */
        border-bottom: 1px solid var(--wtr-primary);

        & h3 {
            text-align: center;
            font-weight: 500;
            margin-bottom: 1rem;
        }

        .cities_container {
            display: flex;
            gap: .5rem;
            flex-wrap: wrap;
            justify-content: center;
            padding-top: 1rem;

            .city {
                background-color: var(--wtr-darker);
                color: var(--wtr-primary);
                padding: .5rem 1rem;
                border-radius: .5rem;
                display: flex;
                gap: .65rem;
                align-items: center;
                cursor: pointer;

                &:hover {
                    background-color: var(--wtr-darkest);
                }

                & i {
                    cursor: pointer;

                    &:hover {
                        color: var(--wtr-accent);
                    }
                }
            }
        }
    }

    .weather {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        border-bottom: 1px solid var(--wtr-primary);
        padding: 5rem 0;
        gap: 3rem;
        color: var(--wtr-light);

        .top,
        .middle {
            & h5 {
                font-size: 1.2rem;
                font-weight: 400;
                color: var(--wtr-primary);
            }
        }

        .top {
            & h2 {
                font-size: 3rem;
                font-weight: 400;
                margin-bottom: 1rem;
                letter-spacing: .1rem;
            }
        }

        .middle {
            & h1 {
                font-size: 9rem;
                margin-left: 1rem;
                font-weight: 500;
                margin-bottom: -3rem;

                & span {
                    color: var(--wtr-primary);
                }
            }

            & img {
                height: 300px;
                margin-bottom: -1.5rem;
            }

        }

    }

    .hourly_weather {
        padding: 2rem 0;
        color: var(--wtr-primary);

        & h3 {
            text-align: center;
            font-weight: 500;
            margin-bottom: 1.5rem;
        }

        .hours_container {
            display: flex;
            gap: 2rem;
            overflow-x: auto;
            padding: 1rem 0;
            scrollbar-width: thin;

            .hour {
                text-align: center;

                & img {
                    width: 60px;
                }

                .temp {
                    margin-bottom: .5rem;
                }
            }
        }
    }

    .weekly_weather {
        padding: 2rem 0 0.5rem 0;
        color: var(--wtr-primary);
        border-top: 1px solid var(--wtr-primary);
        border-bottom: 1px solid var(--wtr-primary);
        margin: 1rem 0 10rem 0;

        & h3 {
            text-align: center;
            font-weight: 500;
            margin-bottom: 1rem;
        }

        .days_container {
            display: flex;
            flex-direction: column;
            overflow-x: auto;
            padding: 1rem 0;
            scrollbar-width: thin;

            .day:not(:last-child) {
                border-bottom: 1px solid var(--wtr-darkest);
            }

            .day {
                display: flex;
                align-items: center;
                justify-content: space-between;

                & p {
                    width: calc(53% - 40px);
                    text-align: start;
                }

                & img {
                    width: 60px;
                }

                .temp {
                    display: flex;
                    justify-content: flex-end;
                    width: 47%;

                    & p {
                        width: 3rem;
                        text-align: end;
                    }
                }
            }
        }
    }
}
</style>
