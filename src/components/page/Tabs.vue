<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="search" @click="addDialog = true" style="width:100px;margin-right:220px">新增</el-button>
                <template>
                    
                    <el-select
                        v-model="departmentvalue"
                        collapse-tags
                        placeholder="部门">
                        <el-option
                            v-for="item in departmentOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </template>
                <el-input v-model="selectWord" placeholder="搜索姓名" class="handle-input mr10"></el-input>
                <el-button icon="el-icon-search"  @click="search" type="info"></el-button>
            </div>
            <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                border style="width: 100%">
                <el-table-column label="序号" align="center" width="70" fixed="left">
                    <template slot-scope="scope"><span>{{scope.$index+(currentPage - 1) * pageSize + 1}} </span></template>
                </el-table-column>
                <el-table-column
                    prop="enName"
                    label="应用英文名"
                    align="center"
                    width="130">
                </el-table-column>
                <el-table-column
                    prop="chName"
                    label="应用中文名"
                    align="center"
                    width="130">
                </el-table-column>
                <el-table-column
                    prop="department"
                    label="所属部门"
                    align="center"
                    width="130">
                </el-table-column>
                <el-table-column
                    prop="contacts"
                    label="应用联系人"
                    align="center"
                    width="130">
                </el-table-column>
                <el-table-column
                    prop="updateTime"
                    label="最后更新时间"
                    align="center"
                    width="150">
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    align="center"
                    width="148">
                    <template slot-scope = "scope">
                        <div>
                            <el-button @click.stop="editDialog = true" type="text" size="small" >
                                <i class="el-icon-edit-outline" style="font-size: 17px"></i>
                            </el-button>
                            <el-button  @click.stop="del(scope.$index)" style="color:red" type="text" size="small" >
                                <i class="el-icon-delete" style="font-size: 17px"></i>
                            </el-button>
                        </div>
                    </template> 
                </el-table-column>
            </el-table>

            <!--添加应用信息单对话框-->
            <el-dialog title="添加应用信息" :visible.sync="addDialog" :before-close="handleClose" width="35%">
                <el-form :model="addForm"  :rules="addRules" ref="addForm" >
                    <el-form-item label="应用英文名" :label-width="formLabelWidth" prop="enName">
                        <el-input v-model="addForm.enName" autocomplete="off" style="width:250px" req></el-input>
                    </el-form-item>
                    <el-form-item label="应用中文名" :label-width="formLabelWidth" prop="chName">
                        <el-input v-model="addForm.chName" style="width:250px"></el-input>
                    </el-form-item>
                    <el-form-item label="所属部门" :label-width="formLabelWidth" prop="department">
                        <el-select v-model="addForm.department" placeholder="请选择部门" style="width:250px">
                            <el-option label="杭州开发一部" value="departOne"></el-option>
                            <el-option label="杭州开发二部" value="departTwo"></el-option>
                            <el-option label="杭州开发三部" value="departThree"></el-option>
                            <el-option label="杭州开发四部" value="departFour"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="应用联系人" :label-width="formLabelWidth" prop="contacts">
                       <el-input v-model="addForm.contacts" placeholder="搜索姓名" style="width:250px"></el-input>
                    </el-form-item>
                    <el-form-item  label="应用描述" :label-width="formLabelWidth" prop="description">
                        <el-input v-model="addForm.description" type="textarea" placeholder="应用描述信息" style="width:250px"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click='addDialog = false'>取消</el-button>
                    <el-button type="primary" @click="addApply">确认添加</el-button>
                </div>
            </el-dialog>

            <!--编辑应用信息对话框-->
            <el-dialog
                title="编辑应用信息"
                :visible.sync="editDialog"
                width="35%"
                :before-close="handleClose">
                <template>
                    <el-form :model="editForm" :rules='addRules' ref="editForm">
                        <el-form-item label="应用英文名" :label-width="formLabelWidth" prop="enName">
                        <el-input v-model="editForm.enName" autocomplete="off" style="width:250px" req></el-input>
                    </el-form-item>
                    <el-form-item label="应用中文名" :label-width="formLabelWidth" prop="chName">
                        <el-input v-model="editForm.chName" style="width:250px"></el-input>
                    </el-form-item>
                    <el-form-item label="所属部门" :label-width="formLabelWidth" prop="department">
                        <el-select v-model="editForm.department" placeholder="请选择部门" style="width:250px">
                            <el-option label="杭州开发一部" value="departOne"></el-option>
                            <el-option label="杭州开发二部" value="departTwo"></el-option>
                            <el-option label="杭州开发三部" value="departOne"></el-option>
                            <el-option label="杭州开发四部" value="departOne"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="应用联系人" :label-width="formLabelWidth" prop="contacts">
                       <el-input v-model="editForm.contacts" placeholder="搜索姓名" style="width:250px"></el-input>
                    </el-form-item>
                    <el-form-item  label="应用描述" :label-width="formLabelWidth" prop="description">
                        <el-input v-model="editForm.description" type="textarea" placeholder="应用描述信息" style="width:250px"></el-input>
                    </el-form-item>
                </el-form>
                </template>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialog = false">取 消</el-button>
                    <el-button type="primary" @click="edit(scope.$index)">确 定</el-button>
                </span>
            </el-dialog>


            <div style="text-align: center;margin-top: 30px;">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total='total'
                    :page-size="pageSize"
                    @current-change="current_change">
                </el-pagination>
            </div>


        </div>
    </div>
