import { IVNode } from "../../types/vnode.type";
import { isUndef, isPlainObject } from "../util";

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
  const elm = vnode.elm as Element
  const oldAttrs = oldVnode.data.attrs
  const attrs = vnode.data.attrs

  if (!oldAttrs && !attrs) return;
  if (oldAttrs === attrs) return;

  if (isPlainObject(oldAttrs) && isPlainObject(attrs)) {
    for (const key in oldAttrs) {
      if (isUndef(attrs[key])) {
        removeAttr(elm, key)
      }
    }
    for (const key in attrs) {
      setAttr(elm, key, attrs[key])
    }
  } else if (isPlainObject(oldAttrs)) {
    for (const key in oldAttrs) {
      removeAttr(elm, key)
    }
  } else if (isPlainObject(attrs)) {
    for (const key in attrs) {
      setAttr(elm, key, attrs[key])
    }
  }
}

export default {
  create: updateAttrs,
  update: updateAttrs
}