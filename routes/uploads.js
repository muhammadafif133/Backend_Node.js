const upload_options = {

multipart: true,

  formidable: {
    uploadDir: '/tmp/api/uploads'
  }
}

const koaBody = require('koa-body')(upload_options);