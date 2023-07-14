/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const OSS = require('ali-oss');
const path = require('path');
const fs = require('fs');

const accessKeyId = process.env.ALI_OSS_ACCESSKEY;
const accessKeySecret = process.env.ALI_OSS_SECRETKEY;

const client = new OSS({
  bucket: '4x-antdv',
  cname: 'true',
  endpoint: '4x-antdv.oss-cn-beijing.aliyuncs.com',
  region: 'oss-cn-beijing',
  accessKeyId,
  accessKeySecret,
});

const assetsPath = path.join(process.cwd(), 'site', 'dist', 'assets');

const put = (target, source) => {
  return new Promise((reslove, reject) => {
    client
      .put(target, source)
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
        await put(`assets/${file.name}`, path.join(assetsPath, file.name));
      }
    }
    await put('index.html', path.join(process.cwd(), 'site', 'dist', 'index.html'));
  } catch (err) {
    console.error(err);
  }
}
upload();
