<template>
  <div class="lists">
    <div v-for="(item, idx) in list" :key="idx">
      <div v-if="item.children && item.children.length">
        <el-submenu :index="item.menuUrl">
          <template slot="title">
            <!-- <i class="el-icon-caret-right"></i> -->
            <router-link :to="item.menuUrl">{{item.menuName}}</router-link>
          </template>

          <NavList :list="item.children" :sub="true" :theId="String(idx) + '-'" />
        </el-submenu>
      </div>

      <div v-else>
        <el-menu-item :index="item.menuUrl">
          <!-- <i class="el-icon-caret-right" v-if="!sub"></i> -->
          <!-- <span slot="title">{{item.menuName}}</span> -->
          <router-link :to="item.menuUrl">{{item.menuName}}</router-link>
        </el-menu-item>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "NavList",
  props: ["list", "sub", "theId"],
  data() {
    return {};
  },
  methods: {}
};
</script>