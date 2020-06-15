import { IVNode } from "../../types/vnode.type";
import { isPlainObject, isUndef } from "../util";


function updateClasses(oldVnode: IVNode, vnode: IVNode) {
  
  const elm = oldVnode.elm as Element
  const oldClasses = oldVnode.data.class
  const classList = Array.from(elm.classList)
  const classes = vnode.data.class

  if (!oldClasses && !classes) return;
  if (oldClasses === classes) return;

  // 移出不存在的 class
  classList.forEach(key => {
    if (isPlainObject(classes)) {
      if (isUndef(classes[key]) || classes[key] !== true) {
        elm.classList.remove(key)
      }
    }
  })
  
  // 添加新的 class
  if (isPlainObject(classes)) {
    for (const key in classes) {
      if (classes[key] === true) {
        elm.classList.add(key)
      }
    }
  }
}

export default {
  create: updateClasses,
  update: updateClasses
}
