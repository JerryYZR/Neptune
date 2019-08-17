<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 用户角色管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">

            <template>
                <el-row style="text-align: center">
                    <el-autocomplete
                        style="width:50%"
                        v-model="select_word"
                        :fetch-suggestions="search"
                        @select="handleSearch"
                        placeholder="请输入身份证号/姓名/部门"
                        :trigger-on-focus="false">
                        <template slot="prepend"><i class="el-icon-search"></i></template>
                    </el-autocomplete>
                </el-row>
            </template>

            <div v-if="infoData!='' ">
                <template>
                    <el-divider></el-divider>
                </template>

                <div style="margin-left: 50px;">
                    <template >
                        <el-row>
                            <el-col :span="3" style="font-size: 20px;font-weight: bold;">
                                <!--nickname-->
                                {{infoData.nickname}}
                            </el-col>
                            <el-col :span="3">
                                <!--position-->
                                {{infoData.postion}}
                            </el-col>
                        </el-row>
                        <el-row >
                            <el-col :span="3" style="font-weight: bold">
                                <!--department-->
                                {{infoData.department}}
                            </el-col>
                            <el-col :span="3">
                                <!--departmentName-->
                                {{infoData.departmentName}}
                            </el-col>
                        </el-row>
                    </template>
                </div>


                <template>
                    <el-divider></el-divider>
                </template>

                <div>
                    <el-row>
                        <div style="margin-left: 50px;">
                            <div>
                                <i class="el-icon-user-solid"></i>
                                账号：{{infoData.userName}}
                            </div>
                            <div>
                                <i class="el-icon-phone"></i>
                                电话：{{infoData.telephone}}
                            </div>
                            <div>
                                <i class="el-icon-receiving"></i>
                                邮箱：{{infoData.email}}
                            </div>
                            <div>
                                <i class="el-icon-location"></i>
                                办公地址：{{infoData.office}}
                            </div>
                        </div>
                    </el-row>
                </div>

                <template>
                    <el-divider></el-divider>
                </template>

                <div style="margin-left: 50px;">
                    <el-row>
                        <el-col :span="3">
                            <i class="el-icon-s-custom"></i>
                            角色:
                        </el-col>
                        <el-col :span="3">
                            <ol>
                                <li v-for="site in masterData">
                                    {{ site.roleName }}
                                    <i class="el-icon-delete" @click="handleDelete(site)" style="color: red;font-size: 20px"></i>
                                </li>
                            </ol>
                        </el-col>
                        <el-col :span="6">
                            <img src="/static/img/add.png" @click="roleVisible = true" style="width: 60px;margin-top: -10px;">
                        </el-col>
                    </el-row>
                </div>
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
                <el-table-column prop="roleIntro" label="角色描述">
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
      select_word: "",
      is_search: false,
      deleteVisible: false,
      addVisible: false,
      roleVisible: false,
      tempData: [],
      infoData: '',
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
          token: localStorage.getItem("token")
        }
      };

      this.$axios.get("/api/api/role", config).then(response => {
        if (response.status === 200) {
          console.log(response);
          this.roleData = response.data;
          console.log(1);
          console.log(this.roleData);

          console.log(this.select_word);
            console.log(this.infoData);
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    search(queryString, cb) {
      let formData = new FormData();

      formData.append("userName", this.select_word);
      let config = {
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token")
        }
      };

      this.$axios
        .post("/api/api/reaRole", convert_FormData_to_json2(formData), config)
        .then(response => {
          if (response.status === 200) {
            this.tempData = response.data;
            console.log(1);
            console.log(this.tempData);
            for (var i = 0; i < this.tempData.length; i++) {
              this.tempData[i].value = this.tempData[i].userName;
            }
            cb(this.tempData);
          }
        });
    },
    handleSearch(data) {
      console.log(data);
      this.getRole(data);
    },
    handleDelete(data) {
      console.log(data);
      this.form.roleId = data.roleId;
      this.deleteVisible = true;
    },
    getRole(item) {
      let config = {
        headers: {
          token: localStorage.getItem("token")
        }
      };

      this.$axios
        .get("/api/api/otherRole/" + item.userId, config)
        .then(response => {
          if (response.status === 200) {
            this.infoData = response.data;
            this.masterData = this.infoData.roleInfoList;
            console.log(this.masterData);
          }
        });
    },
    getInfo() {
      let config = {
        headers: {
          token: localStorage.getItem("token")
        }
      };

      this.$axios
        .get("/api/api/otherRole/" + this.infoData.userId, config)
        .then(response => {
          if (response.status === 200) {
            this.infoData = response.data;
            this.masterData = this.infoData.roleInfoList;
            console.log(this.masterData);
          }
        });
    },
    submitAdd() {
      let formData = new FormData();

      formData.append("userId", this.infoData.userId);
      formData.append("roleId", "");

      let config = {
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token")
        }
      };
      console.log(this.multipleSelection)
      for (var i = 0; i < this.multipleSelection.length; i++) {
        let item = this.multipleSelection[i];
        console.log(i)
        console.log(item);
        formData.set("roleId", item.roleId);
        this.$axios
          .post(
            "/api/api/admin/addRole",
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

              this.getInfo();
            }
          });
      }
    },
    submitDelete() {
      let config = {
        headers: {
          token: localStorage.getItem("token")
        }
      };

      this.$axios
        .delete(
          "/api/api/admin/delRole/" +
            this.infoData.userId +
            "/" +
            this.form.roleId,
          config
        )
        .then(response => {
          if (response.status === 200) {
            this.$message({
              type: response.type,
              message: response.message
            });
            this.deleteVisible = false;

            this.getInfo();
          }
        });
    }
  }
};
</script>



<style scoped>
.searchbox {
  display: inline-block;
  width: 250px;
}
.searchbox.el-select,
.el-autocomplete {
  float: left;
}

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
