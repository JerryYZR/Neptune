<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
                            {{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from "../common/bus";
export default {
  data() {
    return {
      collapse: false,
      items: [
        {
          icon: "el-icon-setting",
          index: "dashboard",
          title: "系统首页"
        },
        {
          icon: "el-icon-tickets",
          index: "table",
          title: "组织",
          subs: [
            {
              icon: "el-icon-tickets",
              index: "table",
              title: "组织管理"
            }
          ]
        },
        {
          icon: "el-icon-message",
          index: "tabs",
          title: "应用信息管理"
        },
        {
          icon: "el-icon-date",
          index: "3",
          title: "运维故障单管理",
          subs: [
            {
              index: "faultApply",
              title: "故障报备"
            }
          ]
        },
        {
          icon: "el-icon-star-on",
          index: "charts",
          title: "合作方变更报备管理",
          subs: [
            {
              index: "reportApply",
              title: "报备申请"
            }
          ]
        },
        {
          icon: "el-icon-star-on",
          index: "user_manage",
          title: "用户角色管理"
        }
      ]
    };
  },
  methods: {
    isAdminOrNot() {
      let role = localStorage.getItem("role");
      if (role == "1") {
        let temp = {
          icon: "el-icon-rank",
          index: "organization_approval",
          title: "组织审批"
        };
        this.items[1].subs.push(temp);

        let temp1 = {
          index: "faultDeal",
          title: "故障处理"
        };
        this.items[3].subs.push(temp1);

        let temp2 = {
          index: "reportConfirm",
          title: "报备确认"
        };
        this.items[4].subs.push(temp2);
      }
    }
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    }
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", msg => {
      this.collapse = msg;
    });

    this.isAdminOrNot();
  }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>
