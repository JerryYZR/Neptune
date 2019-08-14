<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 用户角色管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="user-info">
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>

            <div>
                {{InfoData.nickname}}
                {{InfoData.postion}}
                {{InfoData.department}}
                {{InfoData.departmentName}}
                账号：{{InfoData.userName}}
                电话：{{InfoData.telephone}}
                邮箱：{{InfoData.email}}
                办公地址：{{InfoData.office}}
            </div>

            <div>
                角色
                <p v-bind:v-for="(item, i) in masterData"></p>
                <img src="/static/img/add.png" @click="roleVisible = true">
            </div>
        </div>

        <!-- 添加角色弹出框 -->
        <el-dialog title="添加角色" :visible.sync="roleVisible" width="50%">
            <el-table :data="roleData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="roleName" label="角色名称" sortable width="150">
                </el-table-column>
                <el-table-column prop="roleId" label="角色ID" width="120">
                </el-table-column>
                <el-table-column prop="roleIntro" label="角色描述" :formatter="formatter">
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="roleVisible = false">取 消</el-button>
                <el-button type="primary" @click="addVisible=true">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 添加提示框 -->
        <el-dialog title="提示" :visible.sync="addVisible" width="300px" center>
            <div class="del-dialog-cnt">是否确定添加？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitAdd">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="deleteVisible" width="300px" center>
            <div class="del-dialog-cnt">是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteVisible = false">取 消</el-button>
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
      deleteVisible: false,
      addVisible: false,
      roleVisible: false,
      InfoData: [],
      masterData: [],
      roleData: [],
      form: {},
      pagesize: 10,
      idx: -1
    };
  },
  created() {
    this.getData();
  },
  watch: {
      select_word:function (){
          this.search();
      }
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

      this.$axios.get("/api/api/role").then(response => {
        if (response.status === 200) {
          this.roleData = response.data;
          console.log(this.roleData);
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
    submitAdd() {
      let formData = new FormData();

      formData.append("userId", this.InfoData.userId);
      formData.append("roleId", "");

      let config = {
        headers: {
          "Content-Type": "application/json"
        }
      };
      for (item in multipleSelection) {
        formData.set("roleId", item.roleId);
        this.$axios
          .post(
            "/api/api/orgApply",
            convert_FormData_to_json2(formData),
            config
          )
          .then(response => {
            if (response.status === 200) {
              this.$message({
                type: response.type,
                message: response.message
              });
              this.roleVisible = false;
              this.addVisible = false;
              this.reload();
            } else {
              this.$message({
                type: "error",
                message: response.message
              });
              this.addVisible = false;
            }
          });
      }
    },
    submitDelete() {
      let formData = new FormData();

      formData.append("userId", this.InfoData.userId);
      formData.append("roleId", this.form.roleId);

      let config = {
        headers: {
          "Content-Type": "application/json"
        }
      };

      this.$axios
        .delete("/api/api/admin/delete", convert_FormData_to_json2(formData), config)
        .then(response => {
          if (response.status === 200) {
            this.$message({
              type: response.type,
              message: response.message
            });
            this.deleteVisible = false;
            this.reload();
          } else {
            this.$message({
              type: "error",
              message: response.message
            });
            this.deleteVisible = false;
          }
        });
    }
  }
};
</script>



<style scoped>
.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

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
