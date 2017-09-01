<template>
  <div id="app">
    <kz-tree></kz-tree>
  </div>
</template>

<script>
/**
 * tree 实例
 **/
export default {
  name: 'app',
  components: {
    kzTree: require('./tree.vue')
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
html,body {
  height: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  height: 100%;
}
.el-tree {
  border: none;
}
</style>
