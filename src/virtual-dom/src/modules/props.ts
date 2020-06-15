import { IVNode } from "../../types/vnode.type";
import { isPlainObject } from "../util";

function updateProps(oldVnode: IVNode, vnode: IVNode) {

  const elm = oldVnode.elm as Element
  const oldProps = oldVnode.data.props
  const props = vnode.data.props

  if (!oldProps && !props) return;
  if (oldProps === props) return;

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