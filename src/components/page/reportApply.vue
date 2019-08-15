<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="search" @click="addDialog = true" style="width:100px;margin-right: 350px;">新增</el-button>
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
                :data="tableData"
                @click.stop ="true"
                border
                style="width: 100%"
                ref="multipleTable">
                <el-table-column label="序号" align="center" width="70" fixed="left">
                    <template slot-scope="scope"><span>{{scope.$index+1}} </span></template>
                </el-table-column>
                <el-table-column
                    prop="malCap"
                    label="标题"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="malState"
                    label="状态"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="contact"
                    label="联系人"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="tel"
                    label="联系方式"
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="repTime"
                    label="创建时间"
                    width="">
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="80">
                    <template slot-scope="scope">
                        <el-button  @click.stop="show(scope.$index, scope.row)" type="text" size="medium" ><i class="el-icon-info" style="font-size: 17px"></i></el-button>
                        <el-button  @click.stop="rollback(scope.$index, scope.row)" type="text" size="medium" ><i class="el-icon-refresh" style="font-size: 17px"></i></el-button>
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
                        <el-col :span="12"><div class="grid-content ">{{choosedRow.malCap}}</div></el-col>
                    </el-row>
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="6"><div class="grid-content ">内容</div></el-col>
                        <el-col :span="12"><div class="grid-content ">{{choosedRow.content}}</div></el-col>
                    </el-row>
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="6"><div class="grid-content ">期望时间</div></el-col>
                        <el-col :span="12"><div class="grid-content ">{{choosedRow.hopeTime}}</div></el-col>
                    </el-row>
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="6"><div class="grid-content">联系人</div></el-col>
                        <el-col :span="12"><div class="grid-content ">{{choosedRow.contact}}</div></el-col>
                    </el-row>
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="6"><div class="grid-content ">联系方式</div></el-col>
                        <el-col :span="12"><div class="grid-content ">{{choosedRow.tel}}</div></el-col>
                    </el-row>
                </template>
            </el-dialog>


            <!--撤销报备单-->
            <el-dialog
                title="撤销报备单"
                :visible.sync="rollbackDialog"
                width="35%"
                :before-close="handleClose">
                <template :data="choosedRow">
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="6"><div class="grid-content ">标题</div></el-col>
                        <el-col :span="12"><div class="grid-content ">{{choosedRow.malCap}}</div></el-col>
                    </el-row>
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="6"><div class="grid-content ">内容</div></el-col>
                        <el-col :span="12"><div class="grid-content ">{{choosedRow.content}}</div></el-col>
                    </el-row>
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="6"><div class="grid-content ">期望时间</div></el-col>
                        <el-col :span="12"><div class="grid-content ">{{choosedRow.hopeTime}}</div></el-col>
                    </el-row>
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="6"><div class="grid-content">联系人</div></el-col>
                        <el-col :span="12"><div class="grid-content ">{{choosedRow.contact}}</div></el-col>
                    </el-row>
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="6"><div class="grid-content ">联系方式</div></el-col>
                        <el-col :span="12"><div class="grid-content ">{{choosedRow.tel}}</div></el-col>
                    </el-row>
                </template>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="rollbackDialog = false">取 消</el-button>
                    <el-button type="primary" @click="rollbackConfirm">确认撤销</el-button>
                </span>
            </el-dialog>




            <!--添加报备单-->
            <el-dialog title="添加报备单" :visible.sync="addDialog" width="35%">
                <el-form :model="addForm"  :rules="addRules" >
                    <el-form-item label="标题" :label-width="formLabelWidth" prop="title">
                        <el-input v-model="addForm.malCap" autocomplete="off" style="width:250px" req></el-input>
                    </el-form-item>
                    <el-form-item label="内容" :label-width="formLabelWidth" prop="content">
                        <el-input type="textarea" v-model="addForm.content" style="width:250px"></el-input>
                    </el-form-item>
                    <el-form-item label="期望时间" :label-width="formLabelWidth" prop="time">
                        <el-date-picker
                            style="width:250px"
                            v-model="addForm.hopeTime"
                            type="datetime"
                            placeholder="选择期望日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item  label="联系人" :label-width="formLabelWidth" prop="linkMan">
                        <el-input v-model="addForm.contact" autocomplete="off" style="width:250px"></el-input>
                    </el-form-item>
                    <el-form-item label="联系方式" :label-width="formLabelWidth" prop="linkPhone">
                        <el-input v-model="addForm.tel" autocomplete="off" style="width:250px"></el-input>
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
                    :total='tableData.length'
                    :page-size="pageSize"
                    @current-change="currentChange">
                </el-pagination>
            </div>


        </div>
    </div>
