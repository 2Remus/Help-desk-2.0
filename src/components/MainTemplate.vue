<template>
  <div class="main-layout">
    <NavBar @logout="() => {}" />
    <div class="flex">
      <sidebar />
      <main class="p-4 w-full">
        <!-- This is where page-specific content will be injected -->
        <slot />
      </main>
    </div>
  </div>
</template>


<script setup>
    import NavBar from './NavBar.vue';
    import sidebar from './sidebar.vue';
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
</style>