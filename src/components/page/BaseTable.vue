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
            <el-table :data="corporationData" border style="width: 100%" ref="multipleTable" >
                <el-table-column type="selection" align="center" width="55"></el-table-column>
                <el-table-column prop="org_id" label="组织编号" align="center" width="170">
                </el-table-column>
                <el-table-column prop="org_name" label="组织名称" align="center" width="170">
                </el-table-column>
                <el-table-column prop="org_type" label="组织类型" align="center" width="170">
                </el-table-column>
                <el-table-column prop="create_person" label="创建人员" align="center" width="170">
                </el-table-column>
                <el-table-column prop="create_time" label="创建时间" align="center" width="291">
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
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="组织类型">
                    <el-select v-model="form.type" placeholder="请选择">
                        <el-option key="bbk" label="步步高" value="bbk"></el-option>
                        <el-option key="xtc" label="小天才" value="xtc"></el-option>
                        <el-option key="imoo" label="imoo" value="imoo"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="组织描述">
                    <el-input v-model="form.corporation_description"></el-input>
                </el-form-item>
                <el-form-item label="审批人">
                    <el-select v-model="form.approval" placeholder="请选择">
                        <el-option key="bbk" label="步步高" value="bbk"></el-option>
                        <el-option key="xtc" label="小天才" value="xtc"></el-option>
                        <el-option key="imoo" label="imoo" value="imoo"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请描述">
                    <el-input v-model="form.application_description"></el-input>
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
                    {{form.name}}
                </el-form-item>
                <el-form-item label="组织名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="组织类型">
                    <el-select v-model="form.region" placeholder="请选择">
                        <el-option key="bbk" label="步步高" value="bbk"></el-option>
                        <el-option key="xtc" label="小天才" value="xtc"></el-option>
                        <el-option key="imoo" label="imoo" value="imoo"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="组织描述">
                    <el-input type="textarea" rows="5" v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="审批人">
                    <el-select v-model="form.region" placeholder="请选择">
                        <el-option key="bbk" label="步步高" value="bbk"></el-option>
                        <el-option key="xtc" label="小天才" value="xtc"></el-option>
                        <el-option key="imoo" label="imoo" value="imoo"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请描述">
                    <el-input type="textarea" rows="5" v-model="form.address"></el-input>
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
                    {{form.name}}
                </el-form-item>
                <el-form-item label="组织名称">
                    {{form.name}}
                </el-form-item>
                <el-form-item label="组织描述">
                    {{form.address}}
                </el-form-item>
                <el-form-item label="审批人">
                    <el-select v-model="form.region" placeholder="请选择">
                        <el-option key="bbk" label="步步高" value="bbk"></el-option>
                        <el-option key="xtc" label="小天才" value="xtc"></el-option>
                        <el-option key="imoo" label="imoo" value="imoo"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请描述">
                    <el-input type="textarea" rows="5" v-model="form.address"></el-input>
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
export default {
  name: "basetable",
  data() {
    return {
      url: "./static/vuetable.json",
      cur_page: 1,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      del_list: [],
      is_search: false,
      editVisible: false,
      delVisible: false,
      addVisible: false,
      addCorporationVisible: false,
      deleteCorporationVisible: false,
      editCorporationVisible: false,
      corporationData: [],
      form: {
        name: "",
        type: "",
        corporation_description: "",
        approval: "",
        application_description: ""
      },
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
        .get("/orgInfo")
        .then(response => {
          if (response.status === 200) {
            this.corporationData = response.data.data;
            console.log(this.corporationData)
          }
        });
    },
    search() {
      this.is_search = true;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    handleEdit(index, row) {
      this.idx = index;
      const item = this.corporationData[index];
      this.form = {
        name: item.name,
        date: item.amount,
        address: item.time
      };
      this.editVisible = true;
    },
    handleDelete(index, row) {
      this.idx = index;
      this.delVisible = true;
    },
    // 保存编辑
    submitEdit() {
      let formData = new FormData();

      formData.append("name", this.form.name);
      formData.append("type", this.form.type);
      formData.append(
        "corporation_description",
        this.form.corporation_description
      );
      formData.append("approval", this.form.approval);
      formData.append(
        "application_description",
        this.form.application_description
      );

      this.$axios
        .post("http://localhost:8084/updateGoods", formData, config)
        .then(response => {
          if (response.status === 200) {
            if (response.data.code == 500) {
              this.$message({
                type: "error",
                message: response.data.message
              });
              this.editVisible = false;
            } else {
              this.$message({
                type: "success",
                message: response.data.message
              });
              this.editVisible = false;
              this.editCorporationVisible = false;
              this.reload();
            }
          }
        });
    },
    submitDelete() {
      let formData = new FormData();

      formData.append("id", this.item.id);

      this.$axios
        .post("http://localhost:8084/deleteGoodsById", formData, config)
        .then(response => {
          if (response.status === 200) {
            if (response.data.code == 500) {
              this.$message({
                type: "error",
                message: response.data.message
              });
              this.addVisible = false;
            } else {
              console.log(config.headers)
              this.$message({
                type: "success",
                message: response.data.message
              });
              this.deleteVisible = false;
              this.reload();
              this.deleteCorporationVisible = false;
            }
          }
        });
    },
    submitAdd() {
      let formData = new FormData();

      formData.append("name", this.form.name);
      formData.append("type", this.form.type);
      formData.append(
        "corporation_description",
        this.form.corporation_description
      );
      formData.append("approval", this.form.approval);
      formData.append(
        "application_description",
        this.form.application_description
      );

      let config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      this.$axios
        .post("http://localhost:8084/addCorporation", formData, config)
        .then(response => {
          if (response.status === 200) {
            if (response.data.code == 500) {
              this.$message({
                type: "error",
                message: response.data.message
              });
              this.addVisible = false;
            } else {
              this.$message({
                type: "success",
                message: response.data.message
              });
              this.addVisible = false;
              this.reload();
              this.addCorporationVisible = false;
            }
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
