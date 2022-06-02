const Koa = require('koa');
const koaBody = require('koa-body');
const axios = require('axios').default;
const app = new Koa();
app.use(koaBody());

const baseUrl = 'http://yapi.miguatech.com'

const request = (method = 'get', url, headers) => {
  url = baseUrl + url
  return new Promise((resolve, reject) => {
    axios({
      method,
      url,
      headers
    })
      .then(res => {
        if (res.status === 200) {
          resolve(res.data)
        } else {
          reject(res)
        }
      })
      .catch(err => {
        console.log('axios err', err);
        reject(err)
      })
  })
}

const getHeader = (body = {}) => {
  const { token, userId } = body
  const header = {
    'Cookie': `_yapi_token=${token}; _yapi_uid=${userId}`,
    'Accept': 'application/json, text/plain, */*'
  }
  return header
}

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});



app.use(async ctx => {
  const {  url } = ctx.request
  const headers = getHeader(ctx.request.body)
  const defaultMethod = "GET"
  const res =  await request(defaultMethod, url, headers)
  ctx.body = res;
});

app.on('error', err => {
  console.log('server error', err)
});

app.listen(3333, () => {
  console.log('服务启动在http://127.0.0.1:3333/');
})