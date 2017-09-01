import {
  getTree,
  saveTree,
  delTree
} from 'api/org';
const org = {
  mutations: {
    SET_TREEDATA: (state, treeData) => {
      state.treeData = treeData;
    }
  },

  actions: {
    // 获取组织机构信息
    GetTree({
      commit
    }, params) {
      return new Promise((resolve, reject) => {
        getTree(params.treeItemId, params.flag).then(response => {
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    },
    // 保存组织机构信息
    SaveTree({
      commit
    }, params) {
      return new Promise((resolve, reject) => {
        saveTree(params).then(response => {
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    },
    // 获取组织机构信息
    DelTree({
      commit
    }, params) {
      return new Promise((resolve, reject) => {
        delTree(params.id).then(response => {
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    }
  }
};

export default org;
