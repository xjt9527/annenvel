// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false

Vue.use(ElementUI);


router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('token');
  if (to.name === 'Login') {

    if (token) {
      next({
        path: '/'
      })
    } else {
      next();

    }

  }

  if (token) {
    next();
  } else {
    next({
      path: '/login'
    })
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})


