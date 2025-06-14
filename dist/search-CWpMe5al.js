import { search as o, getSearchQuery as i, searchKeymap as p, findPrevious as d, findNext as h, SearchQuery as l, setSearchQuery as f } from "@codemirror/search";
import { keymap as m, runScopeHandlers as y } from "@codemirror/view";
const E = () => [o({
  top: !0,
  createPanel: (r) => {
    let a = i(r.state);
    const n = document.createElement("div"), e = document.createElement("input");
    n.setAttribute("class", "ink-mde-search-panel"), e.setAttribute("attr:main-field", "true"), e.setAttribute("class", "ink-mde-search-input"), e.setAttribute("type", "text"), e.setAttribute("value", a.search), n.appendChild(e);
    const s = (t) => {
      if (y(r, t, "search-panel"))
        return t.preventDefault();
      t.code === "Enter" && (t.preventDefault(), t.shiftKey ? d(r) : h(r));
    }, c = (t) => {
      const {
        value: u
      } = t.target;
      a = new l({
        search: u
      }), r.dispatch({
        effects: f.of(a)
      });
    };
    return e.addEventListener("input", c), e.addEventListener("keydown", s), {
      dom: n,
      mount: () => {
        e.focus();
      },
      top: !0
    };
  }
}), m.of(p)];
export {
  E as search
};
//# sourceMappingURL=search-CWpMe5al.js.map
