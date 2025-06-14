import * as vue from 'vue';
import { PropType } from 'vue';
import * as Ink from 'ink-mde';

declare const _default: vue.DefineComponent<{
    modelValue: {
        type: StringConstructor;
    };
    options: {
        type: PropType<Ink.Options>;
    };
}, unknown, {
    html: string;
    instance?: Ink.Instance | undefined;
}, {}, {
    tryInit(): void;
}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "update:modelValue"[], "update:modelValue", vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    modelValue: {
        type: StringConstructor;
    };
    options: {
        type: PropType<Ink.Options>;
    };
}>> & {
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}, {}, {}>;
//# sourceMappingURL=InkMde.vue.d.ts.map

export { _default as InkMde, _default as default };
