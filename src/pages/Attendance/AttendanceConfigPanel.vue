<!--考勤操作面板-->
<template>
  <div>
    <!--工序-->
    <tag-item-list
      title="工序"
      title-icon="icon-wrench"
      btn-name="添加新工序"
      add-input-name="工序名称"
      :fetch-url="processFetchApi"
      :add-url="processAddApi"
      :delete-url="processDeleteApi"
    >
    </tag-item-list>
    <!--班次-->
    <tag-item-list
      title="班次"
      title-icon="icon-apartment"
      btn-name="添加新班次"
      add-input-name="班次名称"
      :fetch-url="shiftFetchApi"
      :add-url="shiftAddApi"
      :delete-url="shiftDeleteApi"
    >
    </tag-item-list>

    <!--临时人员-->
    <tag-item-list
      title="临时人员"
      title-icon="icon-team"
      btn-name="添加临时人员"
      add-input-name="人员名称"
      :fetch-url="tempstaffFetchApi"
      :add-url="tempstaffAddApi"
      :delete-url="tempstaffDeleteApi"
    >
    </tag-item-list>

    <!--正式人员-->
    <tag-item-list
      title="正式人员"
      title-icon="icon-team"
      btn-name="添加正式人员"
      add-input-name="人员名称"
      :fetch-url="regularstaffFetchApi"
      :add-url="regularstaffAddApi"
      :delete-url="regularstaffDeleteApi"
    >
    </tag-item-list>

    <!--工作内容-->
    <work-content
      title="工作内容"
      title-icon="icon-detail"
      btn-name="添加工作内容"
      add-input-name="工作内容"
      :fetch-url="workContentFetchApi"
      :add-url="workContentAddApi"
      :delete-url="workContentDeleteApi"
    >
    </work-content>

    <!--公告栏(上)-->
    <public-announcement
      title="公告栏(上)"
      type="up"
      fetch-url="sdf"
      submit-url="sdf"
      title-icon="icon-notification">
    </public-announcement>
    <!--公告栏(下)-->
    <public-announcement
      title="公告栏(下)"
      fetch-url="sdf"
      type="down"
      submit-url="sdf"
      title-icon="icon-notification">
    </public-announcement>
  </div>
</template>

<script>
  import api from '@/api/api'
  import TagItemList from '@/components/AttendanceAndArrangement/TagItemList'
  import WorkContent from '@/components/AttendanceAndArrangement/WorkContent'
  import PublicAnnouncement from '@/components/AttendanceAndArrangement/PublicAnnouncement'
	export default {
		name: '',
    components:{
      TagItemList,
      WorkContent,
      PublicAnnouncement
    },
		data () {
			return {
        //工序的拉取数据api
        processFetchApi:api.processFetchApi,
        //工序的添加数据的api
        processAddApi:api.processAddApi,
        //工序删除数据的api
        processDeleteApi:api.processDeleteApi,

        //班次的拉取数据api
        shiftFetchApi:api.shiftFetchApi,
        //班次的添加数据的api
        shiftAddApi:api.shiftAddApi,
        //班次删除数据的api
        shiftDeleteApi:api.shiftDeleteApi,

        //临时人员的拉取数据api
        tempstaffFetchApi:api.tempstaffFetchApi,
        //临时人员的添加数据的api
        tempstaffAddApi:api.tempstaffAddApi,
        //临时人员删除数据的api
        tempstaffDeleteApi:api.tempstaffDeleteApi,

        //正式人员的拉取数据api
        regularstaffFetchApi:api.regularstaffFetchApi,
        //正式人员的添加数据的api
        regularstaffAddApi:api.regularstaffAddApi,
        //正式人员删除数据的api
        regularstaffDeleteApi:api.regularstaffDeleteApi,


        //工作内容的拉取数据api
        workContentFetchApi:api.workContentFetchApi,
        //工作内容的添加数据的api
        workContentAddApi:api.workContentAddApi,
        //工作内容删除数据的api
        workContentDeleteApi:api.workContentDeleteApi,
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">

</style>
