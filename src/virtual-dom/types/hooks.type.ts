import { IVNode } from "./vnode.type";

export type Hooks = {
  prePatch: (oldVnode: IVNode, vnode: IVNode) => any
  postPatch: (oldVnode: IVNode, vnode: IVNode) => any
  create: (emptyVnode: IVNode, vnode: IVNode) => any
  insert: (vnode: IVNode) => any
  update: (oldVnode: IVNode, vnode: IVNode) => any
  remove: (vnode: IVNode, rm: () => void) => any
  destroy: (vnode: IVNode) => any
}