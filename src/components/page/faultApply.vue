<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="search" @click="addDialog = true" style="width:100px">新增</el-button>
                <template>
                    <el-select v-model="applicationValue" placeholder="应用">
                        <el-option
                            v-for="item in applicationOptions"
                            :key="item.appId"
                            :label="item.chName"
                            :value="item.appId">
                        </el-option>
                    </el-select>
                    <el-select
                        v-model="statusValue"
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
                <el-input v-model="selectWord" placeholder="搜索故障标题" class="handle-input mr10" style="width: 150px"></el-input>
                <el-button icon="el-icon-search"  @click="search" type="info"></el-button>
            </div>
            <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                @row-click="showDetail"
                @click.stop ="true"
                border
                style="width: 100%">
                <el-table-column label="序号" align="center" width="70" fixed="left">
                    <template slot-scope="scope"><span>{{scope.$index+(currentPage - 1) * pageSize + 1}} </span></template>
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="faultTitle"
                    label="故障标题"
                    width="120">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="状态"
                    width="120">
                    <template slot-scope="scope">
                        <div v-if="tableData[scope.$index].status == 0">待处理</div>
                        <div v-if="tableData[scope.$index].status == 1">已处理</div>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="faultApplication"
                    label="故障应用"
                    width="120">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="linkMan"
                    label="联系人"
                    width="120">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="linkPhone"
                    label="联系方式"
                    width="120">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="createdTime"
                    label="创建时间"
                    width="">
                </el-table-column>
            </el-table>



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
                        <el-col :span="12"><div class="grid-content ">{{choosedRow.linkMan}}</div></el-col>
                    </el-row>
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="6"><div class="grid-content ">联系方式</div></el-col>
                        <el-col :span="12"><div class="grid-content ">{{choosedRow.linkPhone}}</div></el-col>
                    </el-row>
                </template>
                <template>
                    <el-divider>操作日志</el-divider>
                    <template >
                        <template >
                            <el-steps :active="3" direction="vertical" style="margin-left: 50px;">
                                <el-step icon="el-icon-s-help" v-for="(item,i) in faultJournal" :key="item.id" :description="item.remarks+'  '+item.time"></el-step>
                            </el-steps>
                        </template>
                    </template>
                </template>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="showDialog = false">取 消</el-button>
                    <el-button type="primary" @click="showDialog = false">确 定</el-button>
                </span>
            </el-dialog>

            <!--添加故障单对话框-->
            <el-dialog title="添加故障单" :visible.sync="addDialog" width="35%">
                <el-form :model="addForm"  :rules="addRules" >
                    <el-form-item label="故障标题" :label-width="formLabelWidth" prop="faultTitle">
                        <el-input v-model="addForm.faultTitle" autocomplete="off" style="width:250px" req></el-input>
                    </el-form-item>
                    <el-form-item label="故障内容" :label-width="formLabelWidth" prop="content">
                        <el-input type="textarea" v-model="addForm.content" style="width:250px"></el-input>
                    </el-form-item>
                    <el-form-item label="故障应用" :label-width="formLabelWidth" prop="faultApplication">
                        <el-select v-model="addForm.faultApplication" placeholder="请选择故障应用" style="width:250px">
                            <el-option
                            v-for="item in applicationOptions"
                            :key="item.chName"
                            :label="item.chName"
                            :value="item.chName">
                        </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="故障时间" :label-width="formLabelWidth" prop="createdTime">
                        <el-date-picker
                            style="width:250px"
                            v-model="addForm.createdTime"
                            type="datetime"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item  label="联系人" :label-width="formLabelWidth" prop="linkMan">
                        <el-input v-model="addForm.linkMan" autocomplete="off" style="width:250px"></el-input>
                    </el-form-item>
                    <el-form-item label="联系方式" :label-width="formLabelWidth" prop="linkPhone">
                        <el-input v-model="addForm.linkPhone" autocomplete="off" style="width:250px"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="addDialog = false">取消</el-button>
                    <el-button type="primary" @click="addRecord">确认上报</el-button>
                </div>
            </el-dialog>


            <div style="text-align: center;margin-top: 30px;">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total='total'
                    :page-size="pageSize"
                    @current-change="currentChange">
                </el-pagination>
            </div>


        </div>
    </div>
