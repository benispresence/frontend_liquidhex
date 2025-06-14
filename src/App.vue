<template>
  <router-view />
</template>

<script setup>
import { provide, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Hide loading screen when app is fully mounted
onMounted(() => {
  const loader = document.getElementById('loading');
  if (loader) {
    loader.classList.add('fade-out');
    setTimeout(() => {
      loader.style.display = 'none';
    }, 300);
  }
})

// Provide any global values here if needed
</script>

<style>
/* Global styles could be added here, but we'll use the external CSS file */
</style> 