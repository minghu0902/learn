import { IVNode, IVNodeData } from "../types/vnode.type";
import { VNode } from "./vnode";
import { createPatchFunction } from "./pach";
import nodeApi from "./nodeApi";
import modules from './modules/index';

export function patch (oldVnode: IVNode, vnode: IVNode) {
  return createPatchFunction(modules, nodeApi)(oldVnode, vnode)
}

export function h(tag: string, data: IVNodeData, children: IVNode[], text: string): IVNode {
  return new VNode(tag, data, children, text)
}

export default h
