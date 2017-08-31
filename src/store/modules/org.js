import {
  getTree,
  addTree
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
    // 新增组织机构信息
    AddTree({
      commit
    }, params) {
      return new Promise((resolve, reject) => {
        addTree(params).then(response => {
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    }
  }
};

export default org;
