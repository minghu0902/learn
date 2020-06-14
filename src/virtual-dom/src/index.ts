import { IVNode, IVNodeData } from "../types/vnode.types";
import { VNode } from "./vnode";
import { createPatchFunction } from "./pach";
import nodeApi from "./nodeApi";

export function patch () {
  return createPatchFunction([], nodeApi)
}

export function h(tag: string, data: IVNodeData, children: IVNode[], text: string): IVNode {
  return new VNode(tag, data, children, text)
}

export default h