</template>

<script>
    export default {
        name: 'tabs',
        data: function(){
            return {
                tableData: [
                    // {
                    //     enName:'F-ABC',
                    //     chName:'中文名称',
                    //    department:'杭州开发一部',
                    //    contacts:'某某1',
                    //    updateTime:'2019-08-07 16:30:00',
                    // },
                    // {
                    //     enName:'F-ABC',
                    //     chName:'中文名称',
                    //    department:'杭州开发一部',
                    //    contacts:'某某1',
                    //    updateTime:'2019-08-07 16:30:00',
                    // },
                    // {
                    //     enName:'F-ABC',
                    //     chName:'中文名称',
                    //    department:'杭州开发一部',
                    //    contacts:'某某1',
                    //    updateTime:'2019-08-07 16:30:00',

                    // },
                    // {
                    //     enName:'F',
                    //     chName:'名称',
                    //    department:'杭州开发一部',
                    //    contacts:'某某1',
                    //    updateTime:'2019-08-07 16:30:00',
                    // },
                ],
                total: 1,
                pageSize:10,
                currentPage:1,
                selectWord: "",
                applicationValue: '',
                departmentOptions:[
                    {
                        value: '杭州开发一部',
                        label: '杭州开发一部'
                    }, {
                        value: '杭州开发二部',
                        label: '杭州开发二部'
                    },
                     {
                        value: '杭州开发三部',
                        label: '杭州开发三部'
                    },
                     {
                        value: '杭州开发四部',
                        label: '杭州开发四部'
                    }
                ],
                departmentvalue: '',
                value2: '',
                addForm:{
                    enName:'',
                    chName:'',
                    department:'',
                    contacts:'',
                    updateTime:''
                },
                addRules:{
                    rules:[],
                },
                index:-1,
                choosedRow:{},
                editDialog:false,
                addDialog:false,
                ruleForm:{
                 dealResult:''
                },
                formLabelWidth:'120px',
                formInputWidth:'300px',
                editForm:{
				 dealResult:''
                },
                // delForm:{
                //  dealResult:''
                // },
                
            }
        },
        created() {
            this.getData();
        },
        methods: {
            //          获取表单初始数据
            getData() {
                this.$axios
                    .post("/api/api/getInfo?pageNum="+this.currentPage+'&department='+this.departmentvalue+'&enName='+this.selectWord)
                    .then(response => {
                        if (response.status === 200) {
                            this.total = response.data.total;
                            console.log("total:"+this.total)
                            this.tableData = response.data.records;
                            console.log(this.tableData)
                            }
                    });
            },

//          分页跳转
            current_change(currentPage){
                console.log('现在所在的页',currentPage);
                this.currentPage = currentPage;
                this.getData();
            },

            //添加应用说明
            addApply() {
                console.log(this.addForm);
                const formData = this.addForm;
                this.$axios
                    .post("/api/api/appInfo",formData)
                    .then(response=>{
                            if (response.status === 200) {
                                this.$message({
                                    type:"success",
                                    message: response.message
                                });
                                this.addDialog = false;
                                this.getData();
                            }
                        }
                    );
            },

// 根据条件搜索
            search(){
                console.log(this.applicationValue+','+this.statusValue+','+this.selectWord);
                this.getData();
            },

            del(index) {
                const rowData = this.tableData[index];
                console.log(rowData) ;
                console.log(rowData.appId)
                this.$confirm("是否确认删除应用："+rowData.enName+' '+rowData.chName+'?','提示', {
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(() => {
                    this.$axios
                    .get("/api/api/appInfo/" + rowData.appId)
                    .then(response=>{
                            if (response.status === 200) {
                                console.log("删除成功");
                                this.$message({
                                    type:"success",
                                    message: response.message
                                });
                                this.getData();
                            }
                        }
                    );
                })
            },

            //编辑应用信息
            edit(index) {
                console.log('点击按钮');
                this.editDialog = true
                console.log(this.editForm);
                const formData = this.editForm;
                const rowData = this.tableData[index];
                console.log(rowData) ;
                console.log(rowData.appId)
                this.$axios
                    .post("/api/api/appInfo/" + rowData.appId,formData)
                    .then(response=>{
                            if (response.status === 200) {
                                console.log('更新成功');
                                this.$message({
                                    type:"success",
                                    message: response.message
                                });
                                this.editDialog = false;
                                this.getData();
                            }
                        }
                    );
                

            },

            tableRowClassName ({row, rowIndex}) {
                //把每一行的索引放进row
                row.index = rowIndex;
            },

            

            submitForm(formName) {
                var result = this.ruleForm.dealResult;
                var faultId = this.choosedRow.faultId;
                console.log('result',result);
                console.log('被提交的这条记录信息：',this.choosedRow);
                this.$axios
                    .post('/api/api/faultInfoHandle',{
                        faultId:faultId,
                        result:result
                    })
                    .then(function (response) {
                        alert('success!')
                    });

            },

            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
               
            },

            
        
//            提交处理结果
            submitForm(formName) {
//                var result = this.ruleForm.dealResult;
//                this.$axios
//                    .post(url,{
//                        result:result
//                    })
//                    .then(function (response) {
//                        alert('success!')
//                    });

            },

        }
    }
</script>

<style>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }

    .el-dialog__body{
        padding-top: 0px;
    }

</style>
