<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <template>
                    <el-select
                        v-model="status"
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
                <el-input v-model="selectWord" placeholder="搜索标题" class="handle-input mr10" style="width: 150px"></el-input>
                <!--<el-button type="primary" icon="search" >搜索</el-button>-->
                <el-button icon="el-icon-search"  @click="search" type="info"></el-button>
            </div>
            <el-table
                :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                @click.stop ="true"
                border
                style="width: 100%">
                <el-table-column label="序号" align="center" width="70" fixed="left">
                    <template slot-scope="scope"><span>{{scope.$index+(currentPage - 1) * pageSize + 1}} </span></template>
                </el-table-column>
                <el-table-column
                    prop="title"
                    label="标题"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="状态"
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
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="createdTime"
                    label="创建时间"
                    width="200">
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="80">
                    <template slot-scope="scope">
                        <el-button  @click.stop="show" type="text" size="medium" ><i class="el-icon-info" style="font-size: 17px"></i></el-button>
                        <el-button  @click.stop="confirmDialog = true" type="text" size="medium" ><i class="el-icon-success" style="font-size: 17px"></i></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!--查看报备单-->
            <el-dialog
                title="查看报备单"
                :visible.sync="showDialog"
                width="35%"
                :before-close="handleClose">
                <template :data="choosedRow">
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="6"><div class="grid-content ">标题</div></el-col>
                        <el-col :span="12"><div class="grid-content ">{{choosedRow.title}}</div></el-col>
                    </el-row>
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="6"><div class="grid-content ">内容</div></el-col>
                        <el-col :span="12"><div class="grid-content ">{{choosedRow.content}}</div></el-col>
                    </el-row>
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="6"><div class="grid-content ">期望时间</div></el-col>
                        <el-col :span="12"><div class="grid-content ">{{choosedRow.expectedTime}}</div></el-col>
                    </el-row>
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="6"><div class="grid-content">联系人</div></el-col>
                        <el-col :span="12"><div class="grid-content ">{{choosedRow.linkMan}}</div></el-col>
                    </el-row>
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="6"><div class="grid-content ">联系方式</div></el-col>
                        <el-col :span="12"><div class="grid-content ">{{choosedRow.linkPhone}}</div></el-col>
                    </el-row>
                </template>
            </el-dialog>


            <!--确认报备单-->
            <el-dialog
                title="确认报备单"
                :visible.sync="confirmDialog"
                width="35%"
                :before-close="handleClose">
                <template :data="choosedRow">
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="6"><div class="grid-content ">标题</div></el-col>
                        <el-col :span="12"><div class="grid-content ">{{choosedRow.title}}</div></el-col>
                    </el-row>
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="6"><div class="grid-content ">内容</div></el-col>
                        <el-col :span="12"><div class="grid-content ">{{choosedRow.content}}</div></el-col>
                    </el-row>
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="6"><div class="grid-content ">期望时间</div></el-col>
                        <el-col :span="12"><div class="grid-content ">{{choosedRow.expectedTime}}</div></el-col>
                    </el-row>
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="6"><div class="grid-content">联系人</div></el-col>
                        <el-col :span="12"><div class="grid-content ">{{choosedRow.linkMan}}</div></el-col>
                    </el-row>
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="6"><div class="grid-content ">联系方式</div></el-col>
                        <el-col :span="12"><div class="grid-content ">{{choosedRow.linkPhone}}</div></el-col>
                    </el-row>
                </template>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="confirmDialog = false">取 消</el-button>
                    <el-button type="primary" @click="confirm">确认报备单</el-button>
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
        name: 'reportConfirm',
        data: function(){
            return {
                //分页相关
                total:4,
                pageSize:2,
                currentPage:1,


                //搜索
                status:'',
                statusOptions:[
                    {
                        value: '0',
                        label: '待确认'
                    }, {
                        value: '1',
                        label: '已确认'
                    }
                ],
                selectWord: "",

                //表格
                tableData: [
                    {
                        title:'首页报错1',
                        status:'状态1',
                        linkman:'某某1',
                        linkPhone:'18557131766',
                        createdTime:'2019-08-07 16:30:00'
                    },
                    {
                        title:'首页报错1',
                        status:'状态1',
                        linkman:'某某1',
                        linkPhone:'18557131766',
                        createdTime:'2019-08-07 16:30:00'
                    },
                    {
                        title:'首页报错1',
                        status:'状态1',
                        linkman:'某某1',
                        linkPhone:'18557131766',
                        createdTime:'2019-08-07 16:30:00'
                    },
                    {
                        title:'首页报错1',
                        status:'状态1',
                        linkman:'某某1',
                        linkPhone:'18557131766',
                        createdTime:'2019-08-07 16:30:00'
                    }
                ],

                //查看报备单详情
                choosedRow:{
                    title:'标题1',
                    content:'内容1',
                    expectedTime:'时间1',
                    linkMan:'联系人1',
                    linkPhone:'电话1',


                },
                showDialog:false,

                //确认报备单
                confirmDialog:false,

                index:-1,
                formLabelWidth:'120px',
                formInputWidth:'300px',

            }
        },
        created() {
            this.getData();
        },
        methods: {

            //获取表单初始数据
            getData() {
//                this.$axios
//                    .post("/ticket")
//                    .then(function (response) {
//                        console.log(response);
//                        this.tableData = response.records;
//                        this.total = response.total;
//                    });
            },


            //页码修改
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



            //搜索
            search(){
                console.log('状态框value',this.status);
                console.log('选择词value',this.selectWord);
//                var url= '';
//                var requestHead = {

//                    value2:this.value2,
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


            //点击操作 - 查看按钮
            show(){
                console.log('点击查看按钮');
                this.showDialog = true
            },


            //点击操作 - 确认按钮 - 确认
            confirm(){
                this.confirmDialog = false
            },


            //对话框关闭
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            }
        }
    }
</script>


<style>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-input {
        width: 150px;
        display: inline-block;
    }

    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }

    .el-dialog__body{
        padding-top: 40px;
    }

    .el-dialog {
        width:40%
    }

</style>
