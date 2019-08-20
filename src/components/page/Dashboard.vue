<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-row>
                    <el-col>
                        <el-card shadow="hover" class="mgb20">
                            <div class="user-info">
                                <img src="/static/img/img.jpg" class="user-avator" alt="">
                                <div class="user-info-cont">
                                    <div class="user-info-name">{{infoData.nickname}}</div>
                                    <div>{{role}}</div>
                                </div>
                            </div>
                            <div class="user-info-list">邮箱：<span>{{infoData.email}}</span></div>
                            <div class="user-info-list">部门：<span>{{infoData.department}}</span></div>
                            <div class="user-info-list">职位：<span>{{infoData.position}}</span></div>
                            <div class="user-info-list">地点：<span>{{infoData.office}}</span></div>
                            <div class="user-info-list">电话：<span>{{infoData.telphone}}</span></div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="16" v-show="myRole == '1'">
                <el-card shadow="hover">
                    <div slot="header" class="clearfix">
                        <span>历史数据统计</span>
                    </div>
                    <el-row :gutter="20" class="mgb20">
                        <el-col :span="8">
                            <el-card shadow="hover" :body-style="{padding: '0px'}">
                                <div class="grid-content grid-con-1">
                                    <i class="el-icon-view grid-con-icon"></i>
                                    <div class="grid-cont-right">
                                        <div class="grid-num">886</div>
                                        <div>调用量</div>
                                    </div>
                                </div>
                            </el-card>
                        </el-col>
                        <el-col :span="8">
                            <el-card shadow="hover" :body-style="{padding: '0px'}">
                                <div class="grid-content grid-con-2">
                                    <i class="el-icon-message grid-con-icon"></i>
                                    <div class="grid-cont-right">
                                        <div class="grid-num">30</div>
                                        <div>并发读</div>
                                    </div>
                                </div>
                            </el-card>
                        </el-col>
                        <el-col :span="8">
                            <el-card shadow="hover" :body-style="{padding: '0px'}">
                                <div class="grid-content grid-con-3">
                                    <i class="el-icon-goods grid-con-icon"></i>
                                    <div class="grid-cont-right">
                                        <div class="grid-num">25</div>
                                        <div>调用耗时</div>
                                    </div>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </el-card>
                <el-card shadow="hover" :body-style="{ width: '100%', height: '500px'}">
                    <div id="myChart" :style="{width: '100%', height: '500px'}"></div>
                </el-card>

            </el-col>
        </el-row>
    </div>
</template>

<script>
import convert_FormData_to_json2 from "../page/other";
import echarts from "echarts";
export default {
  inject: ["reload"],
  name: "basetable",
  data() {
    return {
      infoData: [],
      myChart: "",
      myRole: ''
    };
  },
  created() {
    this.getData();
  },
  mounted() {
    this.drawLine();
  },
  computed: {
    role() {
      var role = localStorage.getItem("role");
      console.log("nihao" + role)
      return role == "1" ? "管理员" : "普通用户";
    }
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      this.myChart = echarts.init(document.getElementById("myChart"));
      // 绘制图表
      var option = ({
        title: {
          text: "实时数据统计"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#283b56"
            }
          }
        },
        legend: {
          data: ["调用量", "调用耗时"]
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
          }
        },
        dataZoom: {
          show: false,
          start: 0,
          end: 100
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: true,
            data: (function() {
              var now = new Date();
              var res = [];
              var len = 10;
              while (len--) {
                res.unshift(now.toLocaleTimeString().replace(/^\D*/, ""));
                now = new Date(now - 2000);
              }
              return res;
            })()
          },
          {
            type: "category",
            boundaryGap: true,
            data: (function() {
              var res = [];
              var len = 10;
              while (len--) {
                res.push(10 - len - 1);
              }
              return res;
            })()
          }
        ],
        yAxis: [
          {
            type: "value",
            scale: true,
            name: "调用耗时",
            max: 30,
            min: 0,
            boundaryGap: [0.2, 0.2]
          },
          {
            type: "value",
            scale: true,
            name: "调用量",
            max: 1200,
            min: 0,
            boundaryGap: [0.2, 0.2]
          }
        ],
        series: [
          {
            name: "预购队列",
            type: "bar",
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: (function() {
              var res = [];
              var len = 10;
              while (len--) {
                res.push(Math.round(Math.random() * 1000));
              }
              return res;
            })()
          },
          {
            name: "最新成交价",
            type: "line",
            data: (function() {
              var res = [];
              var len = 0;
              while (len < 10) {
                res.push((Math.random() * 10 + 5).toFixed(1) - 0);
                len++;
              }
              return res;
            })()
          }
        ]
      });
      app.count = 11;
      setInterval(()=> {
        var axisData = new Date().toLocaleTimeString().replace(/^\D*/, "");

        var data0 = option.series[0].data;
        var data1 = option.series[1].data;
        data0.shift();
        data0.push(Math.round(Math.random() * 1000));
        data1.shift();
        data1.push((Math.random() * 10 + 5).toFixed(1) - 0);

        option.xAxis[0].data.shift();
        option.xAxis[0].data.push(axisData);
        option.xAxis[1].data.shift();
        option.xAxis[1].data.push(app.count++);

        this.myChart.setOption(option);
      }, 2100);
    },
    // 获取 easy-mock 的模拟数据
    getData() {
      this.myRole = localStorage.getItem("role");

      let config = {
        headers: {
          token: localStorage.getItem("token")
        }
      };

      this.$axios.get("/api/api/myRole", config).then(response => {
        if (response.status === 200) {
          console.log(response);
          this.infoData = response.data;
          console.log(12);
          console.log(this.infoData);
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
</style>
