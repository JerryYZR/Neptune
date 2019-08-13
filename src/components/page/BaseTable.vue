<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 组织管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="addVisible=true">新增</el-button>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="corporationData" border style="width: 100%" ref="multipleTable"  @selection-change="handleSelectionChange">
                <el-table-column align="center" width="55">
                    <template slot-scope="scope">
                        <div>{{scope.$index+1}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="orgId" label="组织编号" align="center" width="170">
                </el-table-column>
                <el-table-column prop="orgName" label="组织名称" align="center" width="170">
                </el-table-column>
                <el-table-column prop="orgType" label="组织类型" align="center" width="170">
                </el-table-column>
                <el-table-column prop="createPerson" label="创建人员" align="center" width="170">
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center" width="291">
                </el-table-column>
                <el-table-column label="操作" align="center" width="250">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination 
                    @current-change="handleCurrentChange" 
                    layout="prev, pager, next" 
                    :page-size="pagesize" 
                    :total="corporationData.length">
                </el-pagination>
            </div>
        </div>

        <!-- 添加弹出框 -->
        <el-dialog title="添加组织" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="组织名称">
                    <el-input v-model="form.orgName"></el-input>
                </el-form-item>
                <el-form-item label="组织类型">
                    <el-select v-model="form.type" placeholder="请选择">
                        <el-option key="总行" label="总行" value="总行"></el-option>
                        <el-option key="分行" label="分行" value="分行"></el-option>
                        <el-option key="行外" label="行外" value="行外"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="组织描述">
                    <el-input type="textarea" rows="5" v-model="form.orgDesc"></el-input>
                </el-form-item>
                <el-form-item label="审批人">
                    <el-select v-model="form.auditor" placeholder="请选择">
                        <el-option
                            v-for="(item,index) in masterData"
                            :key="index"
                            :label="item.userId + ' ' +item.nickname"
                            :value="item.userId"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请描述">
                    <el-input type="textarea" rows="5" v-model="form.applyDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCorporationVisible=true">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 添加提示框 -->
        <el-dialog title="提示" :visible.sync="addCorporationVisible" width="300px" center>
            <div class="del-dialog-cnt">是否确定添加？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCorporationVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitAdd">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑组织" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="组织编号">
                    {{form.orgId}}
                </el-form-item>
                <el-form-item label="组织名称">
                    <el-input v-model="form.orgName"></el-input>
                </el-form-item>
                <el-form-item label="组织类型">
                    <el-select v-model="form.type" placeholder="请选择">
                        <el-option key="总行" label="总行" value="总行"></el-option>
                        <el-option key="分行" label="分行" value="分行"></el-option>
                        <el-option key="行外" label="行外" value="行外"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="组织描述">
                    <el-input type="textarea" rows="5" v-model="form.orgDesc"></el-input>
                </el-form-item>
                <el-form-item label="审批人">
                    <el-select v-model="form.auditor" placeholder="请选择">
                        <el-option
                            v-for="(item,index) in masterData"
                            :key="index"
                            :label="item.userId + ' ' +item.nickname"
                            :value="item.userId"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请描述">
                    <el-input type="textarea" rows="5" v-model="form.applyDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="editCorporationVisible=true">提交申请</el-button>
            </span>
        </el-dialog>

        <!-- 删除弹出框 -->
        <el-dialog title="删除组织" :visible.sync="delVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="组织编号">
                    {{form.orgId}}
                </el-form-item>
                <el-form-item label="组织名称">
                    {{form.orgName}}
                </el-form-item>
                <el-form-item label="组织描述">
                    {{form.orgDesc}}
                </el-form-item>
                <el-form-item label="审批人">
                    <el-select v-model="form.auditor" placeholder="请选择">
                        <el-option
                            v-for="(item,index) in masterData"
                            :key="index"
                            :label="item.userId + ' ' +item.nickname"
                            :value="item.userId"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请描述">
                    <el-input type="textarea" rows="5" v-model="form.applyDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteCorporationVisible=true">提交申请</el-button>
            </span>
        </el-dialog>

        <!-- 修改提示框 -->
        <el-dialog title="提示" :visible.sync="editCorporationVisible" width="300px" center>
            <div class="del-dialog-cnt">是否确定修改？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCorporationVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="deleteCorporationVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteCorporationVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitDelete">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import convert_FormData_to_json2 from "../page/other";
export default {
  inject: ["reload"],
  name: "basetable",
  data() {
    return {
      url: "./static/vuetable.json",
      cur_page: 1,
      multipleSelection: [],
      select_word: "",
      is_search: false,
      editVisible: false,
      delVisible: false,
      addVisible: false,
      addCorporationVisible: false,
      deleteCorporationVisible: false,
      editCorporationVisible: false,
      corporationData: [],
      masterData: [],
      form: {},
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
      this.$axios
        .get(
          "/api/api/orgInfo?pageNum=" +
            this.cur_page +
            "&orgName=" +
            this.select_word
        )
        .then(response => {
          if (response.status === 200) {
            this.corporationData = response.data.records;
            console.log(1);
            console.log(this.corporationData);
          }
        });

      this.$axios.get("/api/api/admin").then(response => {
        if (response.status === 200) {
          this.masterData = response.data;
          console.log(this.masterData);
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    search() {
      this.$axios
        .get(
          "/api/api/orgInfo?pageNum=" +
            this.cur_page +
            "&orgName=" +
            this.select_word
        )
        .then(response => {
          if (response.status === 200) {
            this.corporationData = response.data.records;
            console.log(1);
            console.log(this.corporationData);
          }
        });
    },
    handleEdit(index, row) {
      this.idx = index;
      const item = this.corporationData[index];
      this.form = {
        orgId: item.orgId,
        orgName: item.orgName,
        orgDesc: item.orgDesc,
        type: item.type,
        auditor: item.auditor,
        applyDesc: item.applyDesc
      };
      this.editVisible = true;
    },
    handleDelete(index, row) {
      this.idx = index;
      const item = this.corporationData[index];
      this.form = {
        orgId: item.orgId,
        orgName: item.orgName,
        orgDesc: item.orgDesc,
        type: item.type,
        auditor: item.auditor,
        applyDesc: item.applyDesc
      };
      this.delVisible = true;
    },
    submitAdd() {
      let formData = new FormData();

      formData.append("orgName", this.form.orgName);
      formData.append("type", this.form.type);
      formData.append("orgDesc", this.form.orgDesc);
      formData.append("auditor", this.form.auditor);
      formData.append("applyDesc", this.form.applyDesc);
      formData.append("applyType", "新建");
      formData.append("orgId", "");

      let config = {
        headers: {
          "Content-Type": "application/json"
        }
      };
      this.$axios
        .post("/api/api/orgApply", convert_FormData_to_json2(formData), config)
        .then(response => {
          if (response.status === 200) {
            this.$message({
              type: response.type,
              message: response.message
            });
            this.addVisible = false;
            this.addCorporationVisible = false;
            this.reload();
          } else {
            this.$message({
              type: "error",
              message: response.message
            });
            this.addCorporationVisible = false;
          }
        });
    },
    // 保存编辑
    submitEdit() {
      let formData = new FormData();

      formData.append("orgName", this.form.orgName);
      formData.append("type", this.form.type);
      formData.append("orgDesc", this.form.orgDesc);
      formData.append("auditor", this.form.auditor);
      formData.append("applyDesc", this.form.applyDesc);
      formData.append("applyType", "修改");
      formData.append("orgId", this.form.orgId);

      let config = {
        headers: {
          "Content-Type": "application/json"
        }
      };

      this.$axios
        .post("/api/api/orgApply", convert_FormData_to_json2(formData), config)
        .then(response => {
          if (response.status === 200) {
            this.$message({
              type: response.type,
              message: response.message
            });
            this.editVisible = false;
            this.editCorporationVisible = false;
            this.reload();
          } else {
            this.$message({
              type: "error",
              message: response.message
            });
            this.editCorporationVisible = false;
          }
        });
    },
    submitDelete() {
      let formData = new FormData();

      formData.append("orgName", "");
      formData.append("type", "");
      formData.append("orgDesc", "");
      formData.append("auditor", "");
      formData.append("applyDesc", "");
      formData.append("applyType", "删除");
      formData.append("orgId", this.form.orgId);

      let config = {
        headers: {
          "Content-Type": "application/json"
        }
      };

      this.$axios
        .post("/api/api/orgApply", convert_FormData_to_json2(formData), config)
        .then(response => {
          if (response.status === 200) {
            this.$message({
              type: response.type,
              message: response.message
            });
            this.deleteVisible = false;
            this.deleteCorporationVisible = false;
            this.reload();
          } else {
            this.$message({
              type: "error",
              message: response.message
            });
            this.deleteCorporationVisible = false;
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
