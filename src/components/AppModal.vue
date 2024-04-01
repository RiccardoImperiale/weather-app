<script>
export default {
    name: 'AppModal',
    emits: ['closeModal'],
    props: {
        isModalOpen: Boolean
    }
}
</script>

<template>
    <div @click="$emit('closeModal')" class="modal">
        <div @click.stop class="card">
            <div class="about">
                <h3>About:</h3>
                <p>
                    The Local Weather allows you to track the current and
                    future weather of cities of your choosing.
                </p>
            </div>
            <div class="how_it_works">
                <h3>How it works:</h3>
                <ol>
                    <li>
                        Search for your city by entering the name into the
                        search bar.
                    </li>
                    <li>
                        Select a city within the results, this will take
                        you to the current weather for your selection.
                    </li>
                    <li>
                        Track the city by clicking on the "+" icon in the
                        top right. This will save the city to view at a
                        later time on the home page.
                    </li>
                </ol>
            </div>
            <div class="removing_city">
                <h3>Removing a city</h3>
                <p>
                    If you no longer wish to track a city, simply select
                    the city within the home page. At the bottom of the
                    page, there will be am option to delete the city.
                </p>
            </div>
            <button @click="$emit('closeModal')">Close</button>
        </div>
    </div>
</template>

<style scoped>
.modal {
    position: absolute;
    inset: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.421);
    color: var(--wtr-dark);

    .card {
        padding: 2rem 3rem;
        width: 80%;
        max-width: 530px;
        border-radius: 1rem;
        background-color: var(--wtr-light);
        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        & h3 {
            margin-bottom: .25rem;
        }

        & button {
            border: none;
            padding: .65rem;
            border-radius: .5rem;
            background-color: var(--wtr-primary);
            font-weight: bold;
            color: var(--wtr-dark);
            cursor: pointer;
            transition: all .25s ease;

            &:hover {
                background-color: var(--wtr-dark);
                color: var(--wtr-light);
            }
        }
    }
}
</style>
