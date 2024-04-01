<script>
import { RouterLink } from 'vue-router';
import AppModal from './AppModal.vue'
export default {
    name: 'AppHeader',
    components: {
        AppModal
    },
    data() {
        return {
            isModalOpen: false
        }
    },
}
</script>

<template>
    <header class="container">
        <nav>
            <RouterLink :to="{ name: 'home' }">
                <div class="logo">
                    <img width="70px" src="/img/logo.png" alt="fwefw">
                </div>
            </RouterLink>
            <div class="buttons">
                <i @click="isModalOpen = true" class="fa-solid fa-circle-info"></i>
                <i class="fa-solid fa-plus"></i>
            </div>
            <AppModal @close-modal="isModalOpen = false" :isModalOpen="isModalOpen" v-if="isModalOpen" />
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
