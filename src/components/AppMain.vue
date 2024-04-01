<script>
import axios from 'axios';
import { DateTime } from 'luxon';
const mapboxAPIKey = "pk.eyJ1Ijoiam9obmtvbWFybmlja2kiLCJhIjoiY2t5NjFzODZvMHJkaDJ1bWx6OGVieGxreSJ9.IpojdT3U3NENknF6_WhR2Q";

export default {
    name: 'AppMain',
    data() {
        return {
            inputSearch: '',
            searchResults: [],
            cityWeather: [],
            searchError: false,
            isListOpen: false,
            cityTime: '',
            cityDate: '',
        }
    },
    methods: {
        searchCity() {
            if (this.inputSearch !== '') {
                axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${this.inputSearch}.json?access_token=${mapboxAPIKey}&types=place`)
                    .then(res => {
                        this.isListOpen = true;
                        this.searchResults = res.data.features;
                        console.log(this.searchResults);
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
            const [lon, lat] = city.geometry.coordinates;
            this.isListOpen = false;

            axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=17b5bd1f95000e59acd9e4995f34d2aa&units=metric`)
                .then(res => {
                    this.cityWeather = res.data;
                    this.getCityDateTime(this.cityWeather);
                    console.log(res.data);
                })
                .catch(err => {
                    this.searchError = true;
                    console.log(err.message);
                })

            this.inputSearch = '';
        },
        capitalizeWords(phrase) {
            const words = phrase.split(' ');
            const capitalizedWords = words.map(word => {
                return word.charAt(0).toUpperCase() + word.slice(1);
            });
            return capitalizedWords.join(' ');
        },
        getCityDateTime(city) {
            const unixTimestamp = city.dt;
            const currentTimeUTC = DateTime.fromSeconds(unixTimestamp);
            const currentTimeLocal = currentTimeUTC.setZone(city.timezone);
            this.cityDate = currentTimeLocal.toFormat('EEE, MMMM dd');
            this.cityTime = currentTimeLocal.toFormat('hh:mm a');
        },
    },
    created() {

    }
}

</script>

<template>
    <main class="container">
        <div class="search">
            <input @keyup="inputSearch === '' ? isListOpen = false : isListOpen = true" @keyup.enter="searchCity"
                v-model="inputSearch" type="text" placeholder="search city">
            <ul v-if="searchResults.length > 0 && isListOpen">
                <li @click="getCityWeather(city)" v-for=" city  in  searchResults " :key="city.id">{{ city.place_name
                    }}
                </li>
            </ul>
            <div v-if="searchError" class="error">No cities found...</div>
        </div>
        <div v-if="cityWeather.length !== 0" class="weather">
            <div class="top">
                <h2>{{ cityWeather.name }}</h2>
                <h5>{{ cityDate }}<br>{{ cityTime }}</h5>
            </div>
            <div class="middle">
                <h1>{{ cityWeather.main.temp.toFixed(0) }}<span>°</span></h1>
                <img :src="'/img/' + cityWeather.weather[0].icon + '.png'" alt="wheather icon">
                <h5>Feels Like {{ cityWeather.main.temp.toFixed(0)
                    }}°<br>{{ capitalizeWords(cityWeather.weather[0].description) }}</h5>
            </div>
            <!-- <div class="bottom">
            </div> -->
        </div>
    </main>
</template>

<style scoped>
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

    .weather {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        border-bottom: 1px solid var(--wtr-primary);
        padding: 6rem 0;
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

}
</style>
