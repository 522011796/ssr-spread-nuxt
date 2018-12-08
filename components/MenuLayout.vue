<template>
  <Menu :theme="theme3" active-name="1">
    <MenuItem name="1">
      <Icon type="md-document" />
      菜单1
    </MenuItem>
    <MenuItem name="2">
      <Icon type="md-chatbubbles" />
      菜单2
    </MenuItem>
  </Menu>
</template>

<script>
  export default {
    name: 'MenuLayout',
    data () {
      return {
        msg:''
      }
    }
  }
</script>

<style>

</style>

