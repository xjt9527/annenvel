<template>
    <div class="imgsort-list">
        <div class="page-filter">
            <el-button @click="addBtn" type="success">新增分类</el-button>
        </div>
        <el-table :data="tableData" style="width: 100%" size="middle" border stripe>
            <el-table-column prop="categoryId" label="ID" width="80" align="center"></el-table-column>
            <el-table-column prop="categoryName" label="分类名"></el-table-column>
            <el-table-column label="分类图片" align="center">
                <template slot-scope="scope">
                    <img
                        :src="scope.row.categoryImageUrl+ '?x-oss-process=image/resize,w_200'"
                        width="120"
                        alt
                    />
                </template>
            </el-table-column>
            <el-table-column prop="sort" label="排序" width="120" align="center"></el-table-column>
            <el-table-column label="状态" width="100" align="center">
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.status">启用</el-tag>
                    <el-tag type="danger" v-else>禁用</el-tag>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="140" align="center">
                <template slot-scope="scope">
                    <el-button
                        size="small"
                        type="primary"
                        plain
                        @click="btnEdit(scope.row.categoryId)"
                    >修改</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="新增分类" :visible.sync="showPop" width="600px">
            <el-form :model="form" size="small" label-width="100px">
                <el-form-item label="分类名称">
                    <el-input v-model="form.categoryName"></el-input>
                </el-form-item>
                <el-form-item label="分类排序">
                    <el-input-number v-model="form.sort" controls-position="right" :min="1"></el-input-number>
                </el-form-item>

                <el-form-item label="分类图片">
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
                    <el-select v-model="form.status" placeholder="请选择">
                        <el-option :value="1" label="启用"></el-option>
                        <el-option :value="0" label="禁用"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align:center;">
                <el-button @click="showPop = false">取 消</el-button>
                <el-button type="primary" @click="addImgSort">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改图案分类" :visible.sync="showPop3" width="600px">
            <el-form :model="editForm" size="small" label-width="100px">
                <el-form-item label="分类名称">
                    <el-input v-model="editForm.categoryName"></el-input>
                </el-form-item>
                <el-form-item label="分类排序">
                    <el-input-number v-model="editForm.sort" controls-position="right" :min="1"></el-input-number>
                </el-form-item>

                <el-form-item label="分类图片">
                    <div v-if="!editimgup">
                        <img
                            :src="editForm.categoryImageUrl + '?x-oss-process=image/resize,w_200'"
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
                        <el-option :value="1" label="启用"></el-option>
                        <el-option :value="0" label="禁用"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="创建时间">{{editForm.createTime}}</el-form-item>
                <el-form-item label="更新时间">{{editForm.updateTime}}</el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align:center;">
                <el-button @click="showPop3 = false">取 消</el-button>
                <el-button type="primary" @click="editImgSort">确 定</el-button>
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
            editimgup: false,
            tableData: [],
            showPop: false,
            showPop3: false,
            form: {
                categoryName: "",
                categoryImageKey: "",
                sort: "",
                status: 1
            },
            ossUrl: "",
            ossData: {},
            editForm: {},
            editName: "",
            editUpload: false
        };
    },
    methods: {
        addImgSort() {
            new API(this).POST({
                url: "/designCategory/addDesignCategory",
                params: this.form,
                cb: res => {
                    if (res === null) {
                        location.reload();
                    }
                }
            });
        },
        addBtn() {
            this.showPop = true;
            this.ossUrl = "";
            this.ossData = {};
            this.getOsspop();
        },
        getOsspop() {
            new API(this).POST({
                url: "/oss/getSignature",
                params: {
                    count: 1,
                    type: 4
                },
                cb: res => {
                    this.ossUrl = res.url;
                    this.ossData = res.signatures[0];
                }
            });
        },
        uploaded(type) {
            if (type === "edit" && this.editUpload) {
                this.editForm.categoryImageKey = this.ossData.key;
            } else {
                this.form.categoryImageKey = this.ossData.key;
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
        btnEdit(id) {
            this.getOsspop();
            this.editUpload = false;
            this.editimgup = false;
            new API(this).POST({
                url: `/designCategory/getDesignCategoryDetail?categoryId=${id}`,
                cb: res => {
                    this.editForm = res;
                    this.showPop3 = true;
                    this.editName = res.categoryName;
                }
            });
        },
        editImgSort() {
            let {
                categoryId,
                categoryImageKey,
                categoryName,
                sort,
                status
            } = this.editForm;

            if (!categoryName) {
                this.$message.error("请填写分类名~");
                return;
            }

            let formData = {
                categoryId,
                categoryImageKey,
                sort,
                status
            };

            if (categoryName !== this.editName) {
                formData.categoryName = categoryName;
            }

            new API(this).POST({
                url: "/designCategory/updateDesignCategory",
                params: formData,
                cb: res => {
                    if (res === null) {
                        location.reload();
                    }
                }
            });
        }
    },
    created() {
        new API(this).POST({
            url: "/designCategory/findAllDesignCategoryList",
            cb: res => {
                this.tableData = res;
            }
        });
    }
};
</script>