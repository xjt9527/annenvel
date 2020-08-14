<template>
    <div class="shop-list">
        <div class="page-filter">
            <el-cascader
                v-model="addCity"
                :options="options"
                :props="{ value: 'code', label: 'name' }"
                style="width:300px"
                placeholder="选择地区筛选"
            ></el-cascader>
            <el-button @click="findShop('search')" type="primary">查询</el-button>&emsp;&emsp;
            <el-button type="success" @click="showAddPop(1)">
                <i class="el-icon-plus"></i>
                新增加盟商
            </el-button>
        </div>
        <el-table :data="tableData" style="width: 100%" size="middle" border stripe>
            <el-table-column prop="shopId" label="ID" width="80" align="center"></el-table-column>
            <el-table-column prop="phoneNumber" label="手机号码" width="140"></el-table-column>
            <el-table-column prop="shopName" label="加盟店名" width="140"></el-table-column>
            <el-table-column prop="username" label="登录账号" width="120"></el-table-column>
            <el-table-column label="地区">
                <template
                    slot-scope="scope"
                >{{scope.row.provinceName}} - {{scope.row.cityName}} - {{scope.row.areaName}}</template>
            </el-table-column>
            <el-table-column prop="detailAddress" label="详细地址"></el-table-column>
            <!-- <el-table-column prop="userId" label="用户ID" width="100" align="center"></el-table-column> -->

            <el-table-column label="状态" width="80" align="center">
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.status">启用</el-tag>
                    <el-tag type="danger" v-else>禁用</el-tag>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="320" align="center">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="primary"
                        plain
                        @click="showPswPop(scope.row.userId, scope.row.username)"
                    >修改密码</el-button>
                    <el-button
                        size="mini"
                        type="primary"
                        plain
                        @click="shopDetail(scope.row.shopId, scope.row.userId)"
                    >查看详情</el-button>

                    <el-button
                        size="mini"
                        type="primary"
                        plain
                        @click="editShop(scope.row.shopId, scope.row.userId, 2)"
                    >商铺修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="site-page">
            <el-pagination
                background
                :page-count="totalPage"
                :current-page="pageNum"
                @current-change="findShop"
                layout="prev, pager, next"
            ></el-pagination>
        </div>

        <el-dialog
            :title="actionType === 1 ? '新增加盟商' : '修改信息'"
            :visible.sync="showDlg"
            width="580px"
        >
            <el-form :model="form" size="small" label-width="100px">
                <el-form-item label="店铺名称">
                    <el-input
                        v-model="form.shopName"
                        :disabled="actionType===2"
                        placeholder="店名提交成功后不能修改"
                    ></el-input>
                </el-form-item>
                <el-form-item label="手机号码">
                    <el-input v-model="form.phoneNumber" placeholder="请输入正确的手机号码"></el-input>
                </el-form-item>

                <el-form-item label="区域">
                    <el-cascader
                        v-model="citylist"
                        :options="options"
                        :props="{ value: 'code', label: 'name' }"
                        style="width:300px"
                        ref="cityCs"
                        placeholder="选择地区"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址">
                    <el-input v-model="form.detailAddress"></el-input>
                </el-form-item>
                <el-form-item label="登录账号">
                    <el-input v-model="form.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="登录密码" v-show="actionType === 1">
                    <el-input v-model="form.password" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="状态">
                    <el-select v-model="form.status" placeholder="请选择">
                        <el-option
                            v-for="item in statusData"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户权限" v-if="form.roleId">
                    <el-select v-model="form.roleId" placeholder="请选择">
                        <el-option
                            v-for="item in roleData"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align:center;">
                <el-button @click="showDlg = false">取 消</el-button>
                <el-button type="primary" @click="addShop">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="加盟商详情" :visible.sync="showDetail" width="500px">
            <el-form :model="form" size="small" label-width="100px">
                <el-form-item label="店铺名称">{{form.shopName}}</el-form-item>
                <el-form-item label="手机号码">{{form.phoneNumber}}</el-form-item>
                <el-form-item
                    label="区域"
                >{{form.provinceName}} / {{form.cityName}} / {{form.areaName}}</el-form-item>
                <el-form-item label="详细地址">{{form.detailAddress}}</el-form-item>
                <el-form-item label="登录账号">{{form.username}} &emsp; | &emsp; 加盟商ID {{form.userId}}</el-form-item>
                <el-form-item label="状态">{{form.status === 1 ? '启用' : '禁用'}}</el-form-item>
                <el-form-item label="用户权限">{{form.roleId == 2 ? '管理员' : '加盟商'}}</el-form-item>

                <el-form-item label="创建时间">{{form.createTime}}</el-form-item>
                <el-form-item label="更新时间">{{form.updateTime}}</el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="修改用户密码" :visible.sync="showPsw" width="500px">
            <el-form :model="pswInfo" size="small" label-width="100px">
                <el-form-item label="加盟商ID">{{pswInfo.userId}}</el-form-item>
                <el-form-item label="登录账号">{{pswInfo.userName}}</el-form-item>
                <el-form-item label="登录密码">
                    <el-input
                        v-model="pswInfo.password"
                        placeholder="请输入新的密码"
                        type="password"
                        show-password
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align:center;">
                <el-button @click="showPsw = false">取 消</el-button>
                <el-button type="primary" @click="updatePsw">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>
