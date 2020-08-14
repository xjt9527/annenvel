<template>
    <div id="login-page">
        <div class="title">
            <div class="logo">
                <img src="../assets/logo.png" alt />
            </div>
            <h2>后台管理系统</h2>
            <small>
                LOGIN IN
                <i class="el-icon-caret-right"></i>
            </small>
        </div>
        <div class="login-main">
            <div class="inputs">
                <el-input v-model="username" placeholder="请输入用户名"></el-input>
                <el-input
                    v-model="password"
                    placeholder="请输入密码"
                    show-password
                    @keyup.enter.native="toLogin"
                ></el-input>
                <div class="com-btn" @click="toLogin">立即登录</div>
            </div>
        </div>
        <div class="copy-right">&copy; Copyright 2019</div>
    </div>
</template>


<script>
import API from "../lib/API";

export default {
    name: "Login",
    data() {
        return {
            password: "",
            username: ""
        };
    },
    methods: {
        toLogin() {
            if (!this.username || !this.password) {
                this.$message.error("用户名和密码必须填写完整哦");
                return;
            }

            new API(this).POST({
                url: "/user/loginByUsername",
                params: {
                    password: this.password,
                    username: this.username
                },
                cb: res => {
                    localStorage.setItem("shopName", res.shopName);
                    localStorage.setItem("token", res.accesstoken);
                    localStorage.setItem("isAdmin", res.isAdmin);

                    this.$router.push({ name: "OrderList" });
                }
            });
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
#login-page {
    padding: 10px;
    height: 100%;
    background: #000;

    .title {
        width: 400px;
        margin: 100px auto 20px;
        color: #fff;
        position: relative;
        .logo {
            img {
                width: 200px;
                display: block;
            }
        }
        h2 {
            font-size: 16px;
            font-weight: bold;
            margin-top: 15px;
            opacity: 0.8;
        }
        small {
            position: absolute;
            right: 0;
            bottom: 2px;
            color: #ff0;
        }
    }

    .login-main {
        background: #fff;
        width: 400px;
        margin: 20px auto 20px;
        border-radius: 6px;

        padding: 30px 0;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

        .inputs {
            padding: 0 30px;
            .el-input {
                margin-bottom: 20px;
                input {
                    border-color: #000;
                }
            }
        }

        .com-btn {
            display: block;
            text-align: center;
            color: #fff;
            background: #000;
            height: 50px;
            line-height: 50px;
            font-size: 16px;
            font-weight: bold;
            border-radius: 6px;
            transition: all 0.4s;
            cursor: pointer;
            &:hover {
                background: #111;
                color: #ff0;
            }
        }
    }
    .copy-right {
        text-align: center;
        color: #fff;
        opacity: 0.6;
    }
}
</style>
