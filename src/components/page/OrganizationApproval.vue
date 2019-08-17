<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 组织审批</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="select_cate" placeholder="审批状态" class="handle-select mr10">
                    <el-option key="0" label="待审核" value="0"></el-option>
                    <el-option key="1" label="审核通过" value="1"></el-option>
                    <el-option key="2" label="审核未通过" value="2"></el-option>
                </el-select>
                <el-input v-model="select_word" placeholder="搜索组织名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="applyData" border style="width: 100%" ref="multipleTable" >
                <el-table-column align="center" width="55" fixed="left">
                    <template slot-scope="scope">
                        <div>{{scope.$index+1}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="orgApplyId" label="申请单" align="center" width="170">
                </el-table-column>
                <el-table-column label="审批状态" align="center" width="170">
                    <template slot-scope="scope">
                        <div v-if="applyData[scope.$index].state == 0">待审核</div>
                        <div v-if="applyData[scope.$index].state == 1">审核通过</div>
                        <div v-if="applyData[scope.$index].state == 2">审核未通过</div>
                    </template>
                </el-table-column>
                <el-table-column prop="orgName" label="组织名称" align="center" width="170">
                </el-table-column>
                <el-table-column prop="applyPerson" label="申请人员" align="center" width="170">
                </el-table-column>
                <el-table-column prop="applyType" label="申请类型" align="center" width="170">
                </el-table-column>
                <el-table-column prop="applyTime" label="创建时间" align="center" width="291">
                </el-table-column>
                <el-table-column label="操作" align="center" width="100" fixed="right">
                    <template slot-scope="scope">
                        <el-button v-show="applyData[scope.$index].state == 0" size="small" @click="handleEdit(scope.$index, scope.row)">审批</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    @current-change="handleCurrentChange"
                    layout="prev, pager, next"
                    :page-size="pagesize"
                    :total="total">
                </el-pagination>
            </div>
        </div>

        <!-- 审批新增单 -->
        <el-dialog title="审批新增单" :visible.sync="applyAddVisible" width="35%">
            <div style="text-align: right">
                <el-button type="danger" icon="search" @click="deleteVisible = true">拒绝</el-button>
                <el-button type="primary" icon="search" @click="editVisible = true">同意</el-button>
            </div>
            <template>
                <el-divider>组织详情</el-divider>
            </template>
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="组织名称">
                    {{form.orgName}}
                </el-form-item>
                <el-form-item label="组织类型">
                    {{form.type}}
                </el-form-item>
                <el-form-item label="组织描述">
                    <el-input type="textarea" rows="5" v-model="form.orgDesc"></el-input>
                </el-form-item>

                <template>
                    <el-divider>申请单</el-divider>
                </template>

                <el-form-item label="申请单：">
                    {{form.orgApplyId}}
                </el-form-item>
                <el-form-item label="申请人：">
                    {{form.applyPerson}}
                </el-form-item>
                <el-form-item label="申请时间：">
                    {{form.applyTime}}
                </el-form-item>
                <el-form-item label="申请描述">
                    <el-input type="textarea" rows="5" v-model="form.applyDesc"></el-input>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 审批修改单 -->
        <el-dialog title="审批修改单" :visible.sync="applyEditVisible" width="55%">
            <div style="text-align: right">
                <el-button type="danger" icon="search" @click="deleteVisible = true">拒绝</el-button>
                <el-button type="primary" icon="search" @click="editVisible = true">同意</el-button>
            </div>

            <template>
                <el-divider>组织详情</el-divider>
            </template>
            <el-form ref="form" :model="form" label-width="100px">

                <el-row type="flex" class="row-bg" justify="center">
                    <el-col :span="13">
                        <el-row>
                            <el-form-item label="组织编号">
                                {{form.orgId}}
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="组织名称">
                                {{form.oldOrgName}}
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="组织类型">
                                {{form.oldOrgType}}
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="组织描述">
                                <el-input type="textarea" rows="5" v-model="form.oldOrgDesc"></el-input>
                            </el-form-item>
                        </el-row>
                    </el-col>
                    <el-col :span="13">
                        <el-row>
                            <el-form-item label="组织编号">
                                {{form.orgId}}
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="组织名称">
                                {{form.orgName}}
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="组织类型">
                                {{form.type}}
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="组织描述">
                                <el-input type="textarea" rows="5" v-model="form.orgDesc"  ></el-input>
                            </el-form-item>
                        </el-row>
                    </el-col>
                </el-row>


                <template>
                    <el-divider>申请单</el-divider>
                </template>

                <el-form-item label="申请单">
                    {{form.orgApplyId}}
                </el-form-item>
                <el-form-item label="申请人">
                    {{form.applyPerson}}
                </el-form-item>
                <el-form-item label="申请时间">
                    {{form.applyTime}}
                </el-form-item>
                <el-form-item label="申请描述">
                    <el-input type="textarea" rows="5" v-model="form.applyDesc" ></el-input>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 同意提示框 -->
        <el-dialog title="提示" :visible.sync="editVisible" width="300px" center>
            <div class="del-dialog-cnt">是否确定修改？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit(true)">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 拒绝提示框 -->
        <el-dialog title="提示" :visible.sync="deleteVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit(false)">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import convert_FormData_to_json2 from "../page/other";
import ElCol from "element-ui/packages/col/src/col";

export default {
    components: {ElCol},
    inject: ["reload"],
  name: "basetable",
  data() {
    return {
      url: "./static/vuetable.json",
      cur_page: 1,
      multipleSelection: [],
      select_cate: "",
      total: 1,
      select_word: "",
      applyEditVisible: false,
      applyAddVisible: false,
      editVisible: false,
      deleteVisible: false,
      addVisible: false,
      applyData: [],
      masterData: [],
      form: {},
      form1: {},
      pagesize: 10,
      idx: -1
    };
  },
  created() {
    this.getData();
  },
  methods: {
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    // 获取 easy-mock 的模拟数据
    getData() {
      let config = {
        headers: {
          "token": localStorage.getItem("token")
        }
      };

      this.$axios
        .get(
          "/api/api/orgApply?pageNum=" +
            this.cur_page +
            "&state=" +
            this.select_cate +
            "&orgName=" +
            this.select_word,
            config
        )
        .then(response => {
          if (response.status === 200) {
            this.applyData = response.data.records;
            console.log(this.applyData);
            this.total = response.data.total;
          }
        });

      this.$axios.get("/api/api/isAdmin", config).then(response => {
        if (response.status === 200) {
          this.masterData = response.data;
          console.log(this.masterData);
        }
      });
    },
    search() {

      let config = {
        headers: {
          "token": localStorage.getItem("token")
        }
      };

      this.$axios
        .get(
          "/api/api/orgApply?pageNum=" +
            this.cur_page +
            "&state=" +
            this.select_cate +
            "&orgName=" +
            this.select_word,
            config
        )
        .then(response => {
          if (response.status === 200) {
            this.applyData = response.data.records;
            console.log(this.applyData);
          }
        });
    },
    handleEdit(index, row) {
      this.idx = index;
      const item = this.applyData[index];

      this.form = item;
      console.log(this.form);

      let config = {
        headers: {
          "token": localStorage.getItem("token")
        }
      };

      if (item.applyType == "新建") {
        this.applyAddVisible = true;
      } else {
        this.$axios.get("/api/api/orgInfo/" + 1, config).then(response => {
          if (response.status === 200) {
            this.form1 = response.data;
            this.form.oldOrgName = this.form1.orgName;
            this.form.oldOrgType = this.form1.type;
            this.form.oldOrgDesc = this.form1.orgDesc;

            this.applyEditVisible = true;
          }
        });
      }
    },
    submit(flag) {
      let formData = new FormData();

      console.log(flag);

      formData.append("isAgree", flag);

      let config = {
        headers: {
          "Content-Type": "application/json",
          "token": localStorage.getItem("token")
        }
      };
      this.$axios
        .put(
          "/api/api/admin/confirm/" + this.form.orgApplyId,
          convert_FormData_to_json2(formData),
          config
        )
        .then(response => {
          if (response.status === 200) {
            this.$message({
              type: response.type,
              message: response.message
            });
            this.addVisible = false;
            this.reload();
          } else {
            this.$message({
              type: "error",
              message: response.message
            });
          }
        });
    }
  }
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
</style>
