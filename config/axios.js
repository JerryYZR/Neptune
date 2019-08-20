import axios from 'axios'
import router from '../src/router';
import VueRouter from '../node_modules/vue-router';

// 配置默认的host,假如你的API host是：http://api.htmlx.club
// axios.defaults.baseURL = 'http://localhost:8081'
// axios.defaults.config = {
//     headers: {
//         "Content-Type": "application/json",
//         "token": ""
//     }
// };

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    var token = localStorage.getItem("token");

    console.log(token)

    if(token != null) {
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
    var token = localStorage.getItem("token");
    if (token == null) {
        console.log(123235)
        // this.$router.push("/login#/login");
    }
    response.message = response.data.message;
    console.log(response.data)
    console.log(response.message)
    if (response.data.code == 200) {
        response.type = "success"
        response.data = response.data.data;
    }else if(response.data.code == 666){
        response.type = "error"
    }else if(response.data.code == 670){
        response.type = "error"
        // this.$router.push("/login#/login");
        // window.location.href = "/login#/login";
    }else{
        response.type = "error"
    }
    
    return response
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
});
