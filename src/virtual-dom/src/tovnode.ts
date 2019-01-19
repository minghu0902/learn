import domapi from './htmldomapi';
import { vnode } from './vnode';

function toVnode(node: Node) {
    let api = domapi;
    let text: string;
    if(api.isElement(node)) {
        const id = node.id;
        const cn = node.getAttribute('class');
        const c= cn ? '.' + cn.split(' ').join('.') : '';
        const sel = api.tagName(node).toLowerCase() + id + c;
        const attrs = {};
        const children = [];
        const elmAttrs = node.attributes;
        const elmChildNodes = node.childNodes;
        // 收集属性
        for(let i = 0; i < elmAttrs.length; i++) {
            const name = elmAttrs[i].nodeName;
            if(name !== 'id' && name !== 'class') {
                attrs[name] = elmAttrs[i].nodeValue;
            }
        }
        // 收集子节点
        for(let i = 0; i < elmChildNodes.length; i++) {
            children.push(toVnode(elmChildNodes[i]));
        }
        return vnode(sel, { attrs }, children, undefined, node);
    } else if(api.isText(node)) {
        text = api.getTextContent(node) as string;
        return vnode(undefined, undefined, undefined, text, node);
    } else if(api.isComment(node)) {
        text = api.getTextContent(node) as string;
        return vnode('!', {}, [], text, node);
    } else {
        return vnode('', {}, [], undefined, node);
    }
}

export default vnode;