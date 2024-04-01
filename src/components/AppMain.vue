<script>
import axios from 'axios';
const mapboxAPIKey = "pk.eyJ1Ijoiam9obmtvbWFybmlja2kiLCJhIjoiY2t5NjFzODZvMHJkaDJ1bWx6OGVieGxreSJ9.IpojdT3U3NENknF6_WhR2Q";
export default {
    name: 'AppMain',
    data() {
        return {
            inputSearch: '',
            searchResults: [],
            searchError: false,
        }
    },
    methods: {
        searchCity() {
            if (this.inputSearch !== '') {
                axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${this.inputSearch}.json?access_token=${mapboxAPIKey}&types=place`)
                    .then(res => {
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

        }
        // viewCity(res) {
        //     console.log(res);
        //     const [city, state] = res.place_name.split(',');
        // }
    }
}

</script>

<template>
    <main class="container">
        <div class="search">
            <input @keyup.enter="searchCity" v-model="inputSearch" type="text" placeholder="search city">
            <ul v-if="searchResults.length > 0">
                <li @click="getCityWeather(city)" v-for="city in searchResults" :key="city.id">{{ city.place_name }}
                </li>
            </ul>
            <div v-if="searchError" class="error">No cities found...</div>
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

            /* &:focus {
                background: linear-gradient(90deg, var(--wtr-dark) 0%, var(--wtr-darker) 49%, var(--wtr-dark) 100%)
            } */

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

}
</style>
