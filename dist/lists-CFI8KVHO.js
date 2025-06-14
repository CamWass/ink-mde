import { syntaxTree as R } from "@codemirror/language";
import { StateField as v } from "@codemirror/state";
import { EditorView as h, ViewPlugin as M, Decoration as l } from "@codemirror/view";
const D = (e) => {
  const s = (t) => e.eq ? e.eq(t) : e.id ? e.id === t.id : !1;
  return {
    compare: (t) => s(t),
    coordsAt: () => null,
    destroy: () => {
    },
    eq: (t) => s(t),
    estimatedHeight: -1,
    ignoreEvent: () => !0,
    lineBreaks: 0,
    toDOM: () => document.createElement("span"),
    updateDOM: () => !1,
    ...e
  };
}, x = 2, _ = () => D({
  toDOM: () => {
    const e = document.createElement("span");
    e.className = "ink-mde-indent", e.style.width = "2rem", e.style.textDecoration = "none", e.style.display = "inline-flex";
    const s = document.createElement("span");
    return s.className = "ink-mde-indent-marker", s.innerHTML = "&nbsp;", e.appendChild(s), e;
  }
}), y = () => {
  const e = document.createElement("label");
  return e.setAttribute("aria-hidden", "true"), e.setAttribute("tabindex", "-1"), e.className = "ink-mde-list-marker", e.style.minWidth = "2rem", e;
}, H = (e) => D({
  eq: (s) => s.isChecked === e,
  ignoreEvent: () => !1,
  isChecked: e,
  toDOM: () => {
    const s = y(), t = document.createElement("input");
    return t.setAttribute("aria-hidden", "true"), t.setAttribute("tabindex", "-1"), t.className = "ink-mde-task-marker", t.type = "checkbox", t.checked = e, s.classList.add("ink-mde-task"), s.appendChild(t), s;
  }
}), O = () => D({
  toDOM: () => {
    const e = y();
    return e.setAttribute("inert", "true"), e.innerHTML = "&bull;", e;
  }
}), T = (e) => D({
  toDOM: () => {
    const s = y(), t = document.createElement("span");
    return s.setAttribute("inert", "true"), s.appendChild(t), t.setAttribute("aria-hidden", "true"), t.setAttribute("tabindex", "-1"), t.className = "ink-mde-number-marker", t.innerHTML = `${e}`, s;
  }
}), w = (e, { from: s, to: t, type: r }) => {
  if (r.name === "Blockquote")
    return !1;
  if (r.name !== "ListMark")
    return;
  const i = e.doc.lineAt(s).from, a = e.sliceDoc(s, t), o = s, c = t, d = e.sliceDoc(c, c + 1) === " ", u = o - i;
  if (!d)
    return;
  const g = Math.floor(u / x), p = [];
  for (const f of Array(g).keys()) {
    const k = i + f * x, m = k + x, b = l.replace({ widget: _() }).range(k, m);
    p.push(b);
  }
  return {
    indentLevel: g,
    indentation: u,
    lineStart: i,
    marker: a,
    markerEnd: c,
    markerStart: o,
    spacerDecorations: p
  };
}, W = () => {
  const e = (t) => {
    const r = [], n = [];
    return R(t).iterate({
      enter: (i) => {
        const a = w(t, i);
        if (!a)
          return a;
        const { indentLevel: o, lineStart: c, marker: d, markerEnd: u, markerStart: g, spacerDecorations: p } = a;
        if (!["-", "*"].includes(d))
          return;
        const f = l.line({
          attributes: {
            class: "ink-mde-list ink-mde-bullet-list",
            style: `--indent-level: ${o}`
          }
        }).range(c);
        n.push(f), n.push(...p), r.push(...p);
        const k = u + 1, m = l.replace({
          widget: O()
        }).range(g, k);
        n.push(m), r.push(m);
      }
    }), [l.set(n, !0), l.set(r, !0)];
  };
  return [
    v.define({
      create(t) {
        return e(t);
      },
      update(t, { state: r }) {
        return e(r);
      },
      provide(t) {
        return [
          h.decorations.of((n) => {
            const [i, a] = n.state.field(t);
            return i;
          }),
          h.atomicRanges.of((n) => {
            const [i, a] = n.state.field(t);
            return a;
          })
        ];
      }
    })
  ];
}, q = () => {
  const e = (t) => {
    const r = [], n = [];
    return R(t).iterate({
      enter: (i) => {
        const a = w(t, i);
        if (!a)
          return a;
        const { indentLevel: o, lineStart: c, marker: d, markerEnd: u, markerStart: g, spacerDecorations: p } = a;
        if (["-", "*"].includes(d))
          return;
        const f = l.line({
          attributes: {
            class: "ink-mde-list ink-mde-number-list",
            style: `--indent-level: ${o}`
          }
        }).range(c);
        n.push(f), n.push(...p), r.push(...p);
        const k = u + 1, m = l.replace({
          widget: T(d)
        }).range(g, k);
        n.push(m), r.push(m);
      }
    }), [l.set(n, !0), l.set(r, !0)];
  };
  return [
    v.define({
      create(t) {
        return e(t);
      },
      update(t, { state: r }) {
        return e(r);
      },
      provide(t) {
        return [
          h.decorations.of((n) => {
            const [i, a] = n.state.field(t);
            return i;
          }),
          h.atomicRanges.of((n) => {
            const [i, a] = n.state.field(t);
            return a;
          })
        ];
      }
    })
  ];
}, C = () => {
  const e = (r) => {
    const n = [], i = [];
    return R(r).iterate({
      enter: (a) => {
        const o = w(r, a);
        if (!o)
          return o;
        const { indentLevel: c, lineStart: d, marker: u, markerEnd: g, markerStart: p, spacerDecorations: f } = o;
        if (!["-", "*"].includes(u))
          return;
        const k = g + 1, m = k + 3, b = r.sliceDoc(k, m);
        if (!["[ ]", "[x]"].includes(b))
          return;
        const S = m + 1;
        if (!(r.sliceDoc(m, S) === " "))
          return;
        const L = b === "[x]", A = l.line({
          attributes: {
            class: `ink-mde-list ink-mde-task-list ${L ? "ink-mde-task-checked" : "ink-mde-task-unchecked"}`,
            style: `--indent-level: ${c}`
          }
        }).range(d);
        i.push(A), i.push(...f), n.push(...f);
        const E = l.replace({
          widget: H(L)
        }).range(p, S);
        i.push(E), n.push(E);
      }
    }), [l.set(i, !0), l.set(n, !0)];
  }, s = M.define(() => ({}), {
    eventHandlers: {
      mousedown: (r, n) => {
        const a = r.target.closest(".ink-mde-list-marker")?.querySelector(".ink-mde-task-marker");
        if (a) {
          const o = n.posAtDOM(a), c = o - 4, d = o - 1, u = n.state.sliceDoc(c, d);
          return u === "[ ]" && n.dispatch({
            changes: {
              from: c,
              to: d,
              insert: "[x]"
            }
          }), u === "[x]" && n.dispatch({
            changes: {
              from: c,
              to: d,
              insert: "[ ]"
            }
          }), !0;
        }
      }
    }
  }), t = v.define({
    create(r) {
      return e(r);
    },
    update(r, { state: n }) {
      return e(n);
    },
    provide(r) {
      return [
        h.decorations.of((i) => {
          const [a, o] = i.state.field(r);
          return a;
        }),
        h.atomicRanges.of((i) => {
          const [a, o] = i.state.field(r);
          return o;
        })
      ];
    }
  });
  return [
    s,
    t
  ];
}, V = (e) => [
  e.task ? C() : [],
  e.bullet ? W() : [],
  e.number ? q() : [],
  h.theme({
    ":where(.ink-mde-indent)": {
      display: "inline-flex",
      justifyContent: "center"
    },
    ":where(.ink-mde-indent-marker)": {
      borderLeft: "1px solid var(--ink-internal-syntax-processing-instruction-color)",
      bottom: "0",
      overflow: "hidden",
      position: "absolute",
      top: "0",
      width: "0"
    },
    ":where(.ink-mde-list)": {
      paddingLeft: "calc(var(--indent-level) * 2rem + 2rem) !important",
      position: "relative",
      textIndent: "calc((var(--indent-level) * 2rem + 2rem) * -1)"
    },
    ":where(.ink-mde-list *)": {
      textIndent: "0"
    },
    ":where(.ink-mde-list-marker)": {
      alignItems: "center",
      color: "var(--ink-internal-syntax-processing-instruction-color)",
      display: "inline-flex",
      justifyContent: "center",
      minWidth: "2rem"
    },
    ":where(.ink-mde-task-marker)": {
      cursor: "pointer",
      margin: "0",
      scale: "1.2",
      transformOrigin: "center center"
    },
    ":where(.ink-mde-task-list.ink-mde-task-checked)": {
      textDecoration: "line-through",
      textDecorationColor: "var(--ink-internal-syntax-processing-instruction-color)"
    }
  })
];
export {
  V as lists
};
//# sourceMappingURL=lists-CFI8KVHO.js.map
