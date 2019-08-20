<template>
    <div class="login-wrap">
        <div class="ms-title">Team7天王星系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm">登录</el-button>
                </div>
                <div class="login-btn">
                    <el-button type="primary" @click="registerVisible = true">注册</el-button>
                </div>
            </el-form>
        </div>


        <!-- 注册框 -->
        <el-dialog title="注册" :visible.sync="registerVisible" width="500px" center :append-to-body='true'>
          <el-form>
            <el-form-item label="账号">
                <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item label="名字">
                <el-input v-model="form.nickname"></el-input>
            </el-form-item>
            <el-form-item label="性别">
                <el-input v-model="form.gender"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item label="电话">
                <el-input v-model="form.tel"></el-input>
            </el-form-item>
            <el-form-item label="地址">
                <el-input v-model="form.addr"></el-input>
            </el-form-item>
            <el-form-item label="办公地点">
                <el-input v-model="form.office"></el-input>
            </el-form-item>
            <el-form-item label="部门">
                <el-input v-model="form.department"></el-input>
            </el-form-item>
            <el-form-item label="职位">
                <el-input v-model="form.position"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitRegister">注册</el-button>
                <el-button @click="registerVisible = false">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
    </div>
</template>

<script>
import convert_FormData_to_json2 from "../page/other";
export default {
  data: function() {
    return {
      ruleForm: {
        username: "admin",
        password: "123456"
      },
      form: [],
      registerVisible: false,
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      let formData = new FormData();

      formData.append("userName", this.ruleForm.username);
      formData.append("password", this.ruleForm.password);

      let config = {
        headers: {
          "Content-Type": "application/json"
        }
      };

      this.$axios
        .post("/api/login", convert_FormData_to_json2(formData), config)
        .then(response => {
          if (response.type == "success") {
            console.log(response)
            localStorage.setItem("role", response.data.roles);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem('ms_username',this.ruleForm.username);
            this.$router.push("/");

          } else {
            this.$message({
              type: "error",
              message: response.message
            });
          }
        });
    },
    submitRegister() {
      let formData = new FormData();
      formData.append("userName", this.form.username);
      formData.append("password", this.form.password);
      formData.append("nickname", this.form.nickname);
      formData.append("gender", this.form.gender);
      formData.append("telphone", this.form.tel);
      formData.append("email", this.form.email);
      formData.append("addr", this.form.addr);
      formData.append("office", this.form.office);
      formData.append("department", this.form.department);
      formData.append("position", this.form.position);

      let config = {
        headers: {
          "Content-Type": "application/json",
          "token": localStorage.getItem("token")
        }
      };

      this.$axios
        .post("/api/register", convert_FormData_to_json2(formData), config)
        .then(response => {
          if (response.status === 200) {
            this.$message({
              type: response.type,
              message: response.message
            });
          }
        });
      this.registerVisible = false;
    }
  }
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
}
.ms-title {
  position: absolute;
  top: 50%;
  width: 100%;
  margin-top: -230px;
  text-align: center;
  font-size: 30px;
  color: #fff;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 300px;
  height: 160px;
  margin: -150px 0 0 -190px;
  padding: 40px;
  border-radius: 5px;
  background: #fff;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 5px;
  margin-top: 5px;
}
</style>
