<template>
  <div class="imgsort-list">
    <div class="page-filter">
      <el-select v-model="categoryId" placeholder="分类筛选">
        <div v-for="item in cgList" :key="item.categoryId">
          <el-option v-if="item.status === 1" :label="item.categoryName" :value="item.categoryId"></el-option>
        </div>
      </el-select>
      <el-button type="primary" @click="getSKUList">筛选</el-button>

      <el-button type="success" @click="addBtn">新增SPU</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" size="middle" border stripe>
      <el-table-column prop="spuId" label="spuId" width="100" align="center"></el-table-column>
      <el-table-column prop="spuCode" label="spu编码" width="140"></el-table-column>

      <el-table-column prop="spuName" label="商品名" width="160" align="center"></el-table-column>
      <el-table-column label="所属分类" width="160" align="center" v-if="cgList.length">
        <template slot-scope="scope">{{getFeilei(scope.row.categoryId)}}</template>
      </el-table-column>
      <el-table-column label="宽高" align="center" width="130">
        <template slot-scope="scope">{{scope.row.width}} X {{scope.row.height}} CM</template>
      </el-table-column>
      <el-table-column prop="scaling" label="缩放比例" align="center" width="100"></el-table-column>
      <el-table-column prop="spuType" label="类型" align="center" width="100"></el-table-column>
      <el-table-column prop="sort" label="排序" align="center" width="80"></el-table-column>
      <el-table-column label="商品图片预览" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.spuImageUrl + '?x-oss-process=image/resize,w_200'" width="100" />
        </template>
      </el-table-column>
      <el-table-column label="上架" align="center">
        <template slot-scope="scope">{{scope.row.isUpper ? '是' : '否'}}</template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
          <el-button size="small" type="primary" plain @click="editBtn(scope.row.spuId)">修改</el-button>
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

    <el-dialog title="新增SPU" :visible.sync="showAdd" width="500px">
      <el-form :model="addForm" size="small" label-width="100px">
        <el-form-item label="SPU名">
          <el-input v-model="addForm.spuName"></el-input>
        </el-form-item>
        <el-form-item label="SPU码">
          <el-input v-model="addForm.spuCode"></el-input>
        </el-form-item>
        <el-form-item label="所属分类">
          <el-select v-model="addForm.categoryId" placeholder="所属商品分类">
            <div v-for="item in cgList" :key="item.categoryId">
              <el-option
                v-if="item.status === 1"
                :label="item.categoryName"
                :value="item.categoryId"
              ></el-option>
            </div>
          </el-select>
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
        <el-form-item label="规格">
          <el-input v-model="addForm.width" placeholder="宽" type="number" style="width: 100px"></el-input>&nbsp;x
          <el-input v-model="addForm.height" placeholder="高" type="number" style="width: 100px"></el-input>&nbsp;CM
        </el-form-item>
        <el-form-item label="缩放比例">
          <el-input v-model="addForm.scaling" placeholder="取值范围1-100,默认100" type="number"></el-input>
        </el-form-item>

        <el-form-item label="SPU类型">
          <el-select v-model="addForm.spuType" placeholder="请选择">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
            <el-option label="儿童" value="儿童"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="分类排序">
          <el-input-number v-model="addForm.sort" controls-position="right" :min="1"></el-input-number>
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

    <el-dialog title="修改SPU" :visible.sync="showEdit" width="500px">
      <el-form :model="editForm" size="small" label-width="100px">
        <el-form-item label="SPU名">
          <el-input v-model="editForm.spuName"></el-input>
        </el-form-item>
        <el-form-item label="SPU码">
          <el-input v-model="editForm.spuCode"></el-input>
        </el-form-item>
        <!-- <el-form-item label="所属分类">
                    <el-select v-model="editForm.categoryId" placeholder="所属商品分类" disabled>
                        <el-option
                            v-for="item in cgList"
                            :key="item.categoryId"
                            :label="item.categoryName"
                            :value="item.categoryId"
                        ></el-option>
                    </el-select>
        </el-form-item>-->
        <el-form-item label="商品图片">
          <div v-if="!editimgup">
            <img
              :src="editForm.spuImageUrl + '?x-oss-process=image/resize,w_200'"
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
        <el-form-item label="规格">
          <el-input v-model="editForm.width" placeholder="宽" type="number" style="width: 100px"></el-input>&nbsp;x
          <el-input v-model="editForm.height" placeholder="高" type="number" style="width: 100px"></el-input>&nbsp;CM
        </el-form-item>

        <el-form-item label="缩放比例">
          <el-input v-model="editForm.scaling" placeholder="取值范围1-100,默认100" type="number"></el-input>
        </el-form-item>

        <el-form-item label="SPU类型">
          <el-select v-model="editForm.spuType" placeholder="请选择">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
            <el-option label="儿童" value="儿童"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="分类排序">
          <el-input-number v-model="editForm.sort" controls-position="right" :min="1"></el-input-number>
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
      cgList: [],
      pageNum: 1,
      totalPage: 0,
      showAdd: false,
      showEdit: false,
      ossUrl: "",
      ossData: {},
      editimgup: false,
      editUpload: false,
      addForm: {
        categoryId: "",
        height: "",
        isUpper: 1,
        sort: 1,
        spuCode: "",
        spuName: "",
        spuType: "",
        width: "",
        spuImageKey: "",
        scaling: ""
      },
      editForm: {},
      editSpuCode: ""
    };
  },
  methods: {
    getFeilei(id) {
      let name = "";
      this.cgList.forEach(item => {
        if (item.categoryId === id) {
          name = item.categoryName;
        }
      });

      return name;
    },
    addBtn() {
      this.showAdd = true;
      this.getOsspop();
    },
    editBtn(id) {
      this.getOsspop();
      this.editUpload = false;
      this.editimgup = false;
      new API(this).POST({
        url: "/goodsSpu/getGoodsSpuDetail?spuId=" + id,
        cb: res => {
          this.editForm = res;
          this.showEdit = true;
          this.editSpuCode = res.spuCode;
        }
      });
    },
    addSpu() {
      let {
        categoryId,
        height,
        width,
        spuImageKey,
        spuName,
        spuType,
        spuCode
      } = this.addForm;

      if (
        !categoryId ||
        !height ||
        !width ||
        !spuImageKey ||
        !spuName ||
        !spuType ||
        !spuCode
      ) {
        this.$message.error("请将spu信息填写完整");
        return;
      }

      if (!this.addForm.scaling) {
        this.addForm.scaling = 100;
      }

      new API(this).POST({
        url: "/goodsSpu/addGoodsSpu",
        params: this.addForm,
        cb: res => {
          if (res === null) {
            location.reload();
          }
        }
      });
    },
    editSpu() {
      let {
        height,
        width,
        isUpper,
        sort,
        spuId,
        spuImageKey,
        spuName,
        spuType,
        spuCode,
        scaling
      } = this.editForm;

      if (!height || !width || !spuImageKey || !spuName || !spuType) {
        this.$message.error("请将spu信息填写完整");
        return;
      }

      let dataForm = {
        height: height,
        width: width,
        isUpper: isUpper,
        sort: sort,
        spuId: spuId,
        spuImageKey: spuImageKey,
        spuName: spuName,
        spuType: spuType,
        scaling: scaling || 100
      };

      if (spuCode !== this.editSpuCode) {
        dataForm.spuCode = spuCode;
      }

      new API(this).POST({
        url: "/goodsSpu/updateGoodsSpu",
        params: dataForm,
        cb: res => {
          if (res === null) {
            location.reload();
          }
        }
      });
    },
    uploaded(type) {
      if (type === "edit" && this.editUpload) {
        this.editForm.spuImageKey = this.ossData.key;
      } else {
        this.addForm.spuImageKey = this.ossData.key;
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
    getOsspop() {
      this.ossUrl = "";
      this.ossData = {};
      new API(this).POST({
        url: "/oss/getSignature",
        params: {
          count: 1,
          type: 2
        },
        cb: res => {
          this.ossUrl = res.url;
          this.ossData = res.signatures[0];
        }
      });
    },
    getSKUList(val) {
      if (!isNaN(val)) {
        this.pageNum = val;
      } else {
        this.pageNum = 1;
      }
      new API(this).POST({
        url: "/goodsSpu/findGoodsSpuList",
        params: {
          categoryId: this.categoryId,
          count: true,
          pageNum: this.pageNum,
          pageSize: 10
        },
        cb: res => {
          let { pages, result } = res;
          this.totalPage = pages;
          this.tableData = result;
        }
      });
    }
  },
  created() {
    this.getSKUList();

    new API(this).POST({
      url: "/goodsCategory/findAllGoodsCategoryList",
      cb: res => {
        this.cgList = res;
      }
    });
  }
};
</script>