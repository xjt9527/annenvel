<template>
  <div class="imgsort-list">
    <div class="page-filter">
      <el-select v-model="categoryId" placeholder="分类筛选" @change="changsort">
        <div v-for="item in cgList" :key="item.categoryId">
          <el-option v-if="item.status === 1" :label="item.categoryName" :value="item.categoryId"></el-option>
        </div>
      </el-select>

      <el-select v-model="spuId" placeholder="SPU筛选">
        <el-option
          v-for="item in spuList"
          :key="item.spuId"
          :label="item.spuName"
          :value="item.spuId"
        ></el-option>
      </el-select>
      <el-button type="primary" @click="getSKUList">筛选</el-button>

      <el-button type="success" @click="addBtn">新增SKU</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" size="middle" border stripe>
      <el-table-column prop="skuId" label="skuId" width="80" align="center"></el-table-column>
      <el-table-column prop="skuCode" label="sku编号" width="150"></el-table-column>

      <!-- <el-table-column prop="spuId" label="spuId" width="100" align="center"></el-table-column> -->
      <el-table-column label="所属分类" width="140" align="center" v-if="Object.keys(cgList).length">
        <template slot-scope="scope">{{cgList[scope.row.categoryId].categoryName}}</template>
      </el-table-column>
      <el-table-column label="颜色">
        <template slot-scope="scope">
          色值： {{scope.row.colorValue}}
          <br />
          {{scope.row.colorName}}
        </template>
      </el-table-column>
      <el-table-column prop="position" label="位置" align="center" width="100"></el-table-column>
      <el-table-column label="适合背景" align="center" width="80">
        <template slot-scope="scope">{{scope.row.applyBaseColor === 'W' ? '白' : '黑'}}</template>
      </el-table-column>
      <el-table-column prop="size" label="尺码" width="80" align="center"></el-table-column>
      <el-table-column label="框距" align="center">
        <template slot-scope="scope">{{scope.row.ordinate}}px</template>
      </el-table-column>
      <el-table-column label="商品图片预览" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.skuImageUrl + '?x-oss-process=image/resize,w_200'" width="100" />
        </template>
      </el-table-column>
      <el-table-column label="上架" align="center" width="80">
        <template slot-scope="scope">{{scope.row.isUpper ? '是' : '否'}}</template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
          <el-button size="small" type="primary" plain @click="editBtn(scope.row.skuId)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="site-page">
      <el-pagination
        background
        :page-count="totalPage"
        :current-page="pageNum"
        @current-change="getSKUList"
        layout="prev, pager, next"
      ></el-pagination>
    </div>

    <el-dialog title="新增SKU" :visible.sync="showAdd" width="500px">
      <el-form :model="addForm" size="small" label-width="100px">
        <el-form-item label="SKU编码">
          <el-input v-model="addForm.skuCode"></el-input>
        </el-form-item>
        <el-form-item label="颜色名称">
          <el-input v-model="addForm.colorName"></el-input>
        </el-form-item>
        <el-form-item label="颜色值">
          <el-input v-model="addForm.colorValue" placeholder="例如： #ffffff"></el-input>
        </el-form-item>
        <el-form-item label="位置">
          <el-select v-model="addForm.position" placeholder="选择位置">
            <el-option label="前胸" value="前胸"></el-option>
            <el-option label="后背" value="后背"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="尺寸">
          <el-input v-model="addForm.size" placeholder="例如： S/M/L/XL"></el-input>
        </el-form-item>

        <el-form-item label="框距">
          <el-input v-model="addForm.ordinate" placeholder="请输入框架 单位PX" type="number"></el-input>
        </el-form-item>

        <el-form-item label="适用背景">
          <el-select v-model="addForm.applyBaseColor" placeholder="背景颜色">
            <el-option label="白" value="W"></el-option>
            <el-option label="黑" value="B"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属 SPU">
          <el-select v-model="addForm.categoryId" placeholder="分类筛选" @change="changsort('edit')">
            <div v-for="item in cgList" :key="item.categoryId">
              <el-option
                v-if="item.status === 1"
                :label="item.categoryName"
                :value="item.categoryId"
              ></el-option>
            </div>
          </el-select>

          <el-select v-model="addForm.spuId" placeholder="SPU筛选">
            <el-option
              v-for="item in editSpuList"
              :key="item.spuId"
              :label="item.spuName"
              :value="item.spuId"
            ></el-option>
          </el-select>
          <!-- <el-input v-model="addForm.spuId" placeholder="输入SPU ID"></el-input> -->
        </el-form-item>
        <el-form-item label="商品图片">
          <el-upload
            class="upload-demo"
            :action="ossUrl"
            :data="ossData"
            :limit="1"
            :on-success="uploaded"
            :on-change="uploadCg"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">图片大小不能超过20MB</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="是否上架">
          <el-select v-model="addForm.isUpper" placeholder="请选择">
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button @click="showAdd = false">取 消</el-button>
        <el-button type="primary" @click="addSpu">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="SKU修改" :visible.sync="showEdit" width="500px">
      <el-form :model="editForm" size="small" label-width="100px">
        <el-form-item label="SKU编码">
          <el-input v-model="editForm.skuCode"></el-input>
        </el-form-item>
        <el-form-item label="颜色名称">
          <el-input v-model="editForm.colorName"></el-input>
        </el-form-item>
        <el-form-item label="颜色值">
          <el-input v-model="editForm.colorValue" placeholder="例如： #ffffff"></el-input>
        </el-form-item>
        <el-form-item label="位置">
          <el-select v-model="editForm.position" placeholder="选择位置">
            <el-option label="前胸" value="前胸"></el-option>
            <el-option label="后背" value="后背"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="尺寸">
          <el-input v-model="editForm.size" placeholder="例如： S/M/L/XL"></el-input>
        </el-form-item>

        <el-form-item label="框距">
          <el-input v-model="editForm.ordinate" placeholder="请输入框架 单位PX" type="number"></el-input>
        </el-form-item>

        <el-form-item label="适用背景">
          <el-select v-model="editForm.applyBaseColor" placeholder="背景颜色">
            <el-option label="白" value="W"></el-option>
            <el-option label="黑" value="B"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属SPU">
          <el-input disabled :value="editForm.spuName"></el-input>

          <!-- <el-select v-model="editForm.spuId" placeholder="SPU选择">
                        <el-option
                            v-for="item in allSpu"
                            :key="item.spuId"
                            :label="item.spuName"
                            :value="item.spuId"
                        ></el-option>
          </el-select>-->
        </el-form-item>

        <el-form-item label="商品图片">
          <div v-if="!editimgup">
            <img
              :src="editForm.skuImageUrl + '?x-oss-process=image/resize,w_200'"
              width="100"
              style="vertical-align:middle"
            />
            <el-button size="small" type="text" @click="editimgup = true">修改图片</el-button>
          </div>
          <el-upload
            v-else
            class="upload-demo"
            :action="ossUrl"
            :data="ossData"
            :limit="1"
            :on-success="uploaded('edit')"
            :on-change="uploadCg"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">图片大小不能超过20MB</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="是否上架">
          <el-select v-model="editForm.isUpper" placeholder="请选择">
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button @click="showEdit = false">取 消</el-button>
        <el-button type="primary" @click="editSpu">确 定</el-button>
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
      tableData: [],
      categoryId: "",
      spuId: "",
      cgList: [],
      spuList: [],
      editSpuList: [],
      pageNum: 1,
      totalPage: 0,
      showAdd: false,
      showEdit: false,
      addForm: {
        applyBaseColor: "",
        colorName: "",
        colorValue: "",
        isUpper: 1,
        position: "",
        size: "",
        skuCode: "",
        skuImageKey: "",
        spuId: "",
        categoryId: "",
        ordinate: ""
      },
      ossUrl: "",
      ossData: {},
      editimgup: false,
      editUpload: false,
      allSpu: [],
      editForm: {},
      editSkuCode: ""
    };
  },
  methods: {
    addBtn() {
      this.showAdd = true;
      this.addForm = Object.assign(
        {},
        {
          applyBaseColor: "",
          colorName: "",
          colorValue: "",
          isUpper: 1,
          position: "",
          size: "",
          skuCode: "",
          skuImageKey: "",
          spuId: "",
          categoryId: "",
          ordinate: ""
        }
      );
      this.getOsspop();
    },
    addSpu() {
      let complete = true;

      for (let key in this.addForm) {
        let v = this.addForm[key];
        if (key === "ordinate") {
          continue;
        }
        if (v === "") {
          complete = false;
        }
      }

      if (!complete) {
        this.$message.error("请将sku信息填写完整");
        return;
      }

      new API(this).POST({
        url: "/goodsSku/addGoodsSku",
        params: this.addForm,
        cb: res => {
          if (res === null) {
            location.reload();
          }
        }
      });
    },
    editBtn(id) {
      this.getOsspop();
      this.editUpload = false;
      this.editimgup = false;
      new API(this).POST({
        url: "/goodsSku/getGoodsSkuDetail?skuId=" + id,
        cb: res => {
          this.editForm = res;
          this.showEdit = true;
          this.editSkuCode = res.skuCode;
        }
      });
    },
    editSpu() {
      let complete = true;

      for (let key in this.editForm) {
        let v = this.editForm[key];
        if (key === "ordinate") {
          continue;
        }
        if (v === "") {
          complete = false;
        }
      }

      if (!complete) {
        this.$message.error("请将sku信息填写完整");
        return;
      }

      if (this.editForm.skuCode === this.editSkuCode) {
        delete this.editForm.skuCode;
      }

      new API(this).POST({
        url: "/goodsSku/updateGoodsSku",
        params: this.editForm,
        cb: res => {
          if (res === null) {
            location.reload();
          }
        }
      });
    },
    getOsspop() {
      this.ossUrl = "";
      this.ossData = {};
      new API(this).POST({
        url: "/oss/getSignature",
        params: {
          count: 1,
          type: 3
        },
        cb: res => {
          this.ossUrl = res.url;
          this.ossData = res.signatures[0];
        }
      });
    },
    uploaded(type) {
      if (type === "edit" && this.editUpload) {
        this.editForm.skuImageKey = this.ossData.key;
      } else {
        this.addForm.skuImageKey = this.ossData.key;
      }
    },
    uploadCg(file) {
      let ext = file.raw.type;
      ext = ext ? "." + ext.split("/")[1] : "";
      let hasExt = this.ossData.key.indexOf(".");
      if (hasExt === -1) {
        this.ossData.key += ext;
      } else {
        this.ossData.key = this.ossData.key.slice(0, hasExt);
        this.ossData.key += ext;
      }

      this.editUpload = true;
    },
    getSKUList(val) {
      if (!isNaN(val)) {
        this.pageNum = val;
      } else {
        this.pageNum = 1;
      }
      new API(this).POST({
        url: "/goodsSku/findGoodsSkuList",
        params: {
          categoryId: this.categoryId,
          count: true,
          pageNum: this.pageNum,
          pageSize: 10,
          spuId: this.spuId
        },
        cb: res => {
          let { pages, result } = res;

          this.totalPage = pages;
          this.tableData = result;
        }
      });
    },
    changsort(type) {
      type = type === "edit";
      if (type) {
        this.addForm.spuId = "";
      } else {
        this.spuId = "";
      }
      new API(this).POST({
        url: "/goodsSpu/findGoodsSpuList",
        params: {
          categoryId: type ? this.addForm.categoryId : this.categoryId,
          count: true,
          pageNum: 1,
          pageSize: 100
        },
        cb: res => {
          let { pages, result } = res;
          if (type) {
            this.editSpuList = result;
          } else {
            this.spuList = result;
          }
        }
      });
    },
    csSPU() {
      new API(this).POST({
        url: "/goodsSpu/findGoodsSpuList",
        params: {
          categoryId: "",
          count: false,
          pageNum: 1,
          pageSize: 100
        },
        cb: res => {
          let { pages, result } = res;
          this.allSpu = result;
        }
      });
    }
  },
  created() {
    this.getSKUList();
    this.csSPU();

    new API(this).POST({
      url: "/goodsCategory/findAllGoodsCategoryList",
      cb: res => {
        let list = {};

        res.forEach(item => {
          list[item.categoryId] = item;
        });
        this.cgList = list;
      }
    });
  }
};
</script>