import {
  login,
  logout,
  getInfo
} from 'api/login';
import {
  getToken,
  setToken,
  removeToken
} from 'utils/auth';

const user = {
  state: {
    user: '',
    status: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    orgid:'',
    roles: [],
    roleid:'',
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_ORGID: (state, orgid) => {
      state.orgid = orgid;
    },
    SET_ROLEID: (state, roleid) => {
      state.roleid = roleid;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction;
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting;
    },
    SET_STATUS: (state, status) => {
      state.status = status;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    LOGIN_SUCCESS: () => {
      console.log('login success')
    },
    LOGOUT_USER: state => {
      state.user = '';
    }
  },

  actions: {
    // 登录
    Login({
      commit
    }, userInfo) {
      const username = userInfo.username.trim();
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          if (response.data.status === '0') {
/*             alert(response.data.msg); */
            const data = response.data;
            setToken(response.data.user.id);
            commit('SET_TOKEN', data.user.id);
          }
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 获取用户信息
    GetInfo({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data;
          const roles = [data.nameen];
          commit('SET_ROLES', roles);
          commit('SET_NAME', data.name);
          commit('SET_ORGID', data.orgid);
          commit('SET_ROLEID', data.roleid);
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 登出
    LogOut({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          removeToken();
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 前端 登出
    FedLogOut({
      commit
    }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        removeToken();
        resolve();
      });
    }
  }
};

export default user;
