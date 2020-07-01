import { IVNode, IPlainObject } from "../../types/vnode.type";
import { isPlainObject } from "../util";

function updateProps(oldVnode: IVNode, vnode: IVNode) {

  const elm = vnode.elm as Element
  const oldProps = oldVnode.data.props as IPlainObject
  const props = vnode.data.props as IPlainObject

  if (!oldProps && !props) return
  if (oldProps === props) return

  if (isPlainObject(props)) {
    for (const key in props) {
      const oldVal = oldProps[key]
      const val = props[key]
      if (oldVal !== val && (elm as any)[key] !== val) {
        (elm as any)[key] = val
      }
    }
  }
}

export default {
  create: updateProps,
  update: updateProps
} 