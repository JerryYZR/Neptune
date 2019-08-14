<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <template>
                    <el-select v-model="value1" placeholder="应用">
                        <el-option
                            v-for="item in applicationOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select
                        v-model="value2"
                        collapse-tags
                        placeholder="状态">
                        <el-option
                            v-for="item in statusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </template>
                <el-input v-model="selectWord" placeholder="搜索故障标题" class="handle-input mr10"></el-input>
                <el-button icon="el-icon-search"  @click="search" type="info"></el-button>
            </div>
            <el-table
                :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                :row-class-name="tableRowClassName"
                @row-click="rollClick"
                @click.stop ="true"
                border
                style="width: 100%">
                <el-table-column label="序号" align="center" width="70" fixed="left">
                    <template slot-scope="scope"><span>{{scope.$index+(currentPage - 1) * pageSize + 1}} </span></template>
                </el-table-column>
                <el-table-column
                    prop="faultTitle"
                    label="故障标题"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="状态"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="faultApplication"
                    label="故障应用"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="linkman"
                    label="联系人"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="linkPhone"
                    label="联系方式"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="createdTime"
                    label="创建时间"
                    width="150">
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                        <el-button  @click.stop="deal" type="text" size="small" >处理</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!--处理故障单对话框-->
            <el-dialog
                title="处理故障单"
                :visible.sync="dealDialog"
                width="35%"
                :before-close="handleClose">
                <template>
                    <el-form :model="ruleForm" ref="ruleForm">
                        <el-form-item label="处理结果:" label-width="120px" prop="dealResult" >
                            <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="ruleForm.dealResult" autocomplete="off" style="width: 80%;"></el-input>
                        </el-form-item>
                        <el-form-item style="text-align: center">
                            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                            <el-button @click="resetForm('ruleForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </template>
                <template :data="choosedRow">
                    <el-divider>故障单详情</el-divider>
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="6"><div class="grid-content ">故障标题</div></el-col>
                        <el-col :span="12"><div class="grid-content ">{{choosedRow.faultTitle}}</div></el-col>
                    </el-row>
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="6"><div class="grid-content ">故障内容</div></el-col>
                        <el-col :span="12"><div class="grid-content ">{{choosedRow.content}}</div></el-col>
                    </el-row>
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="6"><div class="grid-content ">故障应用</div></el-col>
                        <el-col :span="12"><div class="grid-content ">{{choosedRow.faultApplication}}</div></el-col>
                    </el-row>
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="6"><div class="grid-content ">故障时间</div></el-col>
                        <el-col :span="12"><div class="grid-content ">{{choosedRow.createdTime}}</div></el-col>
                    </el-row>
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="6"><div class="grid-content">联系人</div></el-col>
                        <el-col :span="12"><div class="grid-content ">{{choosedRow.linkman}}</div></el-col>
                    </el-row>
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="6"><div class="grid-content ">联系方式</div></el-col>
                        <el-col :span="12"><div class="grid-content ">{{choosedRow.linkPhone}}</div></el-col>
                    </el-row>
                </template>
                <template>
                    <el-divider>操作日志</el-divider>
                    <template >
                        <el-steps :active="3" direction="vertical" style="margin-left: 50px;">
                            <el-step  icon="el-icon-s-help" v-for="(item,i) in faultList" :key="item.id" :description="item.name+' '+item.time+' '+item.reason"></el-step>
                        </el-steps>
                    </template>
                </template>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dealDialog = false">取 消</el-button>
                    <el-button type="primary" @click="dealDialog = false">确 定</el-button>
                </span>
            </el-dialog>

            <!--查看故障单对话框-->
            <el-dialog
                class="el-dialog__body"
                title="查看故障单"
                :visible.sync="showDialog"
                width="35%"
                :before-close="handleClose">
                <template :data="choosedRow">
                    <el-divider>故障单详情</el-divider>
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="6"><div class="grid-content ">故障标题</div></el-col>
                        <el-col :span="12"><div class="grid-content ">{{choosedRow.faultTitle}}</div></el-col>
                    </el-row>
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="6"><div class="grid-content ">故障内容</div></el-col>
                        <el-col :span="12"><div class="grid-content ">{{choosedRow.content}}</div></el-col>
                    </el-row>
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="6"><div class="grid-content ">故障应用</div></el-col>
                        <el-col :span="12"><div class="grid-content ">{{choosedRow.faultApplication}}</div></el-col>
                    </el-row>
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="6"><div class="grid-content ">故障时间</div></el-col>
                        <el-col :span="12"><div class="grid-content ">{{choosedRow.createdTime}}</div></el-col>
                    </el-row>
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="6"><div class="grid-content">联系人</div></el-col>
                        <el-col :span="12"><div class="grid-content ">{{choosedRow.linkman}}</div></el-col>
                    </el-row>
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="6"><div class="grid-content ">联系方式</div></el-col>
                        <el-col :span="12"><div class="grid-content ">{{choosedRow.linkPhone}}</div></el-col>
                    </el-row>
                </template>
                <template>
                    <el-divider>操作日志</el-divider>
                        <template >
                            <el-steps :active="3" direction="vertical" style="margin-left: 50px;">
                                <el-step  icon="el-icon-s-help" v-for="(item,i) in faultList" :key="item.id" :description="item.name+' '+item.time+' '+ item.reason"></el-step>
                            </el-steps>
                        </template>
                </template>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="showDialog = false">取 消</el-button>
                    <el-button type="primary" @click="showDialog = false">确 定</el-button>
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
        name: 'baseform',
        data: function(){
            return {
                tableData: [
                    {
                       faultTitle:'首页报错1',
                       status:'状态1',
                       faultApplication:'F-ABC',
                       linkman:'某某1',
                       linkPhone:'18557131766',
                       createdTime:'2019-08-07 16:30:00',
                       content:'这是一个报错啦啦啦'
                    },
                    {
                        faultTitle:'首页报错2',
                        status:'状态2',
                        faultApplication:'F-ABC',
                        linkman:'某某1',
                        linkPhone:'18557131766',
                        createdTime:'2019-08-07 16:30:00',
                        content:'这是一个报错啦啦啦'
                    },
                    {
                        faultTitle:'首页报错3',
                        status:'状态3',
                        faultApplication:'F-ABC',
                        linkman:'某某1',
                        linkPhone:'18557131766',
                        createdTime:'2019-08-07 16:30:00',
                        content:'这是一个报错啦啦啦'

                    },
                    {
                        faultTitle:'首页报错4',
                        status:'状态4',
                        faultApplication:'F-ABC',
                        linkman:'某某1',
                        linkPhone:'18557131766',
                        createdTime:'2019-08-07 16:30:00',
                        content:'这是一个报错啦啦啦'
                    },
                ],
                total:4,
                pageSize:2,
                currentPage:1,
                selectWord: "",
                applicationOptions: [{
                    value: 'F-ABC',
                    label: 'F-ABC'
                }, {
                    value: 'F-CDE',
                    label: 'F-CDE'
                }],
                statusOptions:[
                    {
                        value: '已处理',
                        label: '已处理'
                    }, {
                        value: '未处理',
                        label: '未处理'
                    }
                ],
                value1: '',
                value2: '',
                index:-1,
                choosedRow:{},
                showDialog: false,
                dealDialog:false,
                ruleForm:{
                 dealResult:''
                },
                faultList:[
                    {
                        id:1,
                        name:'1号',
                        time:'2019-08-12 00：00：00',
                        reason:'故障上报'
                    },
                    {
                        id:2,
                        name:'2号',
                        time:'2019-08-12 00：00：00',
                        reason:'故障上报'
                    },
                    {
                        id:3,
                        name:'3号',
                        time:'2019-08-12 00：00：00',
                        reason:'故障上报'
                    }
                ]
            }
        },
        created() {
            this.getData();
        },
        methods: {
            onSubmit() {
                this.$message.success('提交成功！');
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

//          点击某一行跳出查看弹框
            rollClick(row){
                console.log('被点击的行',this.tableData[row.index]);
                this.choosedRow = this.tableData[row.index];
//                this.choosedRow =   this.$axios
//                    .post(url,{
//                        rowIndex:row.index
//                    })
//                    .then(function (response) {
//                        alert('success!')
//                    });

                this.showDialog = true;

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
            },

            deal(){
                console.log('点击按钮');
                this.dealDialog = true
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

//            表单重置
            resetForm(formName) {
                this.$refs[formName].resetFields();
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
