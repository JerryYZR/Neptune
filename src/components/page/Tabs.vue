<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="search" @click="addDialog = true" style="width:100px;margin-right:220px">新增</el-button>
                <template>
                    
                    <el-select
                        v-model="value1"
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
                :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                :row-class-name="tableRowClassName"
                border style="width: 100%">
                <el-table-column label="序号" align="center" width="70" fixed="left">
                    <template slot-scope="scope"><span>{{scope.$index+(currentPage - 1) * pageSize + 1}} </span></template>
                </el-table-column>
                <el-table-column
                    prop="applicationTitle_en"
                    label="应用英文名"
                    align="center"
                    width="130">
                </el-table-column>
                <el-table-column
                    prop="applicationTitle_zh"
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
                    prop="applicationConnector"
                    label="应用联系人"
                    align="center"
                    width="130">
                </el-table-column>
                <el-table-column
                    prop="latestUpdate"
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
                        <el-button  @click.stop="edit" type="text" size="small" >编辑</el-button>
                        <el-button  @click.stop="del" type="text" size="small" >删除</el-button>
                        </div>
                    </template> 
                </el-table-column>
            </el-table>

            <!--添加应用信息单对话框-->
            <el-dialog title="添加应用信息" :visible.sync="addDialog" :before-close="handleClose" width="35%">
                <el-form :model="addForm"  :rules="addRules" ref="addForm" >
                    <el-form-item label="应用英文名" :label-width="formLabelWidth" prop="applicationTitle_en">
                        <el-input v-model="addForm.applicationTitle_en" autocomplete="off" style="width:250px" req></el-input>
                    </el-form-item>
                    <el-form-item label="应用中文名" :label-width="formLabelWidth" prop="applicationTitle_zh">
                        <el-input v-model="addForm.applicationTitle_zh" style="width:250px"></el-input>
                    </el-form-item>
                    <el-form-item label="所属部门" :label-width="formLabelWidth" prop="department">
                        <el-select v-model="addForm.department" placeholder="请选择部门" style="width:250px">
                            <el-option label="杭州开发一部" value="departOne"></el-option>
                            <el-option label="杭州开发二部" value="departTwo"></el-option>
                            <el-option label="杭州开发三部" value="departOne"></el-option>
                            <el-option label="杭州开发四部" value="departOne"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="应用联系人" :label-width="formLabelWidth" prop="applicationConnector">
                       <el-input v-model="addForm.applicationConnector" placeholder="搜索姓名" style="width:250px"></el-input>
                    </el-form-item>
                    <el-form-item  label="应用描述" :label-width="formLabelWidth" prop="description">
                        <el-input v-model="addForm.description" type="textarea" placeholder="应用描述信息" style="width:250px"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click='cancel'>取消</el-button>
                    <el-button type="primary" @click="addDialog = false">确认添加</el-button>
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
                        <el-form-item label="应用英文名" :label-width="formLabelWidth" prop="applicationTitle_en">
                        <el-input v-model="addForm.applicationTitle_en" autocomplete="off" style="width:250px" req></el-input>
                    </el-form-item>
                    <el-form-item label="应用中文名" :label-width="formLabelWidth" prop="applicationTitle_zh">
                        <el-input v-model="addForm.applicationTitle_zh" style="width:250px"></el-input>
                    </el-form-item>
                    <el-form-item label="所属部门" :label-width="formLabelWidth" prop="department">
                        <el-select v-model="addForm.department" placeholder="请选择部门" style="width:250px">
                            <el-option label="杭州开发一部" value="departOne"></el-option>
                            <el-option label="杭州开发二部" value="departTwo"></el-option>
                            <el-option label="杭州开发三部" value="departOne"></el-option>
                            <el-option label="杭州开发四部" value="departOne"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="应用联系人" :label-width="formLabelWidth" prop="applicationConnector">
                       <el-input v-model="addForm.applicationConnector" placeholder="搜索姓名" style="width:250px"></el-input>
                    </el-form-item>
                    <el-form-item  label="应用描述" :label-width="formLabelWidth" prop="description">
                        <el-input v-model="addForm.description" type="textarea" placeholder="应用描述信息" style="width:250px"></el-input>
                    </el-form-item>
                </el-form>
                </template>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="cancel">取 消</el-button>
                    <el-button type="primary" @click="editDialog = false">确 定</el-button>
                </span>
            </el-dialog>

            <!--删除应用信息对话框-->
            <el-dialog
                title="提示"
                :visible.sync="delDialog"
                width="35%"
                :before-close="handleClose">
                <template>
                    <el-form :model="delForm" ref="delForm">
                        <el-form-item label="是否确认删除应用：F-ABC中文名称？" icon='el-icon-warning' :label-width="formLabelWidth" prop="enname">
                        </el-form-item>
                    </el-form>
                </template>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="delDialog = false">取 消</el-button>
                    <el-button type="primary" @click="delDialog = false">确 定</el-button>
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
                    {
                       applicationTitle_en:'F-ABC',
                       applicationTitle_zh:'中文名称',
                       department:'杭州开发一部',
                       applicationConnector:'某某1',
                       latestUpdate:'2019-08-07 16:30:00',
                    },
                    {
                       applicationTitle_en:'F-ABC',
                       applicationTitle_zh:'中文名称',
                       department:'杭州开发一部',
                       applicationConnector:'某某1',
                       latestUpdate:'2019-08-07 16:30:00',
                    },
                    {
                       applicationTitle_en:'F-ABC',
                       applicationTitle_zh:'中文名称',
                       department:'杭州开发一部',
                       applicationConnector:'某某1',
                       latestUpdate:'2019-08-07 16:30:00',

                    },
                    {
                       applicationTitle_en:'F-ABC',
                       applicationTitle_zh:'中文名称',
                       department:'杭州开发一部',
                       applicationConnector:'某某1',
                       latestUpdate:'2019-08-07 16:30:00',
                    },
                ],
                total:4,
                pageSize:10,
                currentPage:1,
                selectWord: "",
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
                value1: '',
                value2: '',
                addForm:{
                    applicationTitle_en:'',
                    applicationTitle_zh:'',
                    department:'',
                    applicationConnector:'',
                    latestUpdate:''
                },
                addRules:{
                    applicationTitle_en:[
                        { required: true, message: '请输入应用英文名', trigger: 'blur' }
                    ],
                    applicationTitle_zh:[
                        { required: true, message: '请输入应用中文名', trigger: 'blur' }
                    ],
                    department:[
                        { required: true, message: '请选择所属部门', trigger: 'change' }
                    ],
                    applicationConnector:[
                        { required: true, message: '请搜索联系人', trigger: 'change' }
                    ],
                    latestUpdate:[
                        { required: true, message: '请输入最新更新时间', trigger: 'blur' }
                    ],
                },
                index:-1,
                choosedRow:{},
                delDialog:false,
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
                delForm:{
                 dealResult:''
                },
                
            }
        },
        created() {
            this.getData();
        },
        methods: {
            onSubmit() {
                this.$message.success('添加应用信息成功！');
            },

//          页码修改
            current_change(currentPage){
                console.log('现在所在的页',currentPage);
                console.log('现在所在的页',this.tableData.slice((currentPage-1)*this.pageSize,currentPage*this.pageSize));
                this.currentPage = currentPage;
//                this.$axios
//                    .post("/ticket",{
//                        current:currentPage
//                    })
//                    .then(function (response) {
//                        console.log(response);
//                        this.tableData = response.records;
//                    });
            },

//          根据条件搜索
            search(){
                console.log(this.value1);
                console.log(this.value2);
                console.log(this.selectWord);
//                var url= '';
//                var requestHead = {
//                    value1:this.value1,
//                    value1:this.value2,
//                    selectWord:this.selectWord
//                }
//                this.$axios
//                    .post(url,requestHead)
//                    .then(function (response) {
//                        console.log(response);
//                    })
//                    .catch(function (error) {
//                        console.log(error);
//                    });
            },
            

            cancel() {
                this.addDialog = false;
                this.editDialog = false;
                this.$nextTick(() => {
	                this.$refs["addForm"].resetFields();       // this.$refs.adduserform.resetFields();
                });
                this.$nextTick(() => {
	                this.$refs["editForm"].resetFields();       // this.$refs.adduserform.resetFields();
                });
            },

            tableRowClassName ({row, rowIndex}) {
                //把每一行的索引放进row
                row.index = rowIndex;
            },

            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
                
                this.$nextTick(() => {
	                this.$refs["editForm"].resetFields();       // this.$refs.adduserform.resetFields();
                });

                this.$nextTick(() => {
	                this.$refs["addForm"].resetFields();       // this.$refs.adduserform.resetFields();
                });
               
            },

            edit() {
                console.log('点击按钮');
                this.editDialog = true
            },

            del() {
                console.log('点击按钮');
                this.delDialog = true
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


//          获取表单初始数据
            getData() {
//                this.$axios
//                    .post("/ticket")
//                    .then(function (response) {
//                        console.log(response);
//                        this.tableData = response.records;
//                        this.total = response.total;
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
