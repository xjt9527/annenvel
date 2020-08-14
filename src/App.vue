<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
export default {
    name: "App"
};
</script>

<style lang="less">
@media print {
    @page {
        margin: 0;
    }
    body {
        margin: 1cm;
    }
}
html,
body {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: auto;
}
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 14px;
    height: 100%;
    overflow: auto;
}

a {
    color: inherit;
    text-decoration: none;
}

.order-piao {
    margin: 0;
    padding: 10px;
    line-height: 2.8;
    font-size: 14px;
    .op {
        padding: 10px 0 130px;
        page-break-before: auto;
        page-break-after: always;
    }
    .PageNext {
        page-break-after: always;
    }
    .goback {
        font-size: 12px;
        position: absolute;
        left: 10px;
        top: 35px;
        border: solid 1px #cacaca;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        font-family: "宋体";
        color: #bababa;
    }
    .logo {
        padding-bottom: 20px;
        line-height: 1.4;
        img {
            margin: 0;
        }
    }
    .ewm {
        padding: 10px 0 120px;
        text-align: center;
        img {
            margin: 0 auto;
            width: 120px;
        }
    }
}
</style>
