<template>
  <div class="kz-tree__wrapper">
    <el-tree ref="kzTree" :data="treeData" lazy :load="loadTreeNode" highlight-current default-expand-all :render-content="nodeRender" class="kz-tree">
    </el-tree>
    <!--dialog-->
    <el-dialog :title="dialog.title" v-model="dialog.visible" :close-on-click-modal="false">
      <el-form :model="dialog.form" ref="dialogForm" :rules="dialog.rules" class="el-col-offset-1">
        <el-form-item label="单位名称" prop="name" label-width="120" required>
          <el-input v-model="dialog.form.name" auto-complete="off" class="el-col-12"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSubmit">取 消</el-button>
        <el-button type="primary" @click="submitForm" :loading="dialog.submiting">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'kz-tree',
  data() {
    // 声明保存当前操作分类node对象
    this.__currentNode = null
    return {
      treeData: [],
      /* 弹框 */
      dialog: {
        title: '增加分类',
        visible: false,
        submiting: false,
        form: {
          name: '',
          id: '',
          parent_id: 0
        },
        rules: {
          name: {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'orgid',
      'roleid'
    ])
  },
  methods: {
    /* 加载子分类 */
    loadTreeNode(treeItem, resolve) {
      let treeItemId = treeItem.data.id;
      let flag = false;//判断是否为第一次
      if (!treeItem.data.id) {
        treeItemId = this.orgid;
        flag = true;
      }
      this.$store.dispatch("GetTree", { treeItemId: treeItemId, flag: flag }).then(res => {
        resolve(res.data)
      }).catch({

      });
    },
    /* 构建分类title及工具 */
    nodeRender(h, { _self, node, data }) {
      // @todo: 使用jsx插件更好理解
      const childrenNodes = node.id === 1 ? [
        h('span', data.name),
        h('span',
          {
            'class': 'kz-tree-bar'
          },
          [
            // 添加
            h('i', {
              'class': 'el-icon-plus',
              on: {
                click: function(event) {
                  event.stopPropagation()
                  typeof _self.treeAdd === 'function' && _self.treeAdd(data, event, node)
                }
              }
            })
          ]
        )
      ]
        :
        [
          h('span', data.name),
          h('span',
            {
              'class': 'kz-tree-bar'
            },
            [
              // 编辑
              h('i', {
                'class': 'el-icon-edit',
                on: {
                  click: function(event) {
                    event.stopPropagation()
                    typeof _self.treeEdit === 'function' && _self.treeEdit(data, event, node)
                  }
                }
              }),
              // 添加
              h('i', {
                'class': 'el-icon-plus',
                on: {
                  click: function(event) {
                    event.stopPropagation()
                    typeof _self.treeAdd === 'function' && _self.treeAdd(data, event, node)
                  }
                }
              }),
              // 删除
              h('i', {
                'class': 'el-icon-close',
                props: {
                  'v-popover': 'delTreeConfirm'
                },
                on: {
                  click: function(event) {
                    event.stopPropagation()
                    typeof _self.treeDelete === 'function' && _self.treeDelete(data, event, node)
                  }
                }
              })
            ]
          )
        ]
      return h(
        'div',
        {
          'class': 'el-tree-node__label',
          prop: {
            children: '-'
          }
        },
        childrenNodes
      )
    },
    /* 添加 */
    treeAdd(treeItem, event, node) {
      this.__currentNode = node
      Object.assign(this.dialog, {
        title: '新增单位',
        visible: true,
        form: {
          name: '',
          id: '',
          parent_id: treeItem.id
        }
      })
    },
    /* 编辑 */
    treeEdit(treeItem, event, node) {
      this.__currentNode = node
      Object.assign(this.dialog, {
        title: '修改单位',
        visible: true,
        form: {
          name: treeItem.name,
          id: treeItem.id,
          parent_id: treeItem.parent_id
        }
      })
    },
    /* 删除 */
    treeDelete(treeItem, event, node) {
      const fetchDelOk = () => {
        this.$store.dispatch("DelTree", { id: treeItem.id }).then(res => {
          if (res.data.status === '0') {
            try {
              node.parent.removeChild(node)
            } catch (err) { console.error(err) }
            this.$notify({ message: '删除成功', type: 'success' })
          }
          else {
            this.$notify.error({
              title: '错误',
              message: '删除失败'
            });
          }
        }).catch({

        });
      }
      // 询问提示
      this.$confirm('是否删除此单位以及此单位的下级单位?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(fetchDelOk).catch(e => e)
    },
    /* ######## */
    /* 其他 */
    cancelSubmit() {
      this.dialog.visible = false
      this.$refs.dialogForm.resetFields()
    },
    submitForm() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) { // 验证通过
          this.fetchAddTreeNode()
        } else {
          return false
        }
      })
    },
    fetchAddTreeNode() {
      this.dialog.submiting = true
      this.$store.dispatch("SaveTree", this.dialog.form).then(data => {
        /* 隐藏dialog */
        Object.assign(this.dialog, {
          submiting: false,
          visible: false
        })
        this.$refs.dialogForm.resetFields()
        /* 提示结果 */
        const message = this.dialog.form.id ? '修改成功' : '添加成功'
        this.$message({ message: message, type: 'success' })

        if (this.dialog.form.id) { // 编辑
          this.__currentNode && this.$set(this.__currentNode, 'data', data.data)
        } else { // 新增
          /* treeNode api */
          if (this.__currentNode) { // 子分类添加子类
            this.__currentNode.doCreateChildren([data.data])
          }
        }
      }).catch({

      });

    }
  }
}
</script>

<style>
.kz-tree__wrapper {
  min-width: 300px;
  text-align: left;
}

.kz-tree__top {
  padding: 10px;
  text-align: right;
  border-bottom: 1px solid #ddd;
}

.el-tree-node {
  position: relative;
}

.el-tree-node__content:hover .kz-tree-bar {
  display: block;
}

.kz-tree-bar {
  display: none;
  position: absolute;
  top: 0;
  right: 10px;
  font-size: 12px;
}

.kz-tree-bar>i {
  margin: 0 5px;
  color: #999;
}

.kz-tree-bar>i:hover {
  color: #20a0ff;
}
</style>
