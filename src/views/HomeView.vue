<script>
import axios from 'axios';
const mapboxAPIKey = "pk.eyJ1Ijoiam9obmtvbWFybmlja2kiLCJhIjoiY2t5NjFzODZvMHJkaDJ1bWx6OGVieGxreSJ9.IpojdT3U3NENknF6_WhR2Q";
export default {
    data() {
        return {
            inputSearch: '',
            searchResults: null
        }
    },
    methods: {
        search() {
            if (this.inputSearch !== '') {
                axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${this.inputSearch}.json?access_token=${mapboxAPIKey}&types=place`)
                    .then(res => {
                        this.searchResults = res.data.features;
                        console.log(this.searchResults);
                    })
                    .catch(err => {
                        console.log(err.message);
                    })

            }
        }
    }
}

</script>

<template>
    <main class="container">
        <div class="search">

            <input @keyup.enter="search" v-model="inputSearch" type="text" placeholder="search city">
            <ul>
                <li v-for="city in searchResults" :key="city.id">{{ city.place_name }}</li>
            </ul>
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

            &:focus {
                background: linear-gradient(90deg, var(--wtr-dark) 0%, var(--wtr-darker) 49%, var(--wtr-dark) 100%)
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
    }

}
</style>
