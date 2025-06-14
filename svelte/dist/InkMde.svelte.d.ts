import { SvelteComponentTyped } from "svelte";
import type * as Ink from 'ink-mde';
declare const __propDef: {
    props: {
        value?: string | undefined;
        editor?: Ink.Instance | undefined;
        options?: Omit<Ink.Options, "doc"> | undefined;
    };
    events: {
        beforeUpdate: CustomEvent<string>;
        afterUpdate: CustomEvent<string>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type InkMdeProps = typeof __propDef.props;
export type InkMdeEvents = typeof __propDef.events;
export type InkMdeSlots = typeof __propDef.slots;
export default class InkMde extends SvelteComponentTyped<InkMdeProps, InkMdeEvents, InkMdeSlots> {
}
export {};
