import { renderToString, ink } from "ink-mde";
import { defineComponent, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
const _sfc_main = defineComponent({
  name: "InkMde",
  props: {
    modelValue: {
      type: String
    },
    options: {
      type: Object
    }
  },
  emits: ["update:modelValue"],
  data() {
    return {
      html: "",
      instance: void 0
    };
  },
  watch: {
    modelValue(value) {
      var _a, _b;
      if (((_a = this.instance) == null ? void 0 : _a.getDoc()) !== value) {
        (_b = this.instance) == null ? void 0 : _b.update(value);
      }
    },
    options: {
      deep: true,
      handler(newValue, _oldValue) {
        var _a;
        (_a = this.instance) == null ? void 0 : _a.reconfigure(newValue);
      }
    }
  },
  created() {
    {
      this.html = renderToString(this.options);
    }
  },
  mounted() {
    this.tryInit();
  },
  updated() {
    this.tryInit();
  },
  methods: {
    tryInit() {
      var _a;
      if (this.$refs.ink && !this.instance) {
        this.instance = ink(this.$refs.ink, {
          ...this.options,
          doc: this.modelValue,
          hooks: {
            ...(_a = this.options) == null ? void 0 : _a.hooks,
            afterUpdate: (doc) => {
              var _a2, _b;
              this.$emit("update:modelValue", doc);
              if ((_b = (_a2 = this.options) == null ? void 0 : _a2.hooks) == null ? void 0 : _b.afterUpdate) {
                this.options.hooks.afterUpdate(doc);
              }
            }
          }
        });
        this.$refs.ink.addEventListener("input", (event) => {
          event.stopPropagation();
        });
      }
    }
  }
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ ref: "ink" }, _attrs))}>${_ctx.html ?? ""}</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/InkMde.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const InkMde = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  InkMde,
  InkMde as default
};
//# sourceMappingURL=index.js.map
