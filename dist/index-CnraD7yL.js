import { getNextElement as f, getNextMarker as h, insert as p, createComponent as c, memo as Fe, template as g, setProperty as de, effect as ie, setAttribute as be, runHydrationEvents as ue, delegateEvents as ye, use as $e, spread as Ue, mergeProps as Qe, hydrate as Xe, render as Ke } from "solid-js/web";
import { syntaxTree as fe, syntaxHighlighting as Ye, HighlightStyle as Ze } from "@codemirror/language";
import { SelectionRange as Je, EditorSelection as Ge, Compartment as me, RangeSetBuilder as we, EditorState as et } from "@codemirror/state";
import { defaultKeymap as tt, historyKeymap as nt, history as ot } from "@codemirror/commands";
import { EditorView as Y, Decoration as q, ViewPlugin as _e, keymap as rt } from "@codemirror/view";
import { markdown as Ce, markdownLanguage as Se } from "@codemirror/lang-markdown";
import { languages as Le } from "@codemirror/language-data";
import { tags as u } from "@lezer/highlight";
import { createSignal as O, Show as x, onMount as Me, onCleanup as it, For as at, createEffect as st, createContext as lt, useContext as ct } from "solid-js";
const dt = "data-ink-mde-ssr-hydration-marker", ut = `[${dt}]`, ft = () => ({}), mt = ([e]) => {
  const { editor: t } = e();
  t.destroy();
}, ae = ([e]) => {
  const { editor: t } = e();
  t.hasFocus || t.focus();
};
var ee = /* @__PURE__ */ ((e) => (e.Auto = "auto", e.Dark = "dark", e.Light = "light", e))(ee || {}), v = /* @__PURE__ */ ((e) => (e.Bold = "bold", e.Code = "code", e.CodeBlock = "code_block", e.Heading = "heading", e.Image = "image", e.Italic = "italic", e.Link = "link", e.List = "list", e.OrderedList = "ordered_list", e.Quote = "quote", e.TaskList = "task_list", e))(v || {}), se = /* @__PURE__ */ ((e) => (e.End = "end", e.Start = "start", e))(se || {});
const xe = {
  auto: "auto",
  dark: "dark",
  light: "light"
}, F = {
  completion: "completion",
  default: "default",
  grammar: "grammar",
  language: "language"
}, je = (e) => {
  const t = e.map((n) => Je.fromJSON({ anchor: n.start, head: n.end }));
  return Ge.create(t);
}, Ee = (e) => e.ranges.map((n) => ({
  end: n.anchor < n.head ? n.head : n.anchor,
  start: n.head < n.anchor ? n.head : n.anchor
})), E = (e) => ({ ...{
  block: !1,
  line: !1,
  multiline: !1,
  nodes: [],
  prefix: "",
  prefixStates: [],
  suffix: ""
}, ...e }), pt = {
  [v.Bold]: E({
    nodes: ["StrongEmphasis"],
    prefix: "**",
    suffix: "**"
  }),
  [v.Code]: E({
    nodes: ["InlineCode"],
    prefix: "`",
    suffix: "`"
  }),
  [v.CodeBlock]: E({
    block: !0,
    nodes: ["FencedCode"],
    prefix: "```\n",
    suffix: "\n```"
  }),
  [v.Heading]: E({
    multiline: !0,
    nodes: ["ATXHeading1", "ATXHeading2", "ATXHeading3", "ATXHeading4", "ATXHeading5", "ATXHeading6"],
    prefix: "# ",
    prefixStates: ["# ", "## ", "### ", "#### ", "##### ", "###### ", ""]
  }),
  [v.Image]: E({
    nodes: ["Image"],
    prefix: "![](",
    suffix: ")"
  }),
  [v.Italic]: E({
    nodes: ["Emphasis"],
    prefix: "*",
    suffix: "*"
  }),
  [v.Link]: E({
    nodes: ["Link"],
    prefix: "[](",
    suffix: ")"
  }),
  [v.OrderedList]: E({
    line: !0,
    multiline: !0,
    nodes: ["OrderedList"],
    prefix: "1. "
  }),
  [v.Quote]: E({
    line: !0,
    multiline: !0,
    nodes: ["Blockquote"],
    prefix: "> "
  }),
  [v.TaskList]: E({
    line: !0,
    multiline: !0,
    nodes: ["BulletList"],
    prefix: "- [ ] "
  }),
  [v.List]: E({
    line: !0,
    multiline: !0,
    nodes: ["BulletList"],
    prefix: "- "
  })
}, gt = ({ editor: e, selection: t }) => {
  let n = t.start;
  const o = [];
  for (; n <= t.end; ) {
    const r = e.lineBlockAt(n), i = Math.max(t.start, r.from), s = Math.min(t.end, r.to);
    o.push({ start: i, end: s }), n = r.to + 1;
  }
  return o;
}, kt = ({ editor: e, formatDefinition: t, selection: n }) => {
  if (!e || !t)
    return n || { start: 0, end: 0 };
  const o = n || Ee(e.state.selection).pop() || { start: 0, end: 0 };
  if (t.block || t.line || t.multiline) {
    const s = e.lineBlockAt(o.start).from, a = e.lineBlockAt(o.end).to;
    return { start: s, end: a };
  }
  const r = e.state.wordAt(o.start)?.from || o.start, i = e.state.wordAt(o.end)?.to || o.end;
  return { start: r, end: i };
}, He = (e) => e.editor.state.sliceDoc(e.selection.start, e.selection.end), ht = (e, t, n) => bt(e, n).find(({ type: r }) => t.nodes.includes(r.name)), bt = (e, t) => {
  const n = [];
  return fe(e.state).iterate({
    from: t.start,
    to: t.end,
    enter: ({ type: o, from: r, to: i }) => {
      n.push({ type: o, from: r, to: i });
    }
  }), n;
}, pe = (e) => {
  const t = He(e), n = e.formatDefinition.prefix.length, o = e.formatDefinition.suffix.length * -1 || t.length, r = t.slice(n, o);
  return [{ from: e.selection.start, to: e.selection.end, insert: r }];
}, xt = (e) => {
  if (e.node) {
    const t = e.node.from, n = e.node.to;
    return pe({ ...e, selection: { start: t, end: n } });
  } else {
    const t = e.formatDefinition.prefix, n = e.formatDefinition.suffix;
    return [
      { from: e.selection.start, insert: t },
      { from: e.selection.end, insert: n }
    ];
  }
}, vt = (e) => {
  const t = gt(e), n = [];
  return t.forEach((o) => {
    const r = ze({ ...e, selection: o });
    n.push(...r);
  }), n;
}, ze = (e) => {
  const t = e.formatDefinition.prefixStates.length > 0, n = He(e);
  if (e.node && t) {
    const o = e.formatDefinition.prefixStates.find((r) => n.startsWith(r));
    if (o) {
      const r = e.formatDefinition.prefixStates.indexOf(o), i = e.formatDefinition.prefixStates[r + 1], s = n.replace(new RegExp(`^${o}`), i);
      return [{ from: e.selection.start, to: e.selection.end, insert: s }];
    }
  } else if (e.node && n.startsWith(e.formatDefinition.prefix))
    return pe(e);
  return [{ from: e.selection.start, insert: e.formatDefinition.prefix }];
}, yt = (e) => {
  if (e.node) {
    const t = e.node.from, n = e.node.to;
    return pe({ ...e, selection: { start: t, end: n } });
  } else {
    const { formatDefinition: t, selection: n } = e, o = Array.isArray(t.prefix) ? t.prefix[0] : t.prefix, r = t.suffix;
    return [
      { from: n.start, insert: o },
      { from: n.end, insert: r }
    ];
  }
}, $t = (e) => e.formatDefinition.block ? xt(e) : e.formatDefinition.multiline ? vt(e) : e.formatDefinition.line ? ze(e) : yt(e), Ae = ([e], t, { selection: n } = {}) => {
  const { editor: o } = e(), r = pt[t], i = kt({ editor: o, formatDefinition: r, selection: n }), s = ht(o, r, i), l = $t({
    editor: o,
    formatDefinition: r,
    node: s,
    selection: i
  }), d = l.reduce((S, $) => {
    const M = $.insert.length - (($.to || $.from) - $.from);
    return S + M;
  }, 0), m = e().editor.state.update({ changes: l, selection: { head: i.start, anchor: i.end + d } });
  e().editor.dispatch(m);
}, wt = ([e]) => {
  const { editor: t } = e();
  return t.state.sliceDoc();
}, ge = ([e]) => {
  const { editor: t } = e();
  return Ee(t.state.selection);
}, te = ([e, t], n, o, r = !1) => {
  const { editor: i } = e();
  let s = o?.start, a = o?.end || o?.start;
  if (typeof s > "u") {
    const d = ge([e, t]).pop();
    s = d.start, a = d.end;
  }
  const l = { changes: { from: s, to: a, insert: n } };
  if (r) {
    const d = s === a ? s + n.length : s, m = s + n.length;
    Object.assign(l, { selection: { anchor: d, head: m } });
  }
  i.dispatch(
    i.state.update(l)
  );
}, _t = {
  array: "[object Array]",
  asyncFunction: "[object AsyncFunction]",
  boolean: "[object Boolean]",
  function: "[object Function]",
  null: "[object Null]",
  number: "[object Number]",
  object: "[object Object]",
  promise: "[object Promise]",
  string: "[object String]",
  symbol: "[object Symbol]",
  undefined: "[object Undefined]",
  window: "[object Window]"
}, Ct = (e, t) => Object.prototype.toString.call(t) === e, Be = (e) => Ct(_t.promise, e), ne = (e) => Mt(e, Be), St = (e, t) => t.type === e, Lt = (e, t) => !!e && e in t, U = (e, t) => Te(t.plugins).reduce((n, o) => (St(e, o) && (!o.key || Lt(o.key, t) && t[o.key]) && n.push(o.value), n), []), Te = (e) => e.reduce((t, n) => Array.isArray(n) ? t.concat(Te(n)) : t.concat(n), []), Mt = (e, t) => e.reduce((n, o) => (t(o) ? n[0].push(o) : n[1].push(o), n), [[], []]), jt = ([e, t]) => {
  const n = [], [o, r] = Et(e().options), [i, s] = Ht(e().options);
  return Math.max(o.length, i.length) > 0 && e().workQueue.enqueue(async () => {
    const a = await oe([e, t]);
    e().editor.dispatch({ effects: a });
  }), Ce({
    base: Se,
    codeLanguages: [...Le, ...s],
    extensions: [...n, ...r]
  });
}, Et = (e) => ne(U(F.grammar, e)), Ht = (e) => ne(U(F.language, e)), zt = async ([e]) => {
  const t = [], n = await Promise.all(U(F.grammar, e().options)), o = await Promise.all(U(F.language, e().options));
  return Ce({
    base: Se,
    codeLanguages: [...Le, ...o],
    extensions: [...t, ...n]
  });
}, At = () => {
  const e = new me();
  return {
    compartment: e,
    initialValue: (t) => e.of(jt(t)),
    reconfigure: async (t) => e.reconfigure(await zt(t))
  };
}, ve = () => document.createElement("div"), Pe = () => window.matchMedia("(prefers-color-scheme: dark)").matches, Bt = (e) => e === ee.Dark ? !0 : e === ee.Light ? !1 : Pe(), re = (e) => {
  const t = [
    // --ink-*
    { suffix: "border-radius", default: "0.25rem" },
    { suffix: "color", default: "currentColor" },
    { suffix: "flex-direction", default: "column" },
    { suffix: "font-family", default: "inherit" },
    // --ink-block-*
    { suffix: "block-background-color", default: "#121212", light: "#f5f5f5" },
    { suffix: "block-background-color-on-hover", default: "#0f0f0f", light: "#e0e0e0" },
    { suffix: "block-max-height", default: "20rem" },
    { suffix: "block-padding", default: "0.5rem" },
    // --ink-code-*
    { suffix: "code-background-color", default: "var(--ink-internal-block-background-color)" },
    { suffix: "code-color", default: "inherit" },
    { suffix: "code-font-family", default: "'Monaco', Courier, monospace" },
    // --ink-editor-*
    { suffix: "editor-font-size", default: "1em" },
    { suffix: "editor-line-height", default: "2em" },
    { suffix: "editor-padding", default: "0.5rem" },
    { suffix: "inline-padding", default: "0.125rem" },
    // --ink-modal-*
    { suffix: "modal-position", default: "fixed" },
    // --ink-syntax-*
    { suffix: "syntax-atom-color", default: "#d19a66" },
    { suffix: "syntax-comment-color", default: "#abb2bf" },
    { suffix: "syntax-comment-font-style", default: "italic" },
    { suffix: "syntax-emphasis-color", default: "inherit" },
    { suffix: "syntax-emphasis-font-style", default: "italic" },
    { suffix: "syntax-hashtag-background-color", default: "#222", light: "#eee" },
    { suffix: "syntax-hashtag-color", default: "inherit" },
    { suffix: "syntax-heading-color", default: "inherit" },
    { suffix: "syntax-heading-font-weight", default: "600" },
    { suffix: "syntax-heading1-color", default: "var(--ink-internal-syntax-heading-color, inherit)" },
    { suffix: "syntax-heading1-font-size", default: "1.6em" },
    { suffix: "syntax-heading1-font-weight", default: "600" },
    { suffix: "syntax-heading2-color", default: "var(--ink-internal-syntax-heading-color, inherit)" },
    { suffix: "syntax-heading2-font-size", default: "1.5em" },
    { suffix: "syntax-heading2-font-weight", default: "600" },
    { suffix: "syntax-heading3-color", default: "var(--ink-internal-syntax-heading-color, inherit)" },
    { suffix: "syntax-heading3-font-size", default: "1.4em" },
    { suffix: "syntax-heading3-font-weight", default: "600" },
    { suffix: "syntax-heading4-color", default: "var(--ink-internal-syntax-heading-color, inherit)" },
    { suffix: "syntax-heading4-font-size", default: "1.3em" },
    { suffix: "syntax-heading4-font-weight", default: "600" },
    { suffix: "syntax-heading5-color", default: "var(--ink-internal-syntax-heading-color, inherit)" },
    { suffix: "syntax-heading5-font-size", default: "1.2em" },
    { suffix: "syntax-heading5-font-weight", default: "600" },
    { suffix: "syntax-heading6-color", default: "var(--ink-internal-syntax-heading-color, inherit)" },
    { suffix: "syntax-heading6-font-size", default: "1.1em" },
    { suffix: "syntax-heading6-font-weight", default: "600" },
    { suffix: "syntax-highlight-background-color", default: "#555555" },
    { suffix: "syntax-keyword-color", default: "#c678dd" },
    { suffix: "syntax-link-color", default: "inherit" },
    { suffix: "syntax-meta-color", default: "#abb2bf" },
    { suffix: "syntax-monospace-color", default: "var(--ink-internal-code-color)" },
    { suffix: "syntax-monospace-font-family", default: "var(--ink-internal-code-font-family)" },
    { suffix: "syntax-name-color", default: "#d19a66" },
    { suffix: "syntax-name-label-color", default: "#abb2bf" },
    { suffix: "syntax-name-property-color", default: "#96c0d8" },
    { suffix: "syntax-name-property-definition-color", default: "#e06c75" },
    { suffix: "syntax-name-variable-color", default: "#e06c75" },
    { suffix: "syntax-name-variable-definition-color", default: "#e5c07b" },
    { suffix: "syntax-name-variable-local-color", default: "#d19a66" },
    { suffix: "syntax-name-variable-special-color", default: "inherit" },
    { suffix: "syntax-number-color", default: "#d19a66" },
    { suffix: "syntax-operator-color", default: "#96c0d8" },
    { suffix: "syntax-processing-instruction-color", default: "#444444", light: "#bbbbbb" },
    { suffix: "syntax-punctuation-color", default: "#abb2bf" },
    { suffix: "syntax-strikethrough-color", default: "inherit" },
    { suffix: "syntax-strikethrough-text-decoration", default: "line-through" },
    { suffix: "syntax-string-color", default: "#98c379" },
    { suffix: "syntax-string-special-color", default: "inherit" },
    { suffix: "syntax-strong-color", default: "inherit" },
    { suffix: "syntax-strong-font-weight", default: "600" },
    { suffix: "syntax-url-color", default: "#aaaaaa", light: "#666666" },
    { suffix: "toolbar-group-spacing", default: "2rem" },
    { suffix: "toolbar-item-spacing", default: "0" }
  ], n = !Bt(e.options.interface.appearance);
  return t.map((o) => {
    const r = n && o.light ? o.light : o.default;
    return `--ink-internal-${o.suffix}: var(--ink-${o.suffix}, ${r});`;
  });
}, Tt = (e) => [
  Y.theme({
    ".cm-scroller": {
      fontFamily: "var(--ink-internal-font-family)"
    }
  }, { dark: e })
], Pt = ([e, t]) => e().extensions.map((o) => o.initialValue([e, t])), oe = async ([e, t]) => await Promise.all(
  e().extensions.map(async (o) => await o.reconfigure([e, t]))
), qt = (e) => {
  const t = new me();
  return {
    compartment: t,
    initialValue: (n) => t.of(e(n)),
    reconfigure: (n) => t.reconfigure(e(n))
  };
}, Dt = (e) => {
  const t = new me();
  return {
    compartment: t,
    initialValue: () => t.of([]),
    reconfigure: (n) => e(n, t)
  };
}, Vt = () => [
  At(),
  ...Ot.map((e) => qt(e)),
  ...Nt.map((e) => Dt(e))
], Ot = [
  ([e]) => {
    const [t, n] = ne(U(F.default, e().options));
    return n;
  },
  ([e]) => {
    const t = e().options.interface.appearance === xe.dark, n = e().options.interface.appearance === xe.auto;
    return Tt(t || n && Pe());
  }
], Nt = [
  async ([e], t) => {
    const [n] = ne(U(F.default, e().options));
    return n.length > 0 ? t.reconfigure(await Promise.all(n)) : t.reconfigure([]);
  },
  async ([e], t) => {
    if (e().options.interface.autocomplete) {
      const { autocomplete: n } = await import("./autocomplete-6i4bES6-.js");
      return t.reconfigure(n(e().options));
    }
    return t.reconfigure([]);
  },
  async ([e], t) => {
    if (e().options.interface.images) {
      const { images: n } = await import("./images-DBpBKS7p.js");
      return t.reconfigure(n());
    }
    return t.reconfigure([]);
  },
  async ([e], t) => {
    const { keybindings: n, trapTab: o } = e().options, r = o ?? n.tab, i = o ?? n.shiftTab;
    if (r || i) {
      const { indentWithTab: s } = await import("./indentWithTab-Dc_NgyPN.js");
      return t.reconfigure(s({ tab: r, shiftTab: i }));
    }
    return t.reconfigure([]);
  },
  async ([e], t) => {
    const { options: n } = e();
    if (n.lists || n.interface.lists) {
      const { lists: o } = await import("./lists-CFI8KVHO.js");
      let r = !0, i = !0, s = !0;
      return typeof n.lists == "object" && (r = typeof n.lists.bullet > "u" ? !1 : n.lists.bullet, i = typeof n.lists.number > "u" ? !1 : n.lists.number, s = typeof n.lists.task > "u" ? !1 : n.lists.task), t.reconfigure(o({ bullet: r, number: i, task: s }));
    }
    return t.reconfigure([]);
  },
  async ([e], t) => {
    if (e().options.placeholder) {
      const { placeholder: n } = await import("./placeholder-CkKX2y6L.js");
      return t.reconfigure(n(e().options.placeholder));
    }
    return t.reconfigure([]);
  },
  async ([e], t) => {
    if (e().options.interface.readonly) {
      const { readonly: n } = await import("./readonly-tcxWvTqP.js");
      return t.reconfigure(n());
    }
    return t.reconfigure([]);
  },
  async ([e], t) => {
    if (e().options.search) {
      const { search: n } = await import("./search-CWpMe5al.js");
      return t.reconfigure(n());
    }
    return t.reconfigure([]);
  },
  async ([e], t) => {
    if (e().options.interface.spellcheck) {
      const { spellcheck: n } = await import("./spellcheck-DIi2vwCn.js");
      return t.reconfigure(n());
    }
    return t.reconfigure([]);
  },
  async ([e], t) => {
    if (e().options.vim) {
      const { vim: n } = await import("./vim-BYkc2D-Z.js");
      return t.reconfigure(n());
    }
    return t.reconfigure([]);
  }
], Rt = [
  "Blockquote"
], Wt = q.line({ attributes: { class: "cm-blockquote" } }), It = q.line({ attributes: { class: "cm-blockquote-open" } }), Ft = q.line({ attributes: { class: "cm-blockquote-close" } }), Ut = _e.define((e) => ({
  update: () => Qt(e)
}), { decorations: (e) => e.update() }), Qt = (e) => {
  const t = new we(), n = fe(e.state);
  for (const o of e.visibleRanges)
    for (let r = o.from; r < o.to; ) {
      const i = e.state.doc.lineAt(r);
      n.iterate({
        enter({ type: s, from: a, to: l }) {
          if (s.name !== "Document" && Rt.includes(s.name)) {
            t.add(i.from, i.from, Wt);
            const d = e.state.doc.lineAt(a), m = e.state.doc.lineAt(l);
            return d.number === i.number && t.add(i.from, i.from, It), m.number === i.number && t.add(i.from, i.from, Ft), !1;
          }
        },
        from: i.from,
        to: i.to
      }), r = i.to + 1;
    }
  return t.finish();
}, Xt = () => [
  Ut
], Kt = [
  "CodeBlock",
  "FencedCode",
  "HTMLBlock",
  "CommentBlock"
], Q = {
  // Prevent spellcheck in all code blocks. The Grammarly extension might not respect these values.
  "data-enable-grammarly": "false",
  "data-gramm": "false",
  "data-grammarly-skip": "true",
  spellcheck: "false"
}, Yt = q.line({ attributes: { ...Q, class: "cm-codeblock" } }), Zt = q.line({ attributes: { ...Q, class: "cm-codeblock-open" } }), Jt = q.line({ attributes: { ...Q, class: "cm-codeblock-close" } }), Gt = q.mark({ attributes: { ...Q, class: "cm-code" } }), en = q.mark({ attributes: { ...Q, class: "cm-code cm-code-open" } }), tn = q.mark({ attributes: { ...Q, class: "cm-code cm-code-close" } }), nn = _e.define((e) => ({
  update: () => on(e)
}), { decorations: (e) => e.update() }), on = (e) => {
  const t = new we(), n = fe(e.state);
  for (const o of e.visibleRanges)
    for (let r = o.from; r < o.to; ) {
      const i = e.state.doc.lineAt(r);
      let s;
      n.iterate({
        enter({ type: a, from: l, to: d }) {
          if (a.name !== "Document")
            if (Kt.includes(a.name)) {
              t.add(i.from, i.from, Yt);
              const m = e.state.doc.lineAt(l), S = e.state.doc.lineAt(d);
              return m.number === i.number && t.add(i.from, i.from, Zt), S.number === i.number && t.add(i.from, i.from, Jt), !1;
            } else
              a.name === "InlineCode" ? s = { from: l, to: d, innerFrom: l, innerTo: d } : a.name === "CodeMark" && (l === s.from ? (s.innerFrom = d, t.add(l, d, en)) : d === s.to && (s.innerTo = l, t.add(s.innerFrom, s.innerTo, Gt), t.add(l, d, tn)));
        },
        from: i.from,
        to: i.to
      }), r = i.to + 1;
    }
  return t.finish();
}, rn = () => [
  nn
], an = () => [
  Y.editorAttributes.of({
    class: "ink-mde-container"
  }),
  Y.contentAttributes.of({
    class: "ink-mde-editor-content"
  })
  // Todo: Maybe open a PR to add scrollerAttributes?
], sn = () => [
  ...an()
], ln = () => Y.lineWrapping, cn = () => [
  Ye(
    Ze.define([
      // ordered by lowest to highest precedence
      {
        tag: u.atom,
        color: "var(--ink-internal-syntax-atom-color)"
      },
      {
        tag: u.meta,
        color: "var(--ink-internal-syntax-meta-color)"
      },
      // emphasis types
      {
        tag: u.emphasis,
        color: "var(--ink-internal-syntax-emphasis-color)",
        fontStyle: "var(--ink-internal-syntax-emphasis-font-style)"
      },
      {
        tag: u.strong,
        color: "var(--ink-internal-syntax-strong-color)",
        fontWeight: "var(--ink-internal-syntax-strong-font-weight)"
      },
      {
        tag: u.strikethrough,
        color: "var(--ink-internal-syntax-strikethrough-color)",
        textDecoration: "var(--ink-internal-syntax-strikethrough-text-decoration)"
      },
      // comment group
      {
        tag: u.comment,
        color: "var(--ink-internal-syntax-comment-color)",
        fontStyle: "var(--ink-internal-syntax-comment-font-style)"
      },
      // monospace
      {
        tag: u.monospace,
        color: "var(--ink-internal-syntax-code-color)",
        fontFamily: "var(--ink-internal-syntax-code-font-family)"
      },
      // name group
      {
        tag: u.name,
        color: "var(--ink-internal-syntax-name-color)"
      },
      {
        tag: u.labelName,
        color: "var(--ink-internal-syntax-name-label-color)"
      },
      {
        tag: u.propertyName,
        color: "var(--ink-internal-syntax-name-property-color)"
      },
      {
        tag: u.definition(u.propertyName),
        color: "var(--ink-internal-syntax-name-property-definition-color)"
      },
      {
        tag: u.variableName,
        color: "var(--ink-internal-syntax-name-variable-color)"
      },
      {
        tag: u.definition(u.variableName),
        color: "var(--ink-internal-syntax-name-variable-definition-color)"
      },
      {
        tag: u.local(u.variableName),
        color: "var(--ink-internal-syntax-name-variable-local-color)"
      },
      {
        tag: u.special(u.variableName),
        color: "var(--ink-internal-syntax-name-variable-special-color)"
      },
      // headings
      {
        tag: u.heading,
        color: "var(--ink-internal-syntax-heading-color)",
        fontWeight: "var(--ink-internal-syntax-heading-font-weight)"
      },
      {
        tag: u.heading1,
        color: "var(--ink-internal-syntax-heading1-color)",
        fontSize: "var(--ink-internal-syntax-heading1-font-size)",
        fontWeight: "var(--ink-internal-syntax-heading1-font-weight)"
      },
      {
        tag: u.heading2,
        color: "var(--ink-internal-syntax-heading2-color)",
        fontSize: "var(--ink-internal-syntax-heading2-font-size)",
        fontWeight: "var(--ink-internal-syntax-heading2-font-weight)"
      },
      {
        tag: u.heading3,
        color: "var(--ink-internal-syntax-heading3-color)",
        fontSize: "var(--ink-internal-syntax-heading3-font-size)",
        fontWeight: "var(--ink-internal-syntax-heading3-font-weight)"
      },
      {
        tag: u.heading4,
        color: "var(--ink-internal-syntax-heading4-color)",
        fontSize: "var(--ink-internal-syntax-heading4-font-size)",
        fontWeight: "var(--ink-internal-syntax-heading4-font-weight)"
      },
      {
        tag: u.heading5,
        color: "var(--ink-internal-syntax-heading5-color)",
        fontSize: "var(--ink-internal-syntax-heading5-font-size)",
        fontWeight: "var(--ink-internal-syntax-heading5-font-weight)"
      },
      {
        tag: u.heading6,
        color: "var(--ink-internal-syntax-heading6-color)",
        fontSize: "var(--ink-internal-syntax-heading6-font-size)",
        fontWeight: "var(--ink-internal-syntax-heading6-font-weight)"
      },
      // contextual tag types
      {
        tag: u.keyword,
        color: "var(--ink-internal-syntax-keyword-color)"
      },
      {
        tag: u.number,
        color: "var(--ink-internal-syntax-number-color)"
      },
      {
        tag: u.operator,
        color: "var(--ink-internal-syntax-operator-color)"
      },
      {
        tag: u.punctuation,
        color: "var(--ink-internal-syntax-punctuation-color)"
      },
      {
        tag: u.link,
        color: "var(--ink-internal-syntax-link-color)",
        wordBreak: "break-all"
      },
      {
        tag: u.url,
        color: "var(--ink-internal-syntax-url-color)",
        wordBreak: "break-all"
      },
      // string group
      {
        tag: u.string,
        color: "var(--ink-internal-syntax-string-color)"
      },
      {
        tag: u.special(u.string),
        color: "var(--ink-internal-syntax-string-special-color)"
      },
      // processing instructions
      {
        tag: u.processingInstruction,
        color: "var(--ink-internal-syntax-processing-instruction-color)"
      }
    ])
  )
], dn = (e) => {
  if (e.length > 0)
    return je(e);
}, qe = ([e, t]) => {
  const { selections: n } = e().options;
  return et.create({
    doc: e().options.doc,
    selection: dn(n),
    extensions: [
      rt.of([
        ...tt,
        ...nt
      ]),
      Xt(),
      rn(),
      ot(),
      sn(),
      ln(),
      cn(),
      ...Pt([e, t])
    ]
  });
}, un = ([e, t], n) => {
  const o = n?.getRootNode(), r = o?.nodeType === 11 ? o : void 0, i = new Y({
    dispatch: (s) => {
      const { options: a } = e(), l = s.newDoc.toString();
      a.hooks.beforeUpdate(l), i.update([s]), s.docChanged && (t({ ...e(), doc: l }), a.hooks.afterUpdate(l));
    },
    root: r,
    state: qe([e, t])
  });
  return i;
}, V = {
  array: "[object Array]",
  object: "[object Object]",
  string: "[object String]",
  undefined: "[object Undefined]",
  window: "[object Window]"
}, fn = (e) => {
  if (Object.prototype.toString.call(e) === V.object)
    return `[object ${e.constructor.name}]`;
}, I = (e, t) => fn(e) === t, mn = (e, t) => {
  const n = /* @__PURE__ */ new WeakMap(), o = (r, i) => n.get(r) || (I(r, V.object) && n.set(r, !0), I(i, V.undefined)) ? r : I(r, V.array) && I(i, V.array) ? [...i] : I(r, V.object) && I(i, V.object) ? Object.keys(r).reduce((s, a) => (Object.hasOwnProperty.call(i, a) ? s[a] = o(r[a], i[a]) : s[a] = r[a], s), {}) : i;
  return o(e, t);
}, Z = (e, t) => mn(e, t), pn = ([e, t], n) => {
  t(Z(e(), { options: { doc: n } })), e().editor.setState(qe([e, t]));
}, gn = ([e]) => e().options, kn = async ([e, t], n) => {
  const { workQueue: o } = e();
  return o.enqueue(async () => {
    t(Z(e(), { options: n }));
    const r = await oe([e, t]);
    e().editor.dispatch({ effects: r });
  });
}, De = (e, t = {}) => {
  if (t.selections)
    return Ve(e, t.selections);
  if (t.selection)
    return le(e, t.selection);
  if (t.at)
    return hn(e, t.at);
}, hn = (e, t) => {
  const [n] = e;
  if (t === se.Start)
    return le(e, { start: 0, end: 0 });
  if (t === se.End) {
    const o = n().editor.state.doc.length;
    return le(e, { start: o, end: o });
  }
}, Ve = ([e], t) => {
  const { editor: n } = e();
  n.dispatch(
    n.state.update({
      selection: je(t)
    })
  );
}, le = (e, t) => Ve(e, [t]), bn = ([e], t) => {
  const { editor: n } = e();
  n.dispatch(
    n.state.update({
      changes: {
        from: 0,
        to: n.state.doc.length,
        insert: t
      }
    })
  );
}, xn = ([e, t], { after: n, before: o, selection: r }) => {
  const { editor: i } = e(), s = r || ge([e, t]).pop() || { start: 0, end: 0 }, a = i.state.sliceDoc(s.start, s.end);
  te([e, t], `${o}${a}${n}`, s), De([e, t], { selections: [{ start: s.start + o.length, end: s.end + o.length }] });
}, vn = (e, t) => {
  const n = {
    callbacks: {
      fulfilled: [],
      rejected: [],
      settled: []
    },
    status: "pending"
  }, o = (a, { resolve: l, reject: d }) => () => {
    try {
      const m = a(n.value);
      Promise.resolve(m).then(l, d);
    } catch (m) {
      d(m);
    }
  }, r = (a) => {
    n.status === "pending" && (n.status = "rejected", n.value = a, n.callbacks.rejected.forEach((l) => l()), n.callbacks.settled.forEach((l) => l()));
  }, i = (a) => {
    n.status === "pending" && (n.status = "fulfilled", n.value = a, n.callbacks.fulfilled.forEach((l) => l()), n.callbacks.settled.forEach((l) => l()));
  }, s = (a, l) => new Promise((d, m) => {
    n.status === "pending" && (a && n.callbacks.fulfilled.push(o(a, { resolve: d, reject: m })), l && n.callbacks.rejected.push(o(l, { resolve: void 0, reject: m }))), n.status === "fulfilled" && a && o(a, { resolve: d, reject: m })(), n.status === "rejected" && l && o(l, { resolve: void 0, reject: m })();
  });
  return queueMicrotask(() => {
    try {
      t(i, r);
    } catch (a) {
      r(a);
    }
  }), {
    ...e,
    [Symbol.toStringTag]: "awaitable",
    catch: s.bind(void 0, void 0),
    finally: (a) => new Promise((l, d) => {
      n.status === "pending" && n.callbacks.settled.push(o(a, { resolve: l, reject: d })), n.status === "fulfilled" && (a(), l(n.value)), n.status === "rejected" && (a(), d(n.value));
    }),
    then: s
  };
}, Oe = (e) => {
  const t = {
    destroy: mt.bind(void 0, e),
    focus: ae.bind(void 0, e),
    format: Ae.bind(void 0, e),
    getDoc: wt.bind(void 0, e),
    insert: te.bind(void 0, e),
    load: pn.bind(void 0, e),
    options: gn.bind(void 0, e),
    reconfigure: kn.bind(void 0, e),
    select: De.bind(void 0, e),
    selections: ge.bind(void 0, e),
    update: bn.bind(void 0, e),
    wrap: xn.bind(void 0, e)
  };
  return vn(t, (n, o) => {
    try {
      const [r] = e;
      r().workQueue.enqueue(() => n(t));
    } catch (r) {
      o(r);
    }
  });
}, yn = () => {
  const e = {
    queue: [],
    workload: 0
  }, t = async () => {
    const n = e.queue.pop();
    n && (await n(), e.workload--, await t());
  };
  return {
    enqueue: (n) => new Promise((o, r) => {
      const i = async () => {
        try {
          await n(), o();
        } catch (s) {
          r(s);
        }
      };
      e.queue.push(i), e.workload++, !(e.workload > 1) && t();
    })
  };
}, ce = () => {
  const e = {
    doc: "",
    files: {
      clipboard: !1,
      dragAndDrop: !1,
      handler: () => {
      },
      injectMarkup: !0,
      types: ["image/*"]
    },
    hooks: {
      afterUpdate: () => {
      },
      beforeUpdate: () => {
      }
    },
    interface: {
      appearance: ee.Auto,
      attribution: !0,
      autocomplete: !1,
      images: !1,
      lists: !1,
      readonly: !1,
      spellcheck: !0,
      toolbar: !1
    },
    keybindings: {
      // Todo: Set these to false by default. https://codemirror.net/examples/tab
      tab: !0,
      shiftTab: !0
    },
    lists: !1,
    placeholder: "",
    plugins: [],
    readability: !1,
    search: !0,
    selections: [],
    toolbar: {
      bold: !0,
      code: !0,
      codeBlock: !0,
      heading: !0,
      image: !0,
      italic: !0,
      link: !0,
      list: !0,
      orderedList: !0,
      quote: !0,
      taskList: !0,
      upload: !1
    },
    // This value overrides both `tab` and `shiftTab` keybindings.
    trapTab: void 0,
    vim: !1
  };
  return {
    doc: "",
    editor: {},
    extensions: Vt(),
    options: e,
    root: ve(),
    target: ve(),
    workQueue: yn()
  };
}, $n = (e) => Z(ce(), e), ke = (e, t = {}) => {
  const [n, o] = O($n({ ...t, doc: e.doc || "", options: e }));
  return [n, o];
}, he = 225, wn = (e, t = he) => {
  const n = Sn(e, t), o = Ln(e), r = Cn(e), i = _n(e);
  return [n, o, r, i].join(" | ");
}, _n = (e) => `${Mn(e)} chars`, Cn = (e) => `${jn(e)} lines`, Sn = (e, t = he) => {
  const n = En(e, t), o = Math.floor(n), r = Math.floor(n % 1 * 60);
  return o === 0 ? `${r}s read` : `${o}m ${r}s to read`;
}, Ln = (e) => `${Ne(e)} words`, Mn = (e) => e.length, jn = (e) => e.split(/\n/).length, En = (e, t = he) => Ne(e) / t, Ne = (e) => {
  const t = e.replace(/[']/g, "").replace(/[^\w\d]+/g, " ").trim();
  return t ? t.split(/\s+/).length : 0;
};
var Hn = /* @__PURE__ */ g("<div class=ink-mde-readability><span>"), zn = /* @__PURE__ */ g("<span>&nbsp;|"), An = /* @__PURE__ */ g('<div class=ink-mde-attribution><span>&nbsp;powered by <a class=ink-mde-attribution-link href=https://github.com/davidmyersdev/ink-mde rel="noopener noreferrer"target=_blank>ink-mde'), Bn = /* @__PURE__ */ g("<div class=ink-mde-details><div class=ink-mde-container><div class=ink-mde-details-content><!$><!/><!$><!/><!$><!/>");
const Tn = () => {
  const [e] = X();
  return (() => {
    var t = f(Bn), n = t.firstChild, o = n.firstChild, r = o.firstChild, [i, s] = h(r.nextSibling), a = i.nextSibling, [l, d] = h(a.nextSibling), m = l.nextSibling, [S, $] = h(m.nextSibling);
    return p(o, c(x, {
      get when() {
        return e().options.readability;
      },
      get children() {
        var M = f(Hn), H = M.firstChild;
        return p(H, () => wn(e().doc)), M;
      }
    }), i, s), p(o, c(x, {
      get when() {
        return Fe(() => !!e().options.readability)() && e().options.interface.attribution;
      },
      get children() {
        return f(zn);
      }
    }), l, d), p(o, c(x, {
      get when() {
        return e().options.interface.attribution;
      },
      get children() {
        return f(An);
      }
    }), S, $), t;
  })();
}, Pn = ".ink-drop-zone{align-items:center;background-color:#00000080;color:var(--ink-internal-color);display:flex;inset:0;justify-content:center;position:var(--ink-internal-modal-position);z-index:100}.ink-drop-zone:not(.visible){display:none}.ink-drop-zone-modal{background-color:var(--ink-internal-block-background-color);border-radius:var(--ink-internal-border-radius);box-sizing:border-box;height:100%;max-height:20rem;max-width:40rem;padding:1rem;position:relative;width:100%}.ink-drop-zone-hide{cursor:pointer;height:1.75rem;position:absolute;right:.25rem;top:.25rem;width:1.75rem}.ink-drop-zone-hide svg{background-color:var(--ink-internal-block-background-color)}.ink-drop-zone-droppable-area{align-items:center;border:.2rem dashed var(--ink-internal-color);border-radius:.125rem;box-sizing:border-box;display:flex;flex-direction:column;font-size:1.25em;gap:1rem;height:100%;justify-content:center;padding:1rem;text-align:center}.ink-drop-zone-file-preview{align-items:center;display:flex;flex-wrap:wrap;gap:.5rem;max-width:25.5rem}.ink-drop-zone-file-preview-image{border:.125rem solid #222;border-radius:.125rem;box-sizing:border-box;height:6rem;object-fit:cover;padding:.5rem;width:6rem}";
var qn = /* @__PURE__ */ g("<span>uploading files..."), Dn = /* @__PURE__ */ g('<div class=ink-drop-zone><style></style><div class=ink-drop-zone-modal><div class=ink-drop-zone-droppable-area><div class=ink-drop-zone-file-preview></div><!$><!/></div><div class=ink-drop-zone-hide><svg xmlns=http://www.w3.org/2000/svg fill=none viewBox="0 0 24 24"stroke=currentColor><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z">'), Vn = /* @__PURE__ */ g("<img class=ink-drop-zone-file-preview-image>"), On = /* @__PURE__ */ g("<span>drop files here");
const Nn = () => {
  const [e, t] = O(0), [n, o] = O([]), [r, i] = O(!1), [s, a] = O(!1), [l, d] = X(), m = () => {
    a(!1);
  }, S = (b) => {
    if (l().options.files.dragAndDrop) {
      b.preventDefault(), b.stopPropagation();
      const y = b.dataTransfer;
      y?.files ? D(y.files) : (t(0), a(!1), o([]));
    }
  }, $ = (b) => {
    l().options.files.dragAndDrop && (b.preventDefault(), t(e() + 1), a(!0));
  }, M = (b) => {
    l().options.files.dragAndDrop && (b.preventDefault(), t(e() - 1), e() === 0 && a(!1));
  }, H = (b) => {
    l().options.files.dragAndDrop && (b.preventDefault(), a(!0));
  }, N = (b) => {
    l().options.files.dragAndDrop && (b.preventDefault(), t(0), a(!1));
  }, R = (b) => {
    if (l().options.files.clipboard) {
      b.preventDefault();
      const y = b.clipboardData;
      y?.files && y.files.length > 0 && D(y.files);
    }
  }, D = (b) => {
    Array.from(b).forEach((y) => {
      o([...n(), y]);
    }), i(!0), a(!0), Promise.resolve(l().options.files.handler(b)).then((y) => {
      if (l().options.files.injectMarkup && y) {
        const K = `![](${y})`;
        te([l, d], K);
      }
    }).finally(() => {
      t(0), i(!1), a(!1), o([]);
    });
  };
  return Me(() => {
    document.addEventListener("dragenter", $), document.addEventListener("dragleave", M), document.addEventListener("dragover", H), document.addEventListener("drop", N), l().root.addEventListener("paste", R);
  }), it(() => {
    document.removeEventListener("dragenter", $), document.removeEventListener("dragleave", M), document.removeEventListener("dragover", H), document.removeEventListener("drop", N), l().root.removeEventListener("paste", R);
  }), (() => {
    var b = f(Dn), y = b.firstChild, K = y.nextSibling, W = K.firstChild, k = W.firstChild, B = k.nextSibling, [_, T] = h(B.nextSibling), P = W.nextSibling;
    return de(y, "textContent", Pn), W.addEventListener("drop", S), p(k, c(at, {
      get each() {
        return n().slice(0, 8);
      },
      children: (w) => (() => {
        var j = f(Vn);
        return ie((C) => {
          var z = w.name, A = URL.createObjectURL(w);
          return z !== C.e && be(j, "alt", C.e = z), A !== C.t && be(j, "src", C.t = A), C;
        }, {
          e: void 0,
          t: void 0
        }), j;
      })()
    })), p(W, c(x, {
      get when() {
        return r();
      },
      get fallback() {
        return f(On);
      },
      get children() {
        return f(qn);
      }
    }), _, T), P.$$click = m, ie(() => b.classList.toggle("visible", !!s())), ue(), b;
  })();
};
ye(["click"]);
const Rn = (e) => {
  const [t, n] = X(), o = un([t, n], e.target), {
    workQueue: r
  } = t();
  return n(Z(t(), {
    editor: o
  })), r.enqueue(async () => {
    const i = await oe([t, n]);
    o.dispatch({
      effects: i
    });
  }), o.dom;
};
var Wn = /* @__PURE__ */ g("<button class=ink-button type=button>");
const L = (e) => (() => {
  var t = f(Wn);
  return t.$$click = (n) => e.onclick(n), p(t, () => e.children), ue(), t;
})();
ye(["click"]);
const In = ".ink-mde .ink-mde-toolbar{background-color:var(--ink-internal-block-background-color);color:inherit;display:flex;flex-shrink:0;overflow-x:auto;padding:.25rem}.ink-mde .ink-mde-toolbar .ink-mde-container{display:flex;gap:var(--ink-internal-toolbar-group-spacing)}.ink-mde .ink-mde-toolbar-group{display:flex;gap:var(--ink-internal-toolbar-item-spacing)}.ink-mde .ink-mde-toolbar .ink-button{align-items:center;background:none;border:none;border-radius:var(--ink-internal-border-radius);color:inherit;cursor:pointer;display:flex;height:2.25rem;justify-content:center;padding:.4rem;width:2.25rem}.ink-mde .ink-mde-toolbar .ink-button:hover{background-color:var(--ink-internal-block-background-color-on-hover)}.ink-mde .ink-mde-toolbar .ink-button>*{align-items:center;display:flex;height:100%}";
var Fn = /* @__PURE__ */ g('<svg viewBox="0 0 20 20"fill=none stroke=currentColor stroke-miterlimit=5 stroke-linecap=round stroke-linejoin=round><path d="M6 4V10M6 16V10M6 10H14M14 10V4M14 10V16">'), Un = /* @__PURE__ */ g('<svg viewBox="0 0 20 20"fill=none stroke=currentColor stroke-width=1.5 stroke-miterlimit=5 stroke-linecap=round stroke-linejoin=round><path d="M6.5 10H10.5C12.1569 10 13.5 11.3431 13.5 13C13.5 14.6569 12.1569 16 10.5 16H6.5V4H9.5C11.1569 4 12.5 5.34315 12.5 7C12.5 8.65686 11.1569 10 9.5 10">'), Qn = /* @__PURE__ */ g('<svg viewBox="0 0 20 20"fill=none stroke=currentColor stroke-miterlimit=5 stroke-linecap=round stroke-linejoin=round><path d="M11 4L9 16M13 4H9M7 16H11">'), G = /* @__PURE__ */ g("<div class=ink-mde-toolbar-group><!$><!/><!$><!/><!$><!/>"), Xn = /* @__PURE__ */ g('<svg viewBox="0 0 20 20"fill=none stroke=currentColor stroke-miterlimit=5 stroke-linecap=round stroke-linejoin=round><path d="M2.00257 16H17.9955M2.00055 4H18M7 10H18.0659M2 8.5V11.4999C2.4 11.5 2.5 11.5 2.5 11.5V11V10.5M4 8.5V11.4999H4.5V11V10.5">'), Kn = /* @__PURE__ */ g('<svg viewBox="0 0 20 20"fill=none stroke=currentColor stroke-miterlimit=5 stroke-linecap=round stroke-linejoin=round><path d="M13 4L7 16"></path><path d="M5 7L2 10L5 13"></path><path d="M15 7L18 10L15 13">'), Yn = /* @__PURE__ */ g('<svg viewBox="0 0 20 20"fill=none stroke=currentColor stroke-miterlimit=5 stroke-linecap=round stroke-linejoin=round><path d="M7 4L8 6">'), Zn = /* @__PURE__ */ g('<svg viewBox="0 0 20 20"fill=none stroke=currentColor stroke-miterlimit=5 stroke-linecap=round stroke-linejoin=round><path d="M7 16H17.8294"></path><path d="M2 16H4"></path><path d="M7 10H17.8294"></path><path d="M2 10H4"></path><path d="M7 4H17.8294"></path><path d="M2 4H4">'), Jn = /* @__PURE__ */ g('<svg viewBox="0 0 20 20"fill=none stroke=currentColor stroke-miterlimit=5 stroke-linecap=round stroke-linejoin=round><path d="M7 16H18"></path><path d="M2 17.0242C2.48314 17.7569 3.94052 17.6154 3.99486 16.7919C4.05315 15.9169 3.1975 16.0044 2.99496 16.0044M2.0023 14.9758C2.48544 14.2431 3.94282 14.3846 3.99716 15.2081C4.05545 16.0831 3.1998 16.0002 2.99726 16.0002"></path><path d="M7 10H18"></path><path d="M2.00501 11.5H4M2.00193 8.97562C2.48449 8.24319 3.9401 8.38467 3.99437 9.20777C4.05259 10.0825 2.04342 10.5788 2 11.4996"></path><path d="M7 4H18"></path><path d="M2 5.5H4M2.99713 5.49952V2.5L2.215 2.93501">'), Gn = /* @__PURE__ */ g('<svg viewBox="0 0 20 20"fill=none stroke=currentColor stroke-miterlimit=5 stroke-linecap=round stroke-linejoin=round><path d="M7 16H17.8294"></path><path d="M5 15L3 17L2 16"></path><path d="M7 10H17.8294"></path><path d="M5 9L3 11L2 10"></path><path d="M7 4H17.8294"></path><path d="M5 3L3 5L2 4">'), eo = /* @__PURE__ */ g('<svg viewBox="0 0 20 20"fill=none stroke=currentColor stroke-miterlimit=5 stroke-linecap=round stroke-linejoin=round><path d="M9.12127 10.881C10.02 11.78 11.5237 11.7349 12.4771 10.7813L15.2546 8.00302C16.2079 7.04937 16.253 5.54521 15.3542 4.6462C14.4555 3.74719 12.9512 3.79174 11.9979 4.74539L10.3437 6.40007M10.8787 9.11903C9.97997 8.22002 8.47626 8.26509 7.52288 9.21874L4.74545 11.997C3.79208 12.9506 3.74701 14.4548 4.64577 15.3538C5.54452 16.2528 7.04876 16.2083 8.00213 15.2546L9.65633 13.5999">'), to = /* @__PURE__ */ g('<svg viewBox="0 0 20 20"fill=none stroke=currentColor stroke-miterlimit=5 stroke-linecap=round stroke-linejoin=round><rect x=2 y=4 width=16 height=12 rx=1></rect><path d="M7.42659 7.67597L13.7751 13.8831M2.00208 12.9778L7.42844 7.67175"></path><path d="M11.9119 12.0599L14.484 9.54443L17.9973 12.9785"></path><path d="M10.9989 7.95832C11.551 7.95832 11.9986 7.52072 11.9986 6.98092C11.9986 6.44113 11.551 6.00354 10.9989 6.00354C10.4468 6.00354 9.99921 6.44113 9.99921 6.98092C9.99921 7.52072 10.4468 7.95832 10.9989 7.95832Z">'), no = /* @__PURE__ */ g('<svg viewBox="0 0 20 20"fill=none stroke=currentColor stroke-miterlimit=5 stroke-linecap=round stroke-linejoin=round><path d="M10 13V4M10 4L13 7M10 4L7 7"></path><path d="M2 13V15C2 15.5523 2.44772 16 3 16H17C17.5523 16 18 15.5523 18 15V13">'), oo = /* @__PURE__ */ g("<input type=file>"), ro = /* @__PURE__ */ g("<div class=ink-mde-toolbar><style></style><div class=ink-mde-container><!$><!/><!$><!/><!$><!/><!$><!/>");
const io = () => {
  const [e, t] = X(), [n, o] = O(), r = (a) => {
    Ae([e, t], a), ae([e, t]);
  }, i = (a) => {
    const l = a.target;
    l?.files && Promise.resolve(e().options.files.handler(l.files)).then((d) => {
      if (d) {
        const m = `![](${d})`;
        te([e, t], m), ae([e, t]);
      }
    });
  }, s = () => {
    n()?.click();
  };
  return (() => {
    var a = f(ro), l = a.firstChild, d = l.nextSibling, m = d.firstChild, [S, $] = h(m.nextSibling), M = S.nextSibling, [H, N] = h(M.nextSibling), R = H.nextSibling, [D, b] = h(R.nextSibling), y = D.nextSibling, [K, W] = h(y.nextSibling);
    return de(l, "textContent", In), p(d, c(x, {
      get when() {
        return e().options.toolbar.heading || e().options.toolbar.bold || e().options.toolbar.italic;
      },
      get children() {
        var k = f(G), B = k.firstChild, [_, T] = h(B.nextSibling), P = _.nextSibling, [w, j] = h(P.nextSibling), C = w.nextSibling, [z, A] = h(C.nextSibling);
        return p(k, c(x, {
          get when() {
            return e().options.toolbar.heading;
          },
          get children() {
            return c(L, {
              onclick: () => r(v.Heading),
              get children() {
                return f(Fn);
              }
            });
          }
        }), _, T), p(k, c(x, {
          get when() {
            return e().options.toolbar.bold;
          },
          get children() {
            return c(L, {
              onclick: () => r(v.Bold),
              get children() {
                return f(Un);
              }
            });
          }
        }), w, j), p(k, c(x, {
          get when() {
            return e().options.toolbar.italic;
          },
          get children() {
            return c(L, {
              onclick: () => r(v.Italic),
              get children() {
                return f(Qn);
              }
            });
          }
        }), z, A), k;
      }
    }), S, $), p(d, c(x, {
      get when() {
        return e().options.toolbar.quote || e().options.toolbar.codeBlock || e().options.toolbar.code;
      },
      get children() {
        var k = f(G), B = k.firstChild, [_, T] = h(B.nextSibling), P = _.nextSibling, [w, j] = h(P.nextSibling), C = w.nextSibling, [z, A] = h(C.nextSibling);
        return p(k, c(x, {
          get when() {
            return e().options.toolbar.quote;
          },
          get children() {
            return c(L, {
              onclick: () => r(v.Quote),
              get children() {
                return f(Xn);
              }
            });
          }
        }), _, T), p(k, c(x, {
          get when() {
            return e().options.toolbar.codeBlock;
          },
          get children() {
            return c(L, {
              onclick: () => r(v.CodeBlock),
              get children() {
                return f(Kn);
              }
            });
          }
        }), w, j), p(k, c(x, {
          get when() {
            return e().options.toolbar.code;
          },
          get children() {
            return c(L, {
              onclick: () => r(v.Code),
              get children() {
                return f(Yn);
              }
            });
          }
        }), z, A), k;
      }
    }), H, N), p(d, c(x, {
      get when() {
        return e().options.toolbar.list || e().options.toolbar.orderedList || e().options.toolbar.taskList;
      },
      get children() {
        var k = f(G), B = k.firstChild, [_, T] = h(B.nextSibling), P = _.nextSibling, [w, j] = h(P.nextSibling), C = w.nextSibling, [z, A] = h(C.nextSibling);
        return p(k, c(x, {
          get when() {
            return e().options.toolbar.list;
          },
          get children() {
            return c(L, {
              onclick: () => r(v.List),
              get children() {
                return f(Zn);
              }
            });
          }
        }), _, T), p(k, c(x, {
          get when() {
            return e().options.toolbar.orderedList;
          },
          get children() {
            return c(L, {
              onclick: () => r(v.OrderedList),
              get children() {
                return f(Jn);
              }
            });
          }
        }), w, j), p(k, c(x, {
          get when() {
            return e().options.toolbar.taskList;
          },
          get children() {
            return c(L, {
              onclick: () => r(v.TaskList),
              get children() {
                return f(Gn);
              }
            });
          }
        }), z, A), k;
      }
    }), D, b), p(d, c(x, {
      get when() {
        return e().options.toolbar.link || e().options.toolbar.image || e().options.toolbar.upload;
      },
      get children() {
        var k = f(G), B = k.firstChild, [_, T] = h(B.nextSibling), P = _.nextSibling, [w, j] = h(P.nextSibling), C = w.nextSibling, [z, A] = h(C.nextSibling);
        return p(k, c(x, {
          get when() {
            return e().options.toolbar.link;
          },
          get children() {
            return c(L, {
              onclick: () => r(v.Link),
              get children() {
                return f(eo);
              }
            });
          }
        }), _, T), p(k, c(x, {
          get when() {
            return e().options.toolbar.image;
          },
          get children() {
            return c(L, {
              onclick: () => r(v.Image),
              get children() {
                return f(to);
              }
            });
          }
        }), w, j), p(k, c(x, {
          get when() {
            return e().options.toolbar.upload;
          },
          get children() {
            return c(L, {
              onclick: s,
              get children() {
                return [f(no), (() => {
                  var J = f(oo);
                  return $e(o, J), J.addEventListener("change", i), J.style.setProperty("display", "none"), J;
                })()];
              }
            });
          }
        }), z, A), k;
      }
    }), K, W), a;
  })();
}, ao = ".ink-mde{border:2px solid var(--ink-internal-block-background-color);border-radius:var(--ink-internal-border-radius);color:var(--ink-internal-color, inherit);display:flex;flex-direction:var(--ink-internal-flex-direction, column);font-family:var(--ink-internal-font-family)}.ink-mde .cm-cursor{border-left-color:var(--ink-internal-color, inherit);margin-left:0}.ink-mde .cm-tooltip{background-color:var(--ink-internal-block-background-color);border-radius:var(--ink-internal-border-radius);font-family:inherit;padding:.25rem}.ink-mde .cm-tooltip.cm-tooltip-autocomplete ul{font-family:inherit}.ink-mde .cm-tooltip.cm-tooltip-autocomplete ul li.ink-tooltip-option{border-radius:var(--ink-internal-border-radius);padding:.25rem}.ink-mde .cm-tooltip.cm-tooltip-autocomplete ul li.ink-tooltip-option[aria-selected]{background-color:#96969640}.ink-mde .cm-completionLabel{font-family:inherit}.ink-mde,.ink-mde *{box-sizing:border-box}.ink-mde,.ink-mde .ink-mde-editor{display:flex;flex-direction:column;flex-grow:1;flex-shrink:1;min-height:0}.ink-mde .ink-mde-editor{overflow:auto;padding:.5rem}.ink-mde .ink-mde-toolbar,.ink-mde .ink-mde-details{display:flex;flex-grow:0;flex-shrink:0}.ink-mde .ink-mde-details{background-color:var(--ink-internal-block-background-color);display:flex;padding:.5rem}.ink-mde .ink-mde-details-content{color:inherit;display:flex;filter:brightness(.75);flex-wrap:wrap;font-size:.75em;justify-content:flex-end}.ink-mde .ink-mde-attribution{display:flex;justify-content:flex-end}.ink-mde .ink-mde-attribution-link{color:currentColor;font-weight:600;text-decoration:none}.ink-mde .ink-mde-container{margin-left:auto;margin-right:auto;width:100%}.ink-mde .ink-mde-search-panel{background-color:var(--ink-internal-block-background-color);border-radius:.25rem;padding:.25rem;position:absolute;right:.25rem;top:.25rem;width:clamp(10rem,30%,100%)}.ink-mde .ink-mde-search-panel:focus-within{outline-color:#6495ed;outline-style:solid}.ink-mde .ink-mde-search-input{background-color:transparent;border:none;border-radius:.25rem;color:inherit;font-size:inherit;outline:none;width:100%}.ink-mde .cm-editor{display:flex;flex-direction:column;position:relative}.ink-mde .cm-panels{background-color:unset;border:unset;z-index:10}.ink-mde .cm-searchMatch{background-color:#6495ed50}.ink-mde .cm-searchMatch-selected{background-color:#6495edcc}.ink-mde .cm-scroller{align-items:flex-start;display:flex;font-family:var(--ink-internal-font-family);font-size:var(--ink-internal-editor-font-size);line-height:var(--ink-internal-editor-line-height);overflow-x:auto;position:relative}.ink-mde .cm-content{display:block;flex-grow:2;flex-shrink:0;margin:0;outline:none;padding:0;white-space:nowrap}.ink-mde .cm-lineWrapping{display:flex;flex-direction:column;flex-shrink:1;overflow-wrap:unset;word-break:break-word;white-space:pre-wrap;width:100%;overflow-x:hidden}.ink-mde .cm-line .cm-code,.ink-mde .cm-line .cm-blockquote{word-break:break-all}.ink-mde .cm-line{font-family:var(--ink-internal-font-family);padding:0}.ink-mde .cm-line span{display:inline}.ink-mde .cm-line.cm-blockquote{background-color:var(--ink-internal-block-background-color);border-left:.25rem solid currentColor;padding:0 var(--ink-internal-block-padding)}.ink-mde .cm-line.cm-blockquote.cm-blockquote-open{border-top-left-radius:var(--ink-internal-border-radius);border-top-right-radius:var(--ink-internal-border-radius);padding-top:var(--ink-internal-block-padding)}.ink-mde .cm-line.cm-blockquote.cm-blockquote-close{border-bottom-left-radius:var(--ink-internal-border-radius);border-bottom-right-radius:var(--ink-internal-border-radius);padding-bottom:var(--ink-internal-block-padding)}.ink-mde .cm-line.cm-codeblock{background-color:var(--ink-internal-block-background-color);font-family:var(--ink-internal-code-font-family);padding:0 var(--ink-internal-block-padding)}.ink-mde .cm-line.cm-codeblock.cm-codeblock-open{border-radius:var(--ink-internal-border-radius) var(--ink-internal-border-radius) 0 0;padding-top:var(--ink-internal-block-padding)}.ink-mde .cm-line.cm-codeblock.cm-codeblock-close{border-radius:0 0 var(--ink-internal-border-radius) var(--ink-internal-border-radius);padding-bottom:var(--ink-internal-block-padding)}.ink-mde .cm-line .cm-code{background-color:var(--ink-internal-block-background-color);font-family:var(--ink-internal-code-font-family);padding:var(--ink-internal-inline-padding) 0}.ink-mde .cm-line .cm-code.cm-code-open{border-radius:var(--ink-internal-border-radius) 0 0 var(--ink-internal-border-radius);padding-left:var(--ink-internal-inline-padding)}.ink-mde .cm-line .cm-code.cm-code-close{border-radius:0 var(--ink-internal-border-radius) var(--ink-internal-border-radius) 0;padding-right:var(--ink-internal-inline-padding)}.ink-mde .cm-image-backdrop{background-color:var(--ink-internal-block-background-color)}.ink-mde .ink-mde-block-widget-container{padding:.5rem 0}.ink-mde .ink-mde-block-widget{background-color:var(--ink-internal-block-background-color);border-radius:var(--ink-internal-border-radius);padding:var(--ink-internal-block-padding)}";
var so = /* @__PURE__ */ g("<style> ");
const lo = () => {
  const [e, t] = X(), [n, o] = O(re(e()));
  return st(() => {
    o(re(e()));
  }), Me(() => {
    const r = window.matchMedia("(prefers-color-scheme: dark)"), i = (s) => {
      const {
        editor: a,
        root: l,
        workQueue: d
      } = e();
      l.isConnected ? d.enqueue(async () => {
        const m = await oe([e, t]);
        a.dispatch({
          effects: m
        }), o(re(e()));
      }) : r.removeEventListener("change", i);
    };
    r.addEventListener("change", i);
  }), (() => {
    var r = f(so), i = r.firstChild;
    return ie(() => de(i, "data", `.ink {
  ${n().join(`
  `)}
}
${ao}`)), r;
  })();
};
var co = /* @__PURE__ */ g('<div class="ink ink-mde"><!$><!/><!$><!/><!$><!/><div class=ink-mde-editor></div><!$><!/>');
const uo = (e) => {
  const [t, n] = X(), o = (r) => {
    n(Z(t(), {
      root: r
    }));
  };
  return (() => {
    var r = f(co), i = r.firstChild, [s, a] = h(i.nextSibling), l = s.nextSibling, [d, m] = h(l.nextSibling), S = d.nextSibling, [$, M] = h(S.nextSibling), H = $.nextSibling, N = H.nextSibling, [R, D] = h(N.nextSibling);
    return $e(o, r), Ue(r, Qe(ft), !1, !0), p(r, c(lo, {}), s, a), p(r, c(x, {
      get when() {
        return t().options.files.clipboard || t().options.files.dragAndDrop;
      },
      get children() {
        return c(Nn, {});
      }
    }), d, m), p(r, c(x, {
      get when() {
        return t().options.interface.toolbar;
      },
      get children() {
        return c(io, {});
      }
    }), $, M), p(H, c(Rn, {
      get target() {
        return e.target;
      }
    })), p(r, c(x, {
      get when() {
        return t().options.readability || t().options.interface.attribution;
      },
      get children() {
        return c(Tn, {
          store: [t, n]
        });
      }
    }), R, D), ue(), r;
  })();
}, Re = lt([() => ce(), (e) => typeof e == "function" ? e(ce()) : e]), fo = (e) => (
  // eslint-disable-next-line solid/reactivity
  c(Re.Provider, {
    get value() {
      return e.store;
    },
    get children() {
      return e.children;
    }
  })
), X = () => ct(Re), We = (e) => c(fo, {
  get store() {
    return e.store;
  },
  get children() {
    return c(uo, {
      get store() {
        return e.store;
      },
      get target() {
        return e.target;
      }
    });
  }
});
var mo = /* @__PURE__ */ g("<div class=ink-mde-textarea>");
const So = (e) => e, Lo = (e) => e, Mo = (e) => e, po = (e, t = {}) => {
  const n = ke(t);
  return ko(), Xe(() => c(We, {
    store: n,
    target: e
  }), e), Oe(n);
}, jo = (e, t = {}) => e.querySelector(ut) ? po(e, t) : Ie(e, t), go = ({
  key: e = "",
  type: t,
  value: n
}) => new Proxy({
  key: e,
  type: t || "default"
}, {
  get: (o, r, i) => r === "value" && !o[r] ? (o.value = n(), Be(o.value) ? o.value.then((s) => o.value = s) : o.value) : o[r]
}), Eo = go, Ie = (e, t = {}) => {
  const n = ke(t);
  return Ke(() => c(We, {
    store: n,
    target: e
  }), e), Oe(n);
}, Ho = (e = {}) => (ke(e), ""), ko = () => {
  let e, t;
  e = window._$HY || (window._$HY = {
    events: [],
    completed: /* @__PURE__ */ new WeakSet(),
    r: {}
  }), t = (n) => n && n.hasAttribute && (n.hasAttribute("data-hk") ? n : t(n.host && n.host instanceof Node ? n.host : n.parentNode)), ["click", "input"].forEach((n) => document.addEventListener(n, (o) => {
    let r = o.composedPath && o.composedPath()[0] || o.target, i = t(r);
    i && !e.completed.has(i) && e.events.push([i, o]);
  })), e.init = (n, o) => {
    e.r[n] = [new Promise((r, i) => o = r), o];
  }, e.set = (n, o, r) => {
    (r = e.r[n]) && r[1](o), e.r[n] = [o];
  }, e.unset = (n) => {
    delete e.r[n];
  }, e.load = (n, o) => {
    if (o = e.r[n])
      return o[0];
  };
}, zo = (e, t = {}) => {
  const n = f(mo), o = e.value;
  e.after(n), e.style.display = "none";
  const r = Ie(n, {
    doc: o,
    ...t
  });
  return e.form && e.form.addEventListener("submit", () => {
    e.value = r.getDoc();
  }), r;
};
export {
  F as a,
  Lo as b,
  Mo as c,
  So as d,
  go as e,
  U as f,
  Eo as g,
  po as h,
  jo as i,
  Ho as j,
  xe as k,
  ne as p,
  Ie as r,
  ko as s,
  zo as w
};
//# sourceMappingURL=index-CnraD7yL.js.map
