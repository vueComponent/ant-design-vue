// 代码中会兼容本地 service mock 以及部署站点的静态数据
module.exports = {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    name: 'Serati Ma',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    userid: '00000001',
    email: 'antdesign@alipay.com',
    signature: '海纳百川，有容乃大',
    title: '交互专家',
    group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
  },
  // GET POST 可省略
  'GET /api/users': [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ],
  'POST /api/login/account': (req, res) => {
    const { password, userName, type } = req.body;
    if (password === 'antdv' && userName === 'admin') {
      res.send({ status: 'ok', type });
      return;
    }
    if (password === 'antdv' && userName === 'user') {
      res.send({ status: 'ok', type });
      return;
    }
    res.send({ status: 'error', type });
  },
  'GET /api/login/captcha': (req, res) => {
    return res.json('captcha-xxx');
  },
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok' });
  },
};
