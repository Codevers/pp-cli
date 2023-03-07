/*
 * @Description: 

 * @Version: 1.0.1
 * @Autor: wsy
 * @Date: 2022-07-29 15:35:36
 * @LastEditors: wsy
 * @LastEditTime: 2022-07-29 16:52:35
 */
// BaseTableColumn.js
export default {
  functional: true,
  name: 'BaseTableColumn',
  props: {
    render: Function,
    align: {
      type: String,
      default: () => "left"
    },
    key: {
      type: String,
      default: () => "name"
    },
    label: String,
    width: {
      type: String,
      default: () => "100"
    },
    configs: Object
  },
  render(h, ctx) {
    return h("el-table-column",
      {
        props: {
          prop: ctx.props.key,
          label: ctx.props.label,
          align: ctx.props.align,
          ...configs
        },
        scopedSlots: {
          default: scope => {
            if (ctx.props.render) {
              return ctx.props.render(h, scope);
            }
            return h("span", scope.row[ctx.props.prop]);
          }
        }
      },

    );
  },
};

