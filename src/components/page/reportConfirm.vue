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
                :data="tableData"
                @click.stop ="true"
                border
                style="width: 100%">
                <el-table-column label="序号" align="center" width="70" fixed="left">
                    <template slot-scope="scope"><span>{{scope.$index+(currentPage - 1) * pageSize + 1}} </span></template>
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="malCap"
                    label="标题"
                    width="120">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="状态"
                    width="120">
                    <template slot-scope="scope">
                        <div v-if="tableData[scope.$index].malState == 0">待确认</div>
                        <div v-if="tableData[scope.$index].malState == 1">已撤销</div>
                        <div v-if="tableData[scope.$index].malState == 2">已确认</div>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="contact"
                    label="联系人"
                    width="120">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="tel"
                    label="联系方式"
                    width="150">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="repTime"
                    label="创建时间"
                    width="">
                </el-table-column>
                <el-table-column
                    align="center"
                    fixed="right"
                    label="操作"
                    width="80">
                    <template slot-scope="scope">
                        <el-button  @click.stop="show(scope.$index, scope.row)" type="text" size="medium" ><i class="el-icon-info" style="font-size: 17px"></i></el-button>
                        <el-button  v-if="tableData[scope.$index].malState == 0" @click.stop="confirm(scope.$index, scope.row)" type="text" size="medium" ><i class="el-icon-success" style="font-size: 17px"></i></el-button>
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


            <!--确认报备单-->
            <el-dialog
                title="确认报备单"
                :visible.sync="confirmDialog"
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
                    <el-button @click="confirmDialog = false">取 消</el-button>
                    <el-button type="primary" @click="commitConfirm">确认报备单</el-button>
                </span>
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
import convert_FormData_to_json2 from "../page/other";
export default {
  name: "reportConfirm",
  data: function() {
    return {
      //分页相关
      total: 1,
      pageSize: 10,
      currentPage: 1,

      //搜索
      status: "",
      statusOptions: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "0",
          label: "待确认"
        },
        {
          value: "1",
          label: "已确认"
        }
      ],
      selectWord: "",

      //表格
      tableData: [],

      //查看报备单详情
      choosedRow: [],
      showDialog: false,

      //确认报备单
      confirmDialog: false,

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
          this.total = response.data.total;
        });
    },

    //页码修改
    currentChange(currentPage) {
      console.log("现在所在的页", currentPage);
      console.log(
        "现在所在的页",
        this.tableData.slice(
          (currentPage - 1) * this.pageSize,
          currentPage * this.pageSize
        )
      );
      this.currentPage = currentPage;
    },

    //搜索
    search() {
      this.getData();
    },

    //点击操作 - 查看按钮
    show(index, row) {
      this.choosedRow = this.tableData[index];
      this.showDialog = true;
    },

    //点击操作 - 确认按钮 - 确认
    confirm(index, row) {
      this.choosedRow = this.tableData[index];
      this.confirmDialog = true;
    },

    commitConfirm() {
      let config = {
        headers: {
          token: localStorage.getItem("token")
        }
      };

      this.$axios
        .put("/api/api/admin/confirmrep/" + this.choosedRow.repId, config)
        .then(response => {
          this.$message({
            type: response.type,
            message: response.message
          });
          this.confirmDialog = false
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
