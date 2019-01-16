import { Props } from './modules/props';
import { Attrs } from './modules/attributes';
import { Classes } from './modules/class';
import { VNodeStyle } from './modules/style';

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
}

export function vnode(
    sel: string | undefined,
    data: VNodeData | undefined,
    children: Array<VNode | string> | undefined,
    elm: Node | undefined,
    text: string | undefined,
    key: string | number | undefined
): VNode {
    return { sel, data, children, elm, text, key}
}

export default vnode;
