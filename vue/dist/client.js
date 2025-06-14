import { renderToString as s, ink as r } from "ink-mde";
import { defineComponent as a, openBlock as d, createElementBlock as p } from "vue";
var h = { BASE_URL: "/", MODE: "production", DEV: !1, PROD: !0, SSR: !1 };
const c = a({
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
    modelValue(t) {
      var n, e;
      ((n = this.instance) == null ? void 0 : n.getDoc()) !== t && ((e = this.instance) == null || e.update(t));
    },
    options: {
      deep: !0,
      handler(t, n) {
        var e;
        (e = this.instance) == null || e.reconfigure(t);
      }
    }
  },
  created() {
    h.VITE_SSR && (this.html = s(this.options));
  },
  mounted() {
    this.tryInit();
  },
  updated() {
    this.tryInit();
  },
  methods: {
    tryInit() {
      var t;
      this.$refs.ink && !this.instance && (this.instance = r(this.$refs.ink, {
        ...this.options,
        doc: this.modelValue,
        hooks: {
          ...(t = this.options) == null ? void 0 : t.hooks,
          afterUpdate: (n) => {
            var e, i;
            this.$emit("update:modelValue", n), (i = (e = this.options) == null ? void 0 : e.hooks) != null && i.afterUpdate && this.options.hooks.afterUpdate(n);
          }
        }
      }), this.$refs.ink.addEventListener("input", (n) => {
        n.stopPropagation();
      }));
    }
  }
}), f = (t, n) => {
  const e = t.__vccOpts || t;
  for (const [i, o] of n)
    e[i] = o;
  return e;
}, l = ["innerHTML"];
function u(t, n, e, i, o, m) {
  return d(), p("div", {
    ref: "ink",
    innerHTML: t.html
  }, null, 8, l);
}
const V = /* @__PURE__ */ f(c, [["render", u]]);
export {
  V as InkMde,
  V as default
};
//# sourceMappingURL=client.js.map
