<!--新鲜事推荐模块-->
<template>
  <subscribe sort-by="likes">
  </subscribe>
</template>

<script>
  import Subscribe from '@/components/MessageSubView/Subscribe'
	export default {
		name: 'Recommend',
    components:{
      Subscribe
    },
		data () {
			return {

			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">

</style>
