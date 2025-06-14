import { syntaxTree } from '@codemirror/language';
import { StateField } from '@codemirror/state';
import { EditorView, ViewPlugin, Decoration } from '@codemirror/view';

const buildWidget = (options) => {
  const eq = (other) => {
    if (options.eq)
      return options.eq(other);
    if (!options.id)
      return false;
    return options.id === other.id;
  };
  return {
    compare: (other) => {
      return eq(other);
    },
    coordsAt: () => null,
    destroy: () => {
    },
    eq: (other) => {
      return eq(other);
    },
    estimatedHeight: -1,
    ignoreEvent: () => true,
    lineBreaks: 0,
    toDOM: () => {
      return document.createElement("span");
    },
    updateDOM: () => false,
    ...options
  };
};

const tabSize = 2;
const spacerWidget = () => {
  return buildWidget({
    toDOM: () => {
      const spacer = document.createElement("span");
      spacer.className = "ink-mde-indent";
      spacer.style.width = `2rem`;
      spacer.style.textDecoration = "none";
      spacer.style.display = "inline-flex";
      const spacerLine = document.createElement("span");
      spacerLine.className = "ink-mde-indent-marker";
      spacerLine.innerHTML = "&nbsp;";
      spacer.appendChild(spacerLine);
      return spacer;
    }
  });
};
const createWrapper = () => {
  const wrapper = document.createElement("label");
  wrapper.setAttribute("aria-hidden", "true");
  wrapper.setAttribute("tabindex", "-1");
  wrapper.className = "ink-mde-list-marker";
  wrapper.style.minWidth = "2rem";
  return wrapper;
};
const taskWidget = (isChecked) => buildWidget({
  eq: (other) => {
    return other.isChecked === isChecked;
  },
  ignoreEvent: () => false,
  isChecked,
  toDOM: () => {
    const wrapper = createWrapper();
    const input = document.createElement("input");
    input.setAttribute("aria-hidden", "true");
    input.setAttribute("tabindex", "-1");
    input.className = "ink-mde-task-marker";
    input.type = "checkbox";
    input.checked = isChecked;
    wrapper.classList.add("ink-mde-task");
    wrapper.appendChild(input);
    return wrapper;
  }
});
const dotWidget = () => {
  return buildWidget({
    toDOM: () => {
      const wrapper = createWrapper();
      wrapper.setAttribute("inert", "true");
      wrapper.innerHTML = "&bull;";
      return wrapper;
    }
  });
};
const numberWidget = (marker) => {
  return buildWidget({
    toDOM: () => {
      const wrapper = createWrapper();
      const content = document.createElement("span");
      wrapper.setAttribute("inert", "true");
      wrapper.appendChild(content);
      content.setAttribute("aria-hidden", "true");
      content.setAttribute("tabindex", "-1");
      content.className = "ink-mde-number-marker";
      content.innerHTML = `${marker}`;
      return wrapper;
    }
  });
};
const getVals = (state, { from, to, type }) => {
  if (type.name === "Blockquote") {
    return false;
  }
  if (type.name !== "ListMark") {
    return;
  }
  const line = state.doc.lineAt(from);
  const lineStart = line.from;
  const marker = state.sliceDoc(from, to);
  const markerStart = from;
  const markerEnd = to;
  const markerHasTrailingSpace = state.sliceDoc(markerEnd, markerEnd + 1) === " ";
  const indentation = markerStart - lineStart;
  if (!markerHasTrailingSpace) {
    return;
  }
  const indentLevel = Math.floor(indentation / tabSize);
  const spacerDecorations = [];
  for (const index of Array(indentLevel).keys()) {
    const from2 = lineStart + index * tabSize;
    const to2 = from2 + tabSize;
    const spacerDec = Decoration.replace({ widget: spacerWidget() }).range(from2, to2);
    spacerDecorations.push(spacerDec);
  }
  return {
    indentLevel,
    indentation,
    lineStart,
    marker,
    markerEnd,
    markerStart,
    spacerDecorations
  };
};
const bulletLists = () => {
  const decorate = (state) => {
    const atomicRanges = [];
    const decorationRanges = [];
    syntaxTree(state).iterate({
      enter: (node) => {
        const result = getVals(state, node);
        if (!result) {
          return result;
        }
        const { indentLevel, lineStart, marker, markerEnd, markerStart, spacerDecorations } = result;
        if (!["-", "*"].includes(marker)) {
          return;
        }
        const lineDec = Decoration.line({
          attributes: {
            class: "ink-mde-list ink-mde-bullet-list",
            style: `--indent-level: ${indentLevel}`
          }
        }).range(lineStart);
        decorationRanges.push(lineDec);
        decorationRanges.push(...spacerDecorations);
        atomicRanges.push(...spacerDecorations);
        const textStart = markerEnd + 1;
        const dotDec = Decoration.replace({
          widget: dotWidget()
        }).range(markerStart, textStart);
        decorationRanges.push(dotDec);
        atomicRanges.push(dotDec);
      }
    });
    return [Decoration.set(decorationRanges, true), Decoration.set(atomicRanges, true)];
  };
  const stateField = StateField.define({
    create(state) {
      return decorate(state);
    },
    update(_references, { state }) {
      return decorate(state);
    },
    provide(field) {
      const result = [
        EditorView.decorations.of((view) => {
          const [decorationRanges, _atomicRanges] = view.state.field(field);
          return decorationRanges;
        }),
        EditorView.atomicRanges.of((view) => {
          const [_decorationRanges, atomicRanges] = view.state.field(field);
          return atomicRanges;
        })
      ];
      return result;
    }
  });
  return [
    stateField
  ];
};
const numberLists = () => {
  const decorate = (state) => {
    const atomicRanges = [];
    const decorationRanges = [];
    syntaxTree(state).iterate({
      enter: (node) => {
        const result = getVals(state, node);
        if (!result) {
          return result;
        }
        const { indentLevel, lineStart, marker, markerEnd, markerStart, spacerDecorations } = result;
        if (["-", "*"].includes(marker)) {
          return;
        }
        const lineDec = Decoration.line({
          attributes: {
            class: "ink-mde-list ink-mde-number-list",
            style: `--indent-level: ${indentLevel}`
          }
        }).range(lineStart);
        decorationRanges.push(lineDec);
        decorationRanges.push(...spacerDecorations);
        atomicRanges.push(...spacerDecorations);
        const textStart = markerEnd + 1;
        const dotDec = Decoration.replace({
          widget: numberWidget(marker)
        }).range(markerStart, textStart);
        decorationRanges.push(dotDec);
        atomicRanges.push(dotDec);
      }
    });
    return [Decoration.set(decorationRanges, true), Decoration.set(atomicRanges, true)];
  };
  const stateField = StateField.define({
    create(state) {
      return decorate(state);
    },
    update(_references, { state }) {
      return decorate(state);
    },
    provide(field) {
      const result = [
        EditorView.decorations.of((view) => {
          const [decorationRanges, _atomicRanges] = view.state.field(field);
          return decorationRanges;
        }),
        EditorView.atomicRanges.of((view) => {
          const [_decorationRanges, atomicRanges] = view.state.field(field);
          return atomicRanges;
        })
      ];
      return result;
    }
  });
  return [
    stateField
  ];
};
const taskLists = () => {
  const decorate = (state) => {
    const atomicRanges = [];
    const decorationRanges = [];
    syntaxTree(state).iterate({
      enter: (node) => {
        const result = getVals(state, node);
        if (!result) {
          return result;
        }
        const { indentLevel, lineStart, marker, markerEnd, markerStart, spacerDecorations } = result;
        if (!["-", "*"].includes(marker)) {
          return;
        }
        const taskStart = markerEnd + 1;
        const taskEnd = taskStart + 3;
        const task = state.sliceDoc(taskStart, taskEnd);
        if (!["[ ]", "[x]"].includes(task)) {
          return;
        }
        const textStart = taskEnd + 1;
        const taskHasTrailingSpace = state.sliceDoc(taskEnd, textStart) === " ";
        if (!taskHasTrailingSpace) {
          return;
        }
        const isChecked = task === "[x]";
        const lineDec = Decoration.line({
          attributes: {
            class: `ink-mde-list ink-mde-task-list ${isChecked ? "ink-mde-task-checked" : "ink-mde-task-unchecked"}`,
            style: `--indent-level: ${indentLevel}`
          }
        }).range(lineStart);
        decorationRanges.push(lineDec);
        decorationRanges.push(...spacerDecorations);
        atomicRanges.push(...spacerDecorations);
        const taskDec = Decoration.replace({
          widget: taskWidget(isChecked)
        }).range(markerStart, textStart);
        decorationRanges.push(taskDec);
        atomicRanges.push(taskDec);
      }
    });
    return [Decoration.set(decorationRanges, true), Decoration.set(atomicRanges, true)];
  };
  const viewPlugin = ViewPlugin.define(() => ({}), {
    eventHandlers: {
      mousedown: (event, view) => {
        const target = event.target;
        const realTarget = target.closest(".ink-mde-list-marker")?.querySelector(".ink-mde-task-marker");
        if (realTarget) {
          const position = view.posAtDOM(realTarget);
          const from = position - 4;
          const to = position - 1;
          const before = view.state.sliceDoc(from, to);
          if (before === "[ ]") {
            view.dispatch({
              changes: {
                from,
                to,
                insert: "[x]"
              }
            });
          }
          if (before === "[x]") {
            view.dispatch({
              changes: {
                from,
                to,
                insert: "[ ]"
              }
            });
          }
          return true;
        }
      }
    }
  });
  const stateField = StateField.define({
    create(state) {
      return decorate(state);
    },
    update(_references, { state }) {
      return decorate(state);
    },
    provide(field) {
      const result = [
        EditorView.decorations.of((view) => {
          const [decorationRanges, _atomicRanges] = view.state.field(field);
          return decorationRanges;
        }),
        EditorView.atomicRanges.of((view) => {
          const [_decorationRanges, atomicRanges] = view.state.field(field);
          return atomicRanges;
        })
      ];
      return result;
    }
  });
  return [
    viewPlugin,
    stateField
  ];
};
const lists = (config) => {
  return [
    config.task ? taskLists() : [],
    config.bullet ? bulletLists() : [],
    config.number ? numberLists() : [],
    EditorView.theme({
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
};

export { lists };
//# sourceMappingURL=lists-CgPfpDW-.js.map
