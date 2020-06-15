import { IVNode, IPlainObject } from "../../types/vnode.type";
import { isDef, isUndef } from "../util";

const xlinkNS = 'http://www.w3.org/1999/xlink'

function isXlink(name: string) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
}

function getXlinkProp(name: string) {
  return name.slice(6)
}

function setAttr(elm: Element, key: string, value: string) {
  if (isXlink(key)) {
    elm.setAttributeNS(xlinkNS, key, value)
  } else {
    elm.setAttribute(key, value)
  }
}

function removeAttr(elm: Element, key: string) {
  if (isXlink(key)) {
    elm.removeAttributeNS(xlinkNS, getXlinkProp(key))
  } else {
    elm.removeAttribute(key)
  }
}

function updateAttrs(oldVnode: IVNode, vnode: IVNode) {
  const elm = oldVnode.elm as Element
  const oldAttrs = oldVnode.data.attrs
  const attrs = vnode.data.attrs

  if (oldAttrs === attrs) {
    return
  }

  if (isDef(oldAttrs) && isDef(attrs)) {
    for (const key in oldAttrs) {
      if (isUndef(attrs[key])) {
        removeAttr(elm, key)
      }
    }
    for (const key in attrs) {
      setAttr(elm, key, attrs[key])
    }
  } else if (isDef(oldAttrs)) {
    for (const key in oldAttrs) {
      removeAttr(elm, key)
    }
  } else if (isDef(attrs)) {
    for (const key in attrs) {
      setAttr(elm, key, attrs[key])
    }
  }
}

export default {
  create: updateAttrs,
  update: updateAttrs
}