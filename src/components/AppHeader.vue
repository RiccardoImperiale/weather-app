<script>
import AppModal from './AppModal.vue'
import { store } from '../store.js';

export default {
    name: 'AppHeader',
    components: {
        AppModal
    },
    data() {
        return {
            store,
            isModalOpen: true,
        }
    },
}
</script>

<template>
    <header class="container">
        <nav>
            <div class="logo">
                <img width="70px" src="/img/logo.png" alt="app logo">
            </div>
            <div class="buttons">
                <i @click="isModalOpen = true" class="fa-solid fa-circle-info"></i>
                <i @click="store.saveToLocalStorage" class="fa-solid fa-plus"></i>
            </div>
            <AppModal @close-modal="isModalOpen = false" :isModalOpen="isModalOpen" />
        </nav>
    </header>
</template>

<style scoped>
header {
    & nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 3rem 0 1.5rem 0;
        border-bottom: 1px solid var(--wtr-primary);

        .buttons {
            font-size: 1.4rem;

            & i {
                cursor: pointer;
            }

            .fa-circle-info {
                margin-right: .75rem;
                color: var(--wtr-light);
            }

            .fa-plus {
                color: var(--wtr-primary);
            }
        }
    }
}
</style>
