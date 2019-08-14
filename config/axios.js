import axios from 'axios'
import router from '../src/router';
import VueRouter from '../node_modules/vue-router';

// 配置默认的host,假如你的API host是：http://api.htmlx.club
axios.defaults.baseURL = 'http://localhost:8081'
// axios.defaults.config = {
//     headers: {
//         "Content-Type": "application/json",
//         "token": ""
//     }
// };

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // var token = localStorage.getItem("token");
    var token = "sadgfadsfsdaf";
    console.log(token)
    if (token == null) {
        window.location.href = "/login#/login";
    } else {
        config.headers.token = token;
    }
    // 在发送请求之前做些什么
    return config
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    if (response.data.code == 200) {
        response.type = "success"
        response.message = response.data.message;
        response.data = response.data.data;
    }else if(response.data.code == 666){
        response.type = "error"
        response.message = response.data.message;
    }
    return response
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
});