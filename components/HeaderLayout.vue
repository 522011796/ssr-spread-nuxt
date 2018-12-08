<template>
  <section>
    <Menu mode="horizontal" active-name="1">
      <div class="layout-logo">logo</div>
      <div class="layout-nav">
        <MenuItem name="1">
          <Icon type="ios-paper" />
          {{$t('home.introduction')}}
        </MenuItem>
        <MenuItem name="2">
          <Icon type="ios-paper" />
          {{$t('home.introduction')}}
        </MenuItem>
      </div>
      <div class="clearfix"></div>
    </Menu>
  </section>
</template>

<script>
  export default {
    name: 'HeaderLayout',
    data () {
      return {
        msg:''
      }
    }
  }
</script>

<style>
.layout-logo{
  float: left;
  position: relative;
  width: 200px;
  height:100%;
  text-align: center;
}
.layout-nav{
  margin-left: 200px;
  height:100%;
  position: relative;
}
</style>

