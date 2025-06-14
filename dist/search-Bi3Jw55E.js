import { search as search$1, getSearchQuery, searchKeymap, findPrevious, findNext, SearchQuery, setSearchQuery } from '@codemirror/search';
import { keymap, runScopeHandlers } from '@codemirror/view';

const search = () => {
  return [search$1({
    top: true,
    createPanel: view => {
      let query = getSearchQuery(view.state);
      const wrapper = document.createElement('div');
      const input = document.createElement('input');
      wrapper.setAttribute('class', 'ink-mde-search-panel');
      input.setAttribute('attr:main-field', 'true');
      input.setAttribute('class', 'ink-mde-search-input');
      input.setAttribute('type', 'text');
      input.setAttribute('value', query.search);
      wrapper.appendChild(input);
      const handleKeyDown = event => {
        if (runScopeHandlers(view, event, 'search-panel')) return event.preventDefault();
        if (event.code === 'Enter') {
          event.preventDefault();
          if (event.shiftKey) {
            findPrevious(view);
          } else {
            findNext(view);
          }
        }
      };
      const updateSearch = event => {
        // @ts-expect-error "value" is not a recognized property of EventTarget.
        const {
          value
        } = event.target;
        query = new SearchQuery({
          search: value
        });
        view.dispatch({
          effects: setSearchQuery.of(query)
        });
      };
      input.addEventListener('input', updateSearch);
      input.addEventListener('keydown', handleKeyDown);
      return {
        dom: wrapper,
        mount: () => {
          input.focus();
        },
        top: true
      };
    }
  }), keymap.of(searchKeymap)];
};

export { search };
//# sourceMappingURL=search-Bi3Jw55E.js.map