import API from "../lib/API";
export default {
    name: "OrderList",
    data() {
        return {
            addCity: [],
            citylist: [],
            options: [],
            pageNum: 1,
            tableData: [],
            totalPage: 0,
            showDlg: false,
            showDetail: false,
            showPsw: false,
            actionType: 0,
            roleData: [
                {
                    label: "管理员",
                    value: "2"
                },
                {
                    label: "加盟商",
                    value: "3"
                }
            ],
            statusData: [
                {
                    label: "启用",
                    value: 1
                },
                {
                    label: "禁用",
                    value: 0
                }
            ],
            originForm: {
                shopName: "",
                detailAddress: "",
                roleId: "3",
                username: "",
                status: 1,
                password: "",
                phoneNumber: ""
            },
            form: {},
            pswInfo: {
                userId: 0,
                userName: "",
                password: ""
            },
            editShopName: "",
            editUserName: "",
            editPhoneNumber: ""
        };
    },
    computed: {
        provinceCode() {
            return this.citylist[0] || "";
        },
        cityCode() {
            return this.citylist[1] || "";
        },
        areaCode() {
            return this.citylist[2] || "";
        },
        addprovinceCode() {
            return this.addCity[0] || "";
        },
        addcityCode() {
            return this.addCity[1] || "";
        },
        addareaCode() {
            return this.addCity[2] || "";
        }
    },
    methods: {
        showAddPop(type) {
            this.form = Object.assign({}, this.originForm);
            this.actionType = type;
            this.showDlg = true;
            this.citylist = [];
        },
        findShop(val) {
            if (!isNaN(val)) {
                this.pageNum = val;
            }

            if (val === "search") {
                if (!this.addCity.length) {
                    return;
                } else {
                    this.pageNum = 1;
                }
            }

            let formData = {};

            if (val === "search") {
                formData = {
                    areaCode: this.addareaCode,
                    cityCode: this.addcityCode,
                    count: true,
                    pageNum: this.pageNum,
                    pageSize: 10,
                    provinceCode: this.addprovinceCode
                };
            } else {
                formData = {
                    areaCode: this.areaCode,
                    cityCode: this.cityCode,
                    count: true,
                    pageNum: this.pageNum,
                    pageSize: 10,
                    provinceCode: this.provinceCode
                };
            }

            // 获取加盟商列表
            new API(this).POST({
                url: "/shop/findShopList",
                params: formData,
                cb: res => {
                    let { total, result, pages } = res;
                    this.totalPage = pages;
                    this.tableData = result;
                }
            });
        },

        editShop(shopId, userId, type) {
            // 编辑店铺
            new API(this).POST({
                url: "/shop/getShopDetail",
                params: {
                    shopId,
                    userId
                },
                cb: res => {
                    this.actionType = type;

                    this.citylist = [
                        res.provinceCode,
                        res.cityCode,
                        res.areaCode
                    ];

                    this.editShopName = res.shopName;
                    this.editUserName = res.username;
                    this.editPhoneNumber = res.phoneNumber;

                    this.form = Object.assign({}, res);
                    setTimeout(() => {
                        this.showDlg = true;
                    }, 200);
                }
            });
        },

        shopDetail(shopId, userId) {
            new API(this).POST({
                url: "/shop/getShopDetail",
                params: {
                    shopId,
                    userId
                },
                cb: res => {
                    this.showDetail = true;
                    Object.assign(this.form, res);
                }
            });
        },

        addShop() {
            // 新增商家
            let {
                shopName,
                detailAddress,
                username,
                password,
                phoneNumber
            } = this.form;

            if (this.actionType === 1) {
                if (
                    !shopName ||
                    !detailAddress ||
                    !username ||
                    !password ||
                    !phoneNumber ||
                    !this.citylist.length
                ) {
                    this.$message.error("请将加盟商信息填写完整~");
                    return;
                }
            } else {
                if (
                    !shopName ||
                    !detailAddress ||
                    !username ||
                    !phoneNumber ||
                    !this.citylist.length
                ) {
                    this.$message.error("请将加盟商信息填写完整~");
                    return;
                }
            }

            if (!/^1[3456789]\d{9}$/.test(phoneNumber)) {
                this.$message.error("手机号码格式有误");
                return;
            }

            let cityName = this.$refs["cityCs"].presentText;

            cityName = cityName.replace(" ", "");
            cityName = cityName.split("/");

            let cityObj = {
                provinceCode: this.citylist[0],
                cityCode: this.citylist[1],
                areaCode: this.citylist[2],
                provinceName: cityName[0],
                cityName: cityName[1],
                areaName: cityName[2]
            };

            let formData = Object.assign({}, this.form, cityObj);

            if (formData.username === this.editUserName) {
                delete formData.username;
            }
            if (formData.shopName === this.editShopName) {
                delete formData.shopName;
            }

            if (formData.phoneNumber === this.editPhoneNumber) {
                delete formData.phoneNumber;
            }

            let apiurl =
                this.actionType === 1 ? "/shop/addShop" : "/shop/updateShop";

            new API(this).POST({
                url: apiurl,
                params: formData,
                cb: json => {
                    if (json === null) {
                        location.reload();
                    }
                }
            });
        },
        showPswPop(id, name) {
            this.pswInfo.userId = id;
            this.pswInfo.userName = name;
            this.showPsw = true;
        },
        updatePsw() {
            if (!this.pswInfo.password) {
                this.$message.error("请输入密码~");
                return;
            }

            new API(this).POST({
                url: "/user/updatePassword",
                params: this.pswInfo,
                cb: res => {
                    if (res === null) {
                        this.$message.success("修改成功");
                        this.showPsw = false;
                    }
                }
            });
        }
    },
    created() {
        // 获取地区数据
        new API(this).POST({
            url: "/pca/findPcaList",
            cb: res => {
                this.options = res;
            }
        });
        // 查找店铺
        this.findShop();
    }
};
</script>