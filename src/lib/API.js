import axios from 'axios';


const baseUrl = 'http://manager-api.anneleven.cn';

export default class API {
  constructor(vue) {
    this.vue = vue;

  }


  headers() {

    let token = localStorage.getItem('token') || '';

    return {
      headers: {
        accesstoken: token

      }
    }

  }

  relogin() {
    localStorage.clear();
    setTimeout(() => {
      location.reload();
    }, 1000)
  }

  GET({ url, params = {}, cb }) {
    axios.get(baseUrl + url, params, this.headers()).then(res => {

      let json = res.data;

      if (json.head.code) {
        this.vue.$message.error(json.head.msg)

        if (json.head.code === 10401) {
          this.relogin()
          return;
        }

        return;
      }

      cb(json.body)

    })
      .catch(err => {
        this.vue.$message.error(err)
      })
  }
  POST({ url, params = {}, cb, type }) {



    axios.post(baseUrl + url, params, this.headers()).then(res => {


      if (type === 'file') {
        console.log(res)
        return
      }

      let json = res.data;

      if (json.head.code) {
        this.vue.$message.error(json.head.msg)
        if (json.head.code === 10401) {
          this.relogin()
          return;
        }
        return;
      }

      cb(json.body)

    })
      .catch(err => {
        this.vue.$message.error(err)
      })
  }
}