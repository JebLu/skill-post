import { param2Obj } from 'utils';

const userMap = {
  admin: {
    role: ['admin'],
    token: 'admin',
    introduction: '我是管理员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Admin'
  },
  organizer: {
    role: ['organizer'],
    token: 'organizer',
    introduction: '我是主管单位',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Organizer'
  },
  user: {
    role: ['user'],
    token: 'user',
    introduction: '我是事业单位',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'User'
  }
}

export default {
  login: config => {
    console.log(config);
    const { username } = JSON.parse(config.body);
    return userMap[username];
  },
  getInfo: config => {
    const { token } = param2Obj(config.url);
    if (userMap[token]) {
      return userMap[token];
    } else {
      return Promise.reject('a');
    }
  },
  logout: () => 'success'
};
