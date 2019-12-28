<!--查询记录-->
<template>
  <div class="kpi-search-wrapper">
  <div class="title">
      <i class="iconfont icon-sound title-icon"></i>
      <span class="title-text">绩效查询</span>
    </div>
    <div class="content" v-loading="isLoading">
		<div class="search-wrapper">
			<el-date-picker
				v-model="selectedDate"
				value-format="yyyy-MM"
				type="month"
				:editable="false"
				placeholder="选择绩效月份">
    		</el-date-picker>
			<el-select 
                      v-model="selectedStaffName"
                      @change="handleStaffChange"
                      placeholder="选择员工">
             <el-option
               class="user-edit-dialog-select"
               v-for="item in staffList"
               :key="item.value"
               :label="item.label"
               :value="item.value">
             </el-option>
           </el-select>
		   <el-button type="primary"
		   			  @click="searchKPI"	 
		   			  :loading="isSearching">
						 查询
			</el-button>
			<div class="table-wrapper">
				<el-table
					:data="kpiList"
					style="width: 100%">
					<el-table-column
						prop="staffName"
						label="人员"
						>
					</el-table-column>
					<el-table-column
						prop="date"
						label="日期"
						>
					</el-table-column>
					<el-table-column
						prop="kpiType"
						label="绩效类型">
					</el-table-column>
					<el-table-column
						prop="kpiValue"
						label="绩效值">
					</el-table-column>
					<el-table-column
						prop="comment"
						label="备注">
					</el-table-column>
					<el-table-column
						align="right">
						<template slot-scope="scope">
							<el-button
							size="mini"
							type="danger"
							@click="handleDelete(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>
    			</el-table>
			</div>
		</div>
    </div>
	<!--删除的对话框-->
    <el-dialog
      title="删除该绩效记录"
      :visible.sync="deleteModalVisible"
      :close-on-click-modal="false"
      custom-class="tag-edit-dialog"
    >
      <span>确定删除该绩效数据?</span>
      <span slot="footer" class="dialog-footer">
          <el-button @click="deleteModalVisible = false" size="mini">取 消</el-button>
          <el-button type="primary"
                     :loading="isDeleting"
                     @click="confirmDelete"
                     size="mini">
            确 定
          </el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
	import api from '@/api/api'
	export default {
		name: 'KPISearch',
		data () {
			return {
				isLoading:false,
				isSearching:false,
				selectedDate:'',
				selectedStaffName:'',
				staffList:[],
				kpiList:[],

				deletedRowData:null,
				deleteModalVisible:false,
				isDeleting:false,

				currentUserName:'',
				currentUserAuth:0
			}
		},

		mounted:function(){
			this.fetchListData();
		},

		methods:{
			confirmDelete:function(){
				this.isDeleting = true;
				this.axios.post(api.deleteKPI,{
					data:{
						staffName:this.deletedRowData.staffName,
						date:this.deletedRowData.date
					}
				}).then((resp)=>{
					if(resp.data.status === 1){
						this.$message({
							type:'success',
							message:'删除成功!'
						});	
					}else{
						this.$message({
							type:'error',
							message:'删除失败请重试!'
						});	
					}
					this.isDeleting = false;
					this.deleteModalVisible = false;
					this.searchKPI()
				})
			},

			handleDelete:function(index,row){
				this.deletedRowData = row;
				this.deleteModalVisible = true;
			},
			searchKPI:function(){
				if(!this.selectedDate && !this.selectedStaffName){
					this.$message({
						type:'warning',
						message:'日期和人员姓名不能同时为空!'
					});
					return
				}
				this.isSearching = true;
				let data = {
					staffName:this.selectedStaffName,
					date:this.selectedDate
				}
				this.axios.post(api.searchKPI,{data:data}).then((resp)=>{
					if(resp.data.status === 1){
						this.kpiList = resp.data.kpiList
					}else{
						 this.$message({
							type:'error',
							message:'数据获取失败!'
                   		 });
					}
					this.isSearching = false;
				})

			},
			handleStaffChange:function(current){
				this.selectedStaffName = current;
			},

			//获取数据
            fetchListData: function(){
                this.isLoading = true;
                this.axios.get(api.fetchAttendanceArrangeDropdown).then((resp)=>{
                if(resp.data.status === 1){
					let userAuth = this.$store.getters.getUserAuth;
					if(userAuth === '0'){
						// 普通用户
						let username = this.$store.getters.getUserName;
						this.staffList = [{value:username,label:username}]
					}else{
						this.staffList = resp.data.regularstaff.concat(resp.data.tempstaff);
					}
                    
                }else{
                    this.$message({
                    type:'error',
                    message:'数据获取失败!'
                    });
                }
                    this.isLoading = false;
                }).catch(()=>{
                    this.isLoading = false;
                })
            },

		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
.kpi-search-wrapper{
  background-color: #fff;
  box-sizing: border-box;
  .title{
    height:56px;
    line-height: 56px;
    padding:0 32px;
    border-bottom: 1px solid #e8e8e8;
    color:rgba(0,0,0,0.85);
    font-size: 16px;
    .title-text{
      margin-left: 10px;
    }
    .title-icon{
      font-size: 20px;
      position: relative;
      top:2px;
    }
  }
  .content{
        padding:20px 32px;
        box-sizing: border-box;
        min-height:200px;  
        .wrapper{
            margin:0 auto;
            width:500px;
            .staff-tag{
                margin-left: 100px;
                margin-bottom:20px;
                .tag-span{
                    display: inline-block;
                    margin-right: 15px;
                    margin-bottom: 15px;
                }
            }
			.margin-top{
					margin-top: 20px;
			}
			.search-wrapper{
				display: flex;
				justify-content: flex-start;
			}	
	}
	.table-wrapper{
			margin-top:20px;
	}
  }
}
</style>