</template>


<script>
export default {
  name: "editor",
  data: function() {
    return {
      //分页相关
      total: 1,
      pageSize: 10,
      currentPage: 1,

      //新增故障报备
      addDialog: false,
      addForm: {
        faultTitle: "",
        content: "",
        faultApplication: "",
        createdTime: "",
        linkMan: "",
        linkPhone: ""
      },
      addRules: {
        faultTitle: [
          { required: true, message: "请输入故障标题", trigger: "blur" }
        ],
        content: [
          { required: true, message: "请输入故障内容", trigger: "blur" }
        ],
        faultApplication: [
          { required: true, message: "请选择故障应用", trigger: "change" }
        ],
        createdTime: [
          { required: true, message: "请选择故障时间", trigger: "change" }
        ],
        linkMan: [{ required: true, message: "请输入联系人", trigger: "blur" }],
        linkPhone: [
          { required: true, message: "请输入联系电话", trigger: "blur" }
        ]
      },

      //条件筛选
      applicationValue: "",
      statusValue: "",
      selectWord: "",
      applicationOptions: [],
      statusOptions: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "0",
          label: "已处理"
        },
        {
          value: "1",
          label: "未处理"
        }
      ],

      //                表格
      tableData: [],

      //查看报备单详情
      choosedRow: {},
      showDialog: false,
      faultJournal: [],

      index: -1,
      formLabelWidth: "120px",
      formInputWidth: "300px"
    };
  },
  created() {
    this.getData();
  },
  methods: {
    //获取表单初始数据
    getData() {
      this.$axios
        .get(
          "/api/api/userfaultInfo?pageNum=" +
            this.currentPage +
            "&status=" +
            this.statusValue +
            "&faultApplication=" +
            this.applicationValue +
            "&faultTitle=" +
            this.selectWord
        )
        .then(response => {
          if (response.status === 200) {
            this.tableData = response.data.records;
            this.total = response.data.total;
          }
        });

      this.$axios
        .post(
          "/api/api/getInfo?pageNum=" +
            1 +
            "&department=" +
            "" +
            "&enName=" +
            ""
        )
        .then(response => {
          if (response.status === 200) {
            console.log(response.data.records);
            this.applicationOptions = response.data.records;
            let temp1 = {
              appId: "",
              chName: "全部"
            };
            this.applicationOptions.push(temp1);
          }
        });
    },

    //分页跳转
    currentChange(currentPage) {
      console.log("现在所在的页", currentPage);
      this.currentPage = currentPage;
      this.getData();
    },

    //添加故障单
    addRecord() {
      console.log(this.addForm);
      const formData = this.addForm;
      this.$axios.post("/api/api/faultInfoSub", formData).then(response => {
        if (response.status === 200) {
          this.getData();
          this.addDialog = false;
        }
      });
      this.addDialog = false;
      console.log("确认上报");
    },

    // 根据条件搜索
    search() {
      console.log(
        this.applicationValue + "," + this.statusValue + "," + this.selectWord
      );
      this.getData();
    },

    //查看详细信息

    showDetail(row) {
      console.log("查看报备单详情：被点击的行", this.tableData[row.index]);
      const rowData = this.tableData[row.index];
      this.choosedRow = rowData;
      this.faultJournal = [
        {
          time: rowData.createdTime,
          remarks: "故障产生"
        },
        {
          time: rowData.submitedTime,
          remarks: "故障表单产生"
        }
      ];
      if (rowData.handledTime !== null) {
        this.faultJournal.push({
          time: rowData.handledTime,
          remarks: "故障表单结束"
        });
      }
      this.showDialog = true;
    },
    tableRowClassName({ row, rowIndex }) {
      //把每一行的索引放进row
      row.index = rowIndex;
    },

    //处理对话框的关闭
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  }
};
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

.el-dialog__body {
  padding-top: 0px;
}

.el-dialog {
  width: 40%;
}
</style>
