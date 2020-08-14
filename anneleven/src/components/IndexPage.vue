<template>
    <div class="indexPage">
        <div class="header">
            <div class="wrap">
                <div class="logo">
                    <img src="../assets/logo.png" alt />
                    <h2>管理系统</h2>
                </div>
                <div class="user">
                    欢迎,
                    <span>{{usename}}</span>
                    <a href="javascript:;" @click="loginout">退出</a>
                </div>
            </div>
        </div>
        <div class="head-nav">
            <div class="wrap">
                <h2 class="page-title">{{pageTitle}}</h2>
                <div class="nav">
                    <el-menu class :default-active="pageUrl" mode="horizontal">
                        <NavList :list="navListData" />
                    </el-menu>
                </div>
            </div>
        </div>
        <div class="main">
            <div class="wrap">
                <div class="scene">
                    <router-view />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import API from "../lib/API";
import NavList from "./NavList";
export default {
    name: "IndexPage",
    components: {
        NavList
    },
    data() {
        return {
            msg: "",
            usename: "",
            navListData: [],
            pageUrl: this.$route.path,
            pageTitle: this.$route.meta.title
        };
    },
    updated() {
        this.pageTitle = this.$route.meta.title;
        this.pageUrl = this.$route.path;
    },
    methods: {
        loginout() {
            new API(this).POST({
                url: "/user/logout",
                cb: function() {
                    localStorage.clear();
                    location.reload();
                }
            });
        }
    },
    created() {
        this.usename = localStorage.shopName || "";

        // 获取菜单数据
        new API(this).POST({
            url: "/menu/findMenuList",
            cb: res => {
                // res = [
                //   {
                //     menuName: "加盟商管理",
                //     menuUrl: "/shoplist",
                //     menuType: 1,
                //     children: null
                //   },
                //   {
                //     menuName: "商品分类管理",
                //     menuUrl: "/categorylist",
                //     menuType: 1,
                //     children: null
                //   },
                //   {
                //     menuName: "商品管理",
                //     menuUrl: "",
                //     menuType: 0,
                //     children: [
                //       {
                //         menuName: "商品SPU管理",
                //         menuUrl: "/goodspu",
                //         menuType: 1,
                //         children: null
                //       },
                //       {
                //         menuName: "商品SKU管理",
                //         menuUrl: "/goodsku",
                //         menuType: 1,
                //         children: null
                //       }
                //     ]
                //   },
                //   {
                //     menuName: "图案分类管理",
                //     menuUrl: "/imgsort",
                //     menuType: 1,
                //     children: null
                //   },
                //   {
                //     menuName: "图案管理",
                //     menuUrl: "/imglist",
                //     menuType: 1,
                //     children: null
                //   },
                //   {
                //     menuName: "订单管理",
                //     menuUrl: "/orderlist",
                //     menuType: 1,
                //     children: null
                //   }
                // ];

                this.navListData = res;
            }
        });
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.indexPage {
    height: 100%;
    overflow: auto;
    .wrap {
        max-width: 1400px;
        margin: 0 auto;
        position: relative;
        overflow: hidden;
    }
    .header {
        background: #000;
        height: 60px;

        .user {
            position: absolute;
            right: 20px;
            top: 20px;
            color: #fff;
            font-size: 14px;
            span {
                color: #ff0;
            }
        }
        .logo {
            padding: 20px 0 0 20px;
            img {
                height: 16px;
                display: inline-block;
                vertical-align: middle;
            }
            h2 {
                display: inline-block;
                vertical-align: middle;
                color: #fff;
                margin: 0 0 0 10px;
                font-size: 16px;
                opacity: 0.6;
            }
        }
    }

    .head-nav {
        border-bottom: solid 1px #ddd;

        .wrap {
            position: relative;
        }
        .page-title {
            font-size: 18px;
            position: absolute;
            left: 20px;
            margin: 0;
            line-height: 1;
            padding-left: 10px;
            border-left: solid 4px #222;
            display: inline;
            z-index: 10;
            top: 18px;
        }
        .nav {
            text-align: right;
            padding-right: 20px;
            div {
                display: inline-block;
            }
            .el-menu {
                border: 0;
                * {
                    outline: none;
                    display: inline-block;
                    font-size: 15px;
                }
            }

            .el-menu-item:focus,
            .el-menu-item:hover {
                background: #fbfbfd;
            }

            .el-submenu {
                &.is-active {
                    .el-submenu__title {
                        border-bottom: solid 2px #000;
                    }
                }
                .el-submenu__title {
                    padding-right: 40px;
                    &:hover {
                        background: #fbfbfd;
                    }
                }
            }

            .el-menu-item.is-active {
                color: #000;
                border-bottom: solid 2px #000;
            }
        }
    }

    .main {
        .scene {
            padding: 20px;
            font-size: 14px;
        }

        .page-filter {
            margin-bottom: 15px;
            padding: 15px;
            background: #fafafa;
            text-align: center;
            & > * {
                margin-bottom: 10px;
            }
        }

        .site-page {
            text-align: center;
            padding: 30px;
        }
    }
}
.el-table {
    td,
    th {
        font-size: 15px;
        color: #222;
    }
}
</style>