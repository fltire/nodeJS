<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  provide:{
    for:"demo"
  }
}
</script>