</template>


<script>
import convert_FormData_to_json2 from "../page/other";
export default {
  inject: ["reload"],
  name: "editor",
  data: function() {
    return {
      //分页相关
      pageSize: 10,
      currentPage: 1,

      //添加报备单
      addDialog: false,
      addForm: [],
      addRules: {
        title: [{ required: true, message: "请输入故障标题", trigger: "blur" }],
        content: [
          { required: true, message: "请输入故障内容", trigger: "blur" }
        ],
        application: [
          { required: true, message: "请选择故障应用", trigger: "change" }
        ],
        time: [
          { required: true, message: "请选择故障时间", trigger: "change" }
        ],
        linkMan: [{ required: true, message: "请输入联系人", trigger: "blur" }],
        linkPhone: [
          { required: true, message: "请输入联系电话", trigger: "blur" }
        ]
      },

      //搜索
      status: "",
      statusOptions: [
        {
          value: 0,
          label: "已提交"
        },
        {
          value: 1,
          label: "已撤回"
        },
        {
          value: 2,
          label: "已完成"
        }
      ],
      selectWord: "",

      //表格
      tableData: [],

      //查看报备单详情
      choosedRow: {
        title: "标题1",
        content: "内容1",
        expectedTime: "时间1",
        linkMan: "联系人1",
        linkPhone: "电话1"
      },
      showDialog: false,

      //撤销报备单
      rollbackDialog: false,

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
      let config = {
        headers: {
          token: localStorage.getItem("token")
        }
      };

      this.$axios
        .get(
          "/api/api/coopReport?pageNum=" +
            this.currentPage +
            "&malState=" +
            this.status +
            "&malCap=" +
            this.selectWord,
          config
        )
        .then(response => {
          console.log(response);
          console.log(response.data.records);
          this.tableData = response.data.records;
          console.log(this.tableData);
        });
    },

    //页码修改
    currentChange(val) {
      this.cur_page = val;
      this.getData();
    },

    //新增-确认上报
    addRecord(value) {
      let formData = new FormData();

      formData.append("malCap", this.addForm.malCap);
      formData.append("content", this.addForm.content);

      let month = this.addForm.hopeTime.getMonth() + 1;
      if (month < 10) {
        month = "0" + month;
      }
      let date = this.addForm.hopeTime.getDate();
      if (date < 10) {
        date = "0" + date;
      }
      let hour = this.addForm.hopeTime.getHours();
      if (hour < 10) {
        hour = "0" + hour;
      }
      let minute = this.addForm.hopeTime.getMinutes();
      if (minute < 10) {
        minute = "0" + minute;
      }
      let second = this.addForm.hopeTime.getSeconds();
      if (second < 10) {
        second = "0" + second;
      }
      formData.append(
        "hopeTime",
        this.addForm.hopeTime.getFullYear() +
          "-" +
          month +
          "-" +
          date +
          " " +
          hour +
          ":" +
          minute +
          ":" +
          second
      );
      formData.append("contact", this.addForm.contact);
      formData.append("tel", this.addForm.tel);

      let config = {
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token")
        }
      };

      this.$axios
        .post(
          "/api/api/insertcoop",
          convert_FormData_to_json2(formData),
          config
        )
        .then(response => {
          if (response.status === 200) {
            this.addDialog = false;
          }
        });
    },

    //搜索
    search() {
      this.getData();
    },

    //点击操作 - 查看按钮
    show(index, row) {
      console.log("点击查看按钮");
      console.log(index);
      console.log(this.tableData[index]);
      this.choosedRow = this.tableData[index];
      this.showDialog = true;
    },

    //点击操作 - 撤销按钮 - 确认撤销
    rollback(index, row) {
      this.choosedRow = this.tableData[index];
      this.rollbackDialog = true;
    },
    rollbackConfirm() {
      let config = {
        headers: {
          token: localStorage.getItem("token")
        }
      };

      this.$axios
        .put("/api/api/reback/" + this.choosedRow.repId, config)
        .then(response => {
          this.$message({
            type: response.type,
            message: response.message
          });
          this.rollbackDialog = false
          this.getData();
        });
    },

    //对话框关闭
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
  padding-top: 40px;
}

.el-dialog {
  width: 40%;
}
</style>
