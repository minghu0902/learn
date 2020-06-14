import { IVNode } from "./vnode.type";

export interface IModule {
  pre: () => any
  post: () => any
  create: (emptyVnode: IVNode, vnode: IVNode) => any
  update: (oldVnode: IVNode, vnode: IVNode) => any
  remove: (vnode: IVNode, rm: () => void) => any
  destroy: (vnode: IVNode) => any
}

export type ModuleHooks = {
  [key in keyof IModule]: Array<IModule[key]>
}

export type On = {
	[key in keyof HTMLElementEventMap]: (e: HTMLElementEventMap[key]) => void
}
