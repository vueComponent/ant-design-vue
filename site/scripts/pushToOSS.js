/* eslint-disable @typescript-eslint/no-var-requires */
const OSS = require('ali-oss');
const path = require('path');
const fs = require('fs');

const accessKeyId = process.env.ALI_OSS_ACCESSKEY;
const accessKeySecret = process.env.ALI_OSS_SECRETKEY;

const client = new OSS({
  bucket: 'antdv-beijing',
  cname: 'true',
  endpoint: 'aliyuncdn.antdv.com',
  // region以杭州为例（oss-cn-hangzhou），其他region按实际情况填写。
  region: 'oss-cn-beijing',
  // 阿里云主账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM账号进行API访问或日常运维，请登录RAM控制台创建RAM账号。
  accessKeyId: accessKeyId,
  accessKeySecret: accessKeySecret,
});

const assetsPath = path.join(process.cwd(), 'dist', 'assets');

const put = file => {
  return new Promise((reslove, reject) => {
    client
      .put(`v2/assets/${file}`, path.join(assetsPath, file))
      .then(res => {
        if (res.res.status !== 200) {
          console.log(`${res.name} upload failed!`);
          reject();
          process.exit(500);
        } else {
          console.log(`${res.name} upload success!`);
          reslove();
        }
      })
      .catch(err => {
        if (err) {
          err && console.log(err);
          process.exit(500);
        }
      });
  });
};

async function upload() {
  try {
    const files = await fs.promises.readdir(assetsPath, {
      withFileTypes: true,
    });
    for (const file of files) {
      if (file.isFile()) {
        await put(file.name);
      }
    }
  } catch (err) {
    console.error(err);
  }
}
upload();
