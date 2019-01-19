import { Props } from './modules/props';
import { Attrs } from './modules/attributes';
import { Classes } from './modules/class';
import { VNodeStyle } from './modules/style';
import { Dataset } from './modules/dataset';
import { On } from './modules/eventlisteners';

export interface VNode {
    sel: string | undefined;
    data: VNodeData | undefined;
    children: Array<VNode | string> | undefined;
    elm: Node | undefined;
    text: string | undefined;
    key: string | number | undefined;
}

export interface VNodeData {
    props?: Props;
    attrs?: Attrs;
    class?: Classes;
    style?: VNodeStyle;
    dataset?: Dataset;
    on?: On;
    key?: string | number;
}

export function vnode(
    sel: string | undefined,
    data: VNodeData | undefined,
    children: Array<VNode | string> | undefined,
    text: string | undefined,
    elm: Node | undefined
): VNode {
    const key = data ? data.key : undefined;
    return { sel, data, children, text, elm, key: key }
}

export default vnode;
