<template>
  <div class="order-list">
    <el-tabs
      type="border-card"
      class="page-filter-tab"
      v-model="curTab"
      @tab-click="changeTab"
    >
      <el-tab-pane label="按条件筛选" name="first">
        <el-date-picker
          v-model="timepick"
          type="datetimerange"
          range-separator="-"
          start-placeholder="订单开始日期"
          end-placeholder="订单结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
        <br />
        <el-input
          v-if="isAdmin"
          v-model="shopName"
          placeholder="店名"
          style="display: inline-block; width: auto"
        ></el-input>
        <el-input
          v-else
          v-model="shopName"
          placeholder="店名"
          disabled
          style="display: inline-block; width: auto"
        ></el-input>

        <el-input
          v-model="phoneNumber"
          placeholder="买家手机号"
          style="display: inline-block; width: auto"
        ></el-input>

        <el-select
          v-model="orderStatus"
          placeholder="订单状态"
          style="width: 120px"
        >
          <el-option label="全部订单" value></el-option>
          <el-option
            v-for="item in orderStatusItem"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <br />

        <el-button @click="findOrder('time')" type="primary">查询</el-button>
        <el-button v-if="tableData.length" @click="exportData" type="success"
          >导出</el-button
        >
      </el-tab-pane>
      <el-tab-pane label="按订单号筛选" name="secend">
        <el-input
          v-model="orderNumber"
          placeholder="订单号"
          style="display: inline-block; width: 300px"
        ></el-input>
        <br />
        <el-button @click="findOrder('id')" type="primary">查询</el-button>
        <el-button @click="downloadImg" type="success" v-if="table2Data.length"
          >下载图片</el-button
        >
      </el-tab-pane>
    </el-tabs>

    <div></div>

    <el-table
      :data="tableData"
      v-if="curTab === 'first'"
      style="width: 100%"
      border
      stripe
    >
      <el-table-column
        prop="orderId"
        label="订单号"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="phoneNumber"
        label="买家手机号"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="buyer"
        label="买家姓名"
        align="center"
        width="120"
      ></el-table-column>
      <el-table-column label="商品详情" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.spuName }} x{{ scope.row.count }}</p>
          <p>
            {{ scope.row.size }}码 / {{ scope.row.position }} /
            {{ scope.row.colorName }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        align="center"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="180"
        align="center"
      ></el-table-column>
      <!-- <el-table-column prop="updateTime" label="更新时间" width="180" align="center"></el-table-column> -->
      <el-table-column
        prop="status"
        label="订单状态"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag effect="plain" type="primary">{{
            orderStatusData[scope.row.status]
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280" align="left">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            plain
            @click="showImg(scope.row.previewImageUrl)"
            >预览</el-button
          >
          <el-button
            size="small"
            type="warning"
            plain
            @click="editStatus(scope)"
            v-if="scope.row.status !== 0 && scope.row.status !== 4"
            >打印小票</el-button
          >

          <template v-else-if="scope.row.status === 0">
            <el-button
              size="small"
              type="success"
              plain
              @click="changeStatus(scope.row, 1, scope)"
              >确认</el-button
            >

            <el-button
              size="small"
              type="info"
              plain
              @click="changeStatus(scope.row, 4, scope)"
              >取消</el-button
            >
          </template>

          <el-button
            size="small"
            type="primary"
            plain
            @click="tocfOrder(3, scope.row.orderId, scope.$index)"
            v-if="scope.row.status === 2"
            >通知用户</el-button
          >
          <!-- <el-button size="small" type="primary" plain v-if="scope.row.status === 3">已通知</el-button> -->
          <!-- <el-button size="small" type="info" plain v-if="scope.row.status === 4">已取消</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <el-table
      :data="table2Data"
      v-if="curTab === 'secend'"
      style="width: 100%"
      border
      stripe
    >
      <el-table-column
        prop="orderId"
        label="订单号"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="phoneNumber"
        label="买家手机号"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="buyer"
        label="买家姓名"
        align="center"
        width="120"
      ></el-table-column>
      <el-table-column label="商品详情" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.spuName }} x{{ scope.row.count }}</p>
          <p>
            {{ scope.row.size }}码 / {{ scope.row.position }} /
            {{ scope.row.colorName }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="180"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="updateTime"
        label="更新时间"
        width="180"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="status"
        label="订单状态"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag effect="plain" type="primary">{{
            orderStatusData[scope.row.status]
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="270" align="center">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            plain
            @click="showImg(scope.row.previewImageUrl)"
            >预览</el-button
          >

          <el-button
            size="small"
            type="warning"
            plain
            @click="editStatus(scope)"
            v-if="scope.row.status !== 0 && scope.row.status !== 4"
            >打印</el-button
          >
          <el-button
            size="small"
            type="info"
            plain
            v-if="scope.row.status === 0"
            >未确认</el-button
          >

          <el-button
            size="small"
            type="primary"
            plain
            @click="tocfOrder(3, scope.row.orderId, scope.$index)"
            v-if="scope.row.status === 2"
            >通知用户</el-button
          >
          <!-- <el-button size="small" type="info" plain v-if="scope.row.status === 4">已取消</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <div class="site-page" v-show="tableData.length && curTab === 'first'">
      <el-pagination
        background
        :page-count="totalPage"
        :current-page="pageNum"
        @current-change="findOrder"
        layout="prev, pager, next"
      ></el-pagination>
    </div>

    <el-dialog title="预览" :visible.sync="showPop">
      <div class="imgPrivew">
        <img :src="this.orderImgSrc + '?x-oss-process=image/resize,w_800'" />
      </div>
    </el-dialog>

    <el-dialog title="确认订单" :visible.sync="showcfpop" width="400px">
      <p style="text-align: center; font-size: 16px">
        小票打印完成后，请确认已打印
      </p>

      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="showcfpop = false">取 消</el-button>
        <el-button type="primary" @click="tocfOrder(2)">已打印</el-button>
      </div>
    </el-dialog>

    <el-dialog title="确认打印" :visible.sync="showtzpop" width="400px">
      <p style="text-align: center; font-size: 16px">是否已打印完衣服</p>

      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="showtzpop = false">取 消</el-button>
        <el-button type="primary" @click="tocfOrder(2)">确认</el-button>
      </div>
    </el-dialog>

    <form ref="myform" method="post" style="display: none">
      <input type="text" name="startTime" class="mf-st" />
      <input type="text" name="endTime" class="mf-et" />
      <input type="text" name="phoneNumber" class="mf-pn" />
      <input type="text" name="shopName" class="mf-sn" />
      <input type="text" name="status" class="mf-zt" />
    </form>
  </div>
</template>


<script>
import API from "../lib/API";
import QRCode from "qrcodejs2";
export default {
  name: "OrderList",
  data() {
    return {
      timepick: [],
      curTab: "first",
      phoneNumber: "",
      shopName: "",
      orderNumber: "",
      showPop: false,
      showPop2: false,
      orderImgSrc: "",
      orderStatus: "",
      totalPage: 0,
      cgOrderSt: null,
      editOrderId: null,
      editIndex: 0,
      isAdmin: true,
      showcfpop: false,
      showtzpop: false,
      tabD: false,
      orderStatusData: {
        0: "未确认",
        1: "已确认",
        2: "已打印",
        3: "已通知",
        4: "已取消",
      },
      orderStatusItem: [
        {
          value: 0,
          label: "未确认",
        },
        {
          value: 1,
          label: "已确认",
        },
        {
          value: 2,
          label: "已打印",
        },
        {
          value: 3,
          label: "已通知",
        },
        {
          value: 4,
          label: "已取消",
        },
      ],
      pageNum: 1,
      tableData: [],
      table2Data: [],
      piaohtml: null,
    };
  },
  watch: {},
  methods: {
    timeCut(org) {
      if (/年|月|日/.test(org) === false) {
        return org;
      }
      let tt = org.replace(/\s/g, "");
      tt = tt.replace(/年|月/g, "-");
      tt = tt.replace(/日/g, " ");
      return tt;
    },
    showImg(src) {
      this.orderImgSrc = src;
      this.showPop = true;
    },
    findOrder(val) {
      if (!isNaN(val)) {
        this.pageNum = val;
      } else {
        this.pageNum = 1;
      }

      this.tabD = false;
      let formData = {};
      let apiUrl = "/order/findOrderList";

      if (val === "id") {
        if (this.orderNumber) {
          this.tabD = true;
          formData = {};
          apiUrl = `/order/getOrderById?orderId=${this.orderNumber}`;
        } else {
          this.$message.error("请输入订单号");
          return;
        }
      }

      if (val === "time" || !isNaN(val)) {
        if (!this.timepick.length) {
          return;
        }

        formData = {
          count: true,
          startTime: this.timeCut(this.timepick[0]),
          endTime: this.timeCut(this.timepick[1]),
          pageNum: this.pageNum,
          pageSize: 10,
          phoneNumber: this.phoneNumber,
          shopName: this.shopName,
          status: this.orderStatus,
        };
      }

      new API(this).POST({
        url: apiUrl,
        params: formData,
        cb: (res) => {
          if (!res) {
            this.tableData = [];

            return false;
          }

          if (res.orderId) {
            this.table2Data = [res];
          } else {
            let { pages, result, total } = res;

            this.tableData = result;

            this.totalPage = pages;
          }
        },
      });
    },
    exportData() {
      let myform = this.$refs["myform"];

      myform.setAttribute(
        "action",
        "http://manager-api.anneleven.cn/order/exportOrderList?accesstoken=" +
          localStorage.getItem("token")
      );
      myform.startTime.value = this.timeCut(this.timepick[0]);
      myform.endTime.value = this.timeCut(this.timepick[1]);
      myform.phoneNumber.value = this.phoneNumber;
      myform.shopName.value = this.shopName;
      myform.status.value = this.orderStatus || "";
      myform.submit();
    },
    editStatus(scope) {
      let orderInfo = scope.row;
      this.editIndex = scope.$index;
      this.editOrderId = orderInfo.orderId;

      // 打印衣服
      if (this.tabD) {
        // 打印衣服
        window.runCMD(orderInfo);

        // 衣服打印成功后 通知用户
        if ([0, 4].indexOf(orderInfo.status) < 0) {
          this.showtzpop = true;
        }
        return;
      }

      // 打印小票
      let printData = {
        orderId: orderInfo.orderId,
        buyer: orderInfo.buyer,
        phoneNumber: orderInfo.phoneNumber,
        skuCode: orderInfo.skuCode,
        size: orderInfo.size,
      };

      window.open(
        "http://c-pub-ann.anneleven.cn/static/print.html?data=" +
          encodeURIComponent(JSON.stringify(printData))
      );
    },
    changeStatus(orderInfo, type, scope) {
      let index = scope.$index;
      this.tocfOrder(type, orderInfo.orderId, index);
    },
    tocfOrder(status, id, index) {
      this.showcfpop = false;
      this.showtzpop = false;
      new API(this).POST({
        url: "/order/updateStatus",
        params: {
          orderId: id || this.editOrderId,
          status,
        },
        cb: (res) => {
          if (res === null) {
            if (this.tabD) {
              this.table2Data[0].status = status;
            } else {
              let indexNum = index !== undefined ? index : this.editIndex;

              this.tableData[indexNum].status = status;
            }
          }
        },
      });
    },
    changeTab(tab) {
      if (this.curTab === "first") {
        this.tabD = false;
      }
    },
    downloadImg() {
      let url = this.table2Data[0].customizedDesignUrl;

      let alink = document.createElement("a");
      alink.href = url;
      alink.target = "_blank";
      alink.download = "pic"; //图片名
      alink.click();
    },
  },
  created() {
    let date = new Date();
    date =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    this.timepick = [date + " 00:00:00", date + " 23:59:59"];
    this.isAdmin = localStorage.getItem("isAdmin") === "true";
    if (!this.isAdmin) {
      this.shopName = localStorage.getItem("shopName");
    }

    // let self = this;
    // document.body.addEventListener("click", function(e) {
    //     if (e.target.className === "goback") {
    //         document.querySelector("#app").style.display = "block";
    //         document.body.removeChild(self.piaohtml);
    //     }
    // });
  },
};
</script>


<style lang="less" scoped>
.imgPrivew {
  text-align: center;
  img {
    display: block;
    margin: 0 auto;
    max-width: 400px;
    max-height: 660px;
  }
}

.page-filter-tab {
  margin-bottom: 20px;
  .el-tab-pane > * {
    margin-bottom: 10px;
  }
}
</style>