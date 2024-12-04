<template>
  <div id="app">
    <RouterView />
    <Footer v-if="showFooter" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import Footer from "@/components/Footer.vue"; 


const route = useRoute();

const footerRoutes = ["/main", "/landing", "gourmet-garage-subic", "crab-and-belly", "liberty-sports-bar", "French Brew"];


const showFooter = computed(() => {
  console.log("Current route path:", route.path); 
  return footerRoutes.includes(route.path);
});
</script>
