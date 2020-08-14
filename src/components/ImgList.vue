<template>
  <div class="imgsort-list">
    <div class="page-filter">
      <el-select v-model="categoryId" placeholder="图案分类筛选">
        <div v-for="item in sortData" :key="item.categoryId">
          <el-option v-if="item.status === 1" :label="item.categoryName" :value="item.categoryId"></el-option>
        </div>
      </el-select>
      <el-button type="primary" @click="getImgList">筛选</el-button>&emsp;
      <el-button type="success" @click="btnAdd">新增图案</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" size="middle" border stripe>
      <el-table-column prop="designId" label="ID" align="center" width="100"></el-table-column>
      <el-table-column label="图案预览" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.designUrl+ '?x-oss-process=image/resize,w_200'" width="100" />
        </template>
      </el-table-column>
      <el-table-column label="底色" align="center">
        <template slot-scope="scope">{{scope.row.baseColor ==='W' ?'白' : '黑'}}</template>
      </el-table-column>

      <el-table-column label="状态" align="center" width="140">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status">启用</el-tag>
          <el-tag type="danger" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="small" type="primary" plain @click="btnEdit(scope.row.designId)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="site-page">
      <el-pagination
        background
        :page-count="totalPage"
        :current-page="pageNum"
        @current-change="getImgList"
        layout="prev, pager, next"
      ></el-pagination>
    </div>
    <el-dialog title="新增图案" :visible.sync="showAddPop" width="500px">
      <el-form :model="addForm" size="small" label-width="100px">
        <el-form-item label="所属分类">
          <el-select v-model="addForm.categoryId" placeholder="图案分类筛选">
            <div v-for="item in sortData" :key="item.categoryId">
              <el-option
                v-if="item.status === 1"
                :label="item.categoryName"
                :value="item.categoryId"
              ></el-option>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="背景颜色">
          <el-select v-model="addForm.baseColor" placeholder="请选择">
            <el-option label="白" value="W"></el-option>
            <el-option label="黑" value="B"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="图片上传">
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

        <el-form-item label="状态">
          <el-select v-model="addForm.status" placeholder="请选择">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button @click="showAddPop = false">取 消</el-button>
        <el-button type="primary" @click="addImg">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改图案" :visible.sync="showEditPop" width="500px">
      <el-form :model="editForm" size="small" label-width="100px">
        <el-form-item label="所属分类">
          <el-select v-model="editForm.categoryId" placeholder="图案分类筛选">
            <div v-for="item in sortData" :key="item.categoryId">
              <el-option
                v-if="item.status === 1"
                :label="item.categoryName"
                :value="item.categoryId"
              ></el-option>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="背景颜色">
          <el-select v-model="editForm.baseColor" placeholder="请选择">
            <el-option label="白" value="W"></el-option>
            <el-option label="黑" value="B"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="图案上传">
          <div v-if="!editimgup">
            <img
              :src="editForm.designUrl + '?x-oss-process=image/resize,w_200'"
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

        <el-form-item label="状态">
          <el-select v-model="editForm.status" placeholder="请选择">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">{{editForm.createTime}}</el-form-item>
        <el-form-item label="更新时间">{{editForm.updateTime}}</el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button @click="showEditPop = false">取 消</el-button>
        <el-button type="primary" @click="editImg">确 定</el-button>
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
      sortData: [],
      categoryId: "",
      pageNum: 1,
      totalPage: 0,
      showAddPop: false,
      showEditPop: false,
      ossUrl: "",
      ossData: {},
      addForm: {
        baseColor: "",
        categoryId: "",
        designKey: "",
        status: 1
      },
      editForm: {},
      editimgup: false,
      editUpload: false
    };
  },
  methods: {
    btnAdd() {
      this.showAddPop = true;
      this.ossUrl = "";
      this.ossData = {};
      this.getOss();
    },
    btnEdit(id) {
      this.getOss();
      this.editUpload = false;
      this.editimgup = false;
      new API(this).POST({
        url: "/design/getDesignDetail?designId=" + id,
        cb: res => {
          this.showEditPop = true;
          this.editForm = res;
        }
      });
    },
    getOss() {
      new API(this).POST({
        url: "/oss/getSignature",
        params: {
          count: 1,
          type: 5
        },
        cb: res => {
          this.ossUrl = res.url;
          this.ossData = res.signatures[0];
        }
      });
    },
    getImgList(val) {
      if (!isNaN(val)) {
        this.pageNum = val;
      } else {
        this.pageNum = 1;
      }
      new API(this).POST({
        url: "/design/findDesignList",
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
    },
    addImg() {
      let { baseColor, categoryId, designKey } = this.addForm;
      if (!baseColor || !categoryId || !designKey) {
        this.$message.error("请将新增图案信息填写完整~");
        return;
      }

      new API(this).POST({
        url: "/design/addDesign",
        params: this.addForm,
        cb: res => {
          if (res === null) {
            this.categoryId = "";
            this.getImgList();
            this.showAddPop = false;
          }
        }
      });
    },
    uploaded(val) {
      if (val === "edit" && this.editUpload) {
        this.editForm.designKey = this.ossData.key;
      } else {
        this.addForm.designKey = this.ossData.key;
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

      // this.ossData.key = this.ossData.key.replace("+xml", "");
      this.editUpload = true;
    },
    editImg() {
      new API(this).POST({
        url: "/design/updateDesign",
        params: this.editForm,
        cb: res => {
          if (res === null) {
            location.reload();
          }
        }
      });
    }
  },
  created() {
    // 图案分类
    new API(this).POST({
      url: "/designCategory/findAllDesignCategoryList",
      cb: res => {
        this.sortData = res;
      }
    });

    // 图案查询
    this.getImgList();
  }
};
</script>