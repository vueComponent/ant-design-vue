const GitHub = require('@octokit/rest');
const Base64 = require('js-base64').Base64;
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

const owner = 'ant-design';
const repo = 'ant-design';
const tag = '3.26.13';
const clientId = '5f6ccfdc4cdc69f8ba12';
const clientSecret = process.env.CLIENT_SECRET;

const github = new GitHub();

async function syncFiles(data = []) {
  for (const item of data) {
    try {
      const { data: itemData } = await github.repos.getContents({
        owner,
        repo,
        path: `${item.path}`,
        ref: tag,
        client_id: clientId,
        client_secret: clientSecret,
      });
      if (Array.isArray(itemData)) {
        syncFiles(itemData);
      } else {
        const toPath = path.join(__dirname, '..', itemData.path.replace(`/${itemData.name}`, ''));
        if (!fs.existsSync(toPath)) {
          fse.ensureDirSync(toPath);
        }
        // eslint-disable-next-line no-console
        console.log('update style: ', path.join(toPath, itemData.name.replace('.tsx', '.js')));
        const content = Base64.decode(itemData.content);
        fs.writeFileSync(path.join(toPath, itemData.name.replace('.tsx', '.js')), content);
      }
    } catch (e) {}
  }
}
async function syncStyle() {
  const { data = [] } = await github.repos.getContents({
    owner,
    repo,
    path: 'components',
    ref: tag,
    client_id: clientId,
    client_secret: clientSecret,
  });

  for (const item of data) {
    try {
      if (item.name === 'style') {
        syncFiles([item]);
      } else {
        const { data: itemData } = await github.repos.getContents({
          owner,
          repo,
          path: `${item.path}/style`,
          ref: tag,
          client_id: clientId,
          client_secret: clientSecret,
        });
        syncFiles(itemData);
      }
    } catch (e) {}
  }
}
syncStyle();
