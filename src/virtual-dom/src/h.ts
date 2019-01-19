import { vnode, VNode, VNodeData } from "./vnode";

export function h(sel: string, data: VNodeData, children: Array<VNode>, text: any, elm: Node): VNode {
    return vnode(sel, data, children, text, elm);
}