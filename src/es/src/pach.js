import { isDef, isUndef, isArray, isPrimitive } from "./util";
import { VNode } from "./vnode";
const emptyVnode = new VNode('', {}, [], '');
function isSameVnode(a, b) {
    return a.key === b.key && a.tag === b.tag;
}
const hooks = ['pre', 'post', 'create', 'update', 'remove', 'destroy'];
export function createPatchFunction(modules, nodeApi) {
    let cbs = {};
    // 收集不同 module 的 hooks
    for (const hook of hooks) {
        cbs[hook] = [];
        for (const module of modules) {
            if (isDef(module[hook])) {
                cbs[hook].push(module[hook]);
            }
        }
    }
    function invokeCreateHooks(vnode, insertedVnodeQueue) {
        for (const hook of cbs.create) {
            hook(emptyVnode, vnode);
        }
        if (isDef(vnode.data)) {
            let i = vnode.data.hook;
            if (isDef(i)) {
                if (i.create)
                    i.create(emptyVnode, vnode);
                if (i.insert)
                    insertedVnodeQueue.push(vnode);
            }
        }
    }
    function invokeInsertedHooks(insertedVnodeQueue) {
        let i;
        for (const vnode of insertedVnodeQueue) {
            if (vnode.data && (i = vnode.data.hook) && (i = i.insert)) {
                i(vnode);
            }
        }
    }
    function invokeUpdateHooks(oldVnode, vnode) {
        // 执行 module update hooks
        for (const hook of cbs.update) {
            hook(oldVnode, vnode);
        }
        // 执行 vnode update hook
        let i;
        if (vnode.data && (i = vnode.data.hook) && (i = i.update)) {
            i(oldVnode, vnode);
        }
    }
    function invokeDestroyHooks(vnode) {
        // 执行 module destroy hooks
        for (const hook of cbs.destroy) {
            hook(vnode);
        }
        // 执行 vnode destroy hook
        let i;
        if (vnode.data && (i = vnode.data.hook) && (i = i.destroy)) {
            i(vnode);
        }
        // 递归执行子节点
        const ch = vnode.children;
        if (isArray(vnode.children)) {
            for (const ch of vnode.children) {
                invokeDestroyHooks(ch);
            }
        }
    }
    function invokeRemoveHooks(vnode) {
        // 执行 module remove hooks
        const listeners = cbs.remove.length + 1;
        // 将 remove 的控制权交给外界
        const rm = createRmCb(vnode, listeners);
        for (const hook of cbs.remove) {
            hook(vnode, rm);
        }
        // 执行 vnode destroy hook
        let i;
        if (vnode.data && (i = vnode.data.hook) && (i = i.remove)) {
            i(vnode, rm);
        }
        else {
            rm();
        }
    }
    function createRmCb(vnode, listeners) {
        return function () {
            if (--listeners === 0) {
                const parentNode = nodeApi.parentNode(vnode.elm);
                if (parentNode) {
                    nodeApi.removeChild(parentNode, vnode.elm);
                }
            }
        };
    }
    function insert(elm, parentElm, refElm) {
        if (refElm) {
            nodeApi.insertBefore(parentElm, elm, refElm);
        }
        else {
            nodeApi.appendChild(elm, parentElm);
        }
    }
    function createChildren(vnode, children, insertedVnodeQueue) {
        if (isArray(children)) {
            for (const child of children) {
                createElm(child, insertedVnodeQueue, vnode.elm);
            }
        }
        else if (isPrimitive(vnode.text)) {
            nodeApi.appendChild(vnode.elm, nodeApi.createTextNode(String(vnode.text)));
        }
    }
    function createElm(vnode, insertedVnodeQueue, parentElm) {
        const tag = vnode.tag;
        const children = vnode.children;
        if (isDef(tag)) {
            // 创建元素节点
            if (vnode.data && typeof vnode.data.ns === 'string') {
                vnode.elm = nodeApi.createElementNs(vnode.data.ns, tag);
            }
            else {
                vnode.elm = nodeApi.createElement(tag);
            }
            // 创建子节点
            createChildren(vnode, children, insertedVnodeQueue);
            // 插入元素节点
            if (parentElm) {
                insert(vnode.elm, parentElm);
            }
            // 调用 vnode create hook
            // 并收集当前当前节点到 insertedVnodeQueue，等到所有节点都创建完成，则从子到父依次调用 vnode insert hook
            invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        else {
            if (!vnode.text)
                vnode.text = '';
            // 创建文本节点
            vnode.elm = nodeApi.createTextNode(String(vnode.text));
            // 插入文本节点
            if (parentElm) {
                insert(vnode.elm, parentElm);
            }
        }
        return vnode.elm;
    }
    function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
        for (; startIdx <= endIdx; startIdx++) {
            const vnode = vnodes[startIdx];
            if (vnode) {
                if (vnode.tag) {
                    invokeRemoveHooks(vnode);
                    invokeDestroyHooks(vnode);
                }
                else {
                    nodeApi.removeChild(parentElm, vnode.elm);
                }
            }
        }
    }
    function addVnodes(parentElm, vnodes, startIdx, endIdx, insertedVnodeQueue, refElm) {
        for (; startIdx <= endIdx; startIdx++) {
            const vnode = vnodes[startIdx];
            if (vnode) {
                nodeApi.insertBefore(parentElm, createElm(vnode, insertedVnodeQueue), refElm);
            }
        }
    }
    function createKeyToIdx(ch) {
        let res = {};
        if (isArray(ch)) {
            for (let i = 0; i < ch.length; i++) {
                const c = ch[i];
                if (c.key) {
                    res[c.key] = i;
                }
            }
        }
        return res;
    }
    function updateChildren(parentElm, oldCh, ch, insertedVnodeQueue) {
        let oldStartIdx = 0;
        let oldEndIdx = oldCh.length - 1;
        let oldStartVnode = oldCh[0];
        let oldEndVnode = oldCh[oldEndIdx];
        let newStartIdx = 0;
        let newEndIdx = ch.length - 1;
        let newStartVnode = ch[0];
        let newEndVnode = ch[newEndIdx];
        let oldKeyToIdx;
        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            if (isUndef(oldStartVnode)) {
                oldStartIdx++;
            }
            else if (isUndef(oldEndVnode)) {
                oldEndIdx--;
            }
            else if (isUndef(newStartVnode)) {
                newStartIdx++;
            }
            else if (isUndef(newEndVnode)) {
                newEndIdx--;
            }
            else if (isSameVnode(oldStartVnode, newStartVnode)) {
                patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
                oldStartIdx++;
                newStartIdx++;
            }
            else if (isSameVnode(oldEndVnode, newEndVnode)) {
                patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
                oldEndIdx--;
                newEndIdx--;
            }
            else if (isSameVnode(oldStartVnode, newEndVnode)) {
                patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
                nodeApi.insertBefore(parentElm, newEndVnode.elm, nodeApi.nextSibling(oldEndVnode.elm));
                oldStartVnode = oldCh[++oldStartIdx];
                newEndVnode = ch[--newEndIdx];
            }
            else if (isSameVnode(oldEndVnode, newStartVnode)) {
                patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
                nodeApi.insertBefore(parentElm, newStartVnode.elm, oldStartVnode.elm);
                oldEndVnode = oldCh[--oldEndIdx];
                newStartVnode = ch[--newStartIdx];
            }
            else {
                if (!oldKeyToIdx) {
                    // 生成 oldCH 中 key 和 下标 的映射关系
                    oldKeyToIdx = createKeyToIdx(oldCh);
                }
                // 在 oldCh 中寻找当前 newStartVnode.key 对应的 vnode的下标
                const idx = oldKeyToIdx[newStartVnode.key];
                if (isDef(idx)) {
                    const targetVnode = oldCh[idx];
                    if (targetVnode.tag !== newStartVnode.tag) {
                        // key 相同，tag 不同，则需要重新创建元素，并插入到父节点中
                        nodeApi.insertBefore(parentElm, createElm(targetVnode, insertedVnodeQueue), oldStartVnode.elm);
                    }
                    else {
                        // key 和 tag 都相同，则进行patch操作
                        // patch 之后插入到父节点并将 oldch 中的目标节点位置设为空
                        patchVnode(targetVnode, newStartVnode, insertedVnodeQueue);
                        nodeApi.insertBefore(parentElm, targetVnode.elm, oldStartVnode.elm);
                        // 此处设置为空之后，为了循环到 idx处时，走 oldStartIdx++ 的逻辑
                        oldCh[idx] = null;
                    }
                }
                else {
                    // 如果没找到则创建新元素并插入到父节点中
                    nodeApi.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                }
                newStartVnode = ch[++newStartIdx];
            }
        }
        // 为了处理 oldCh 和 ch 中节点数量不一样的问题
        if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
            // 如果 ch 没遍历完，oldCh 已经遍历完
            if (oldStartIdx > oldEndIdx) {
                const refElm = ch[newEndIdx + 1] ? ch[newEndIdx + 1].elm : null;
                addVnodes(parentElm, ch, newStartIdx, newEndIdx, insertedVnodeQueue, refElm);
            }
            else {
                // 如果 ch 已经遍历完，而 oldCh 没遍历完
                removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
            }
        }
    }
    function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
        // 执行 vnode prePatch hook
        let i, hook;
        if (isDef(i = vnode.data) && isDef(hook = i.hook) && isDef(i = hook.prePatch)) {
            i(oldVnode, vnode);
        }
        // 执行 module update hooks
        if (vnode.data) {
            invokeUpdateHooks(oldVnode, vnode);
        }
        const elm = vnode.elm;
        const oldCh = oldVnode.children;
        const ch = vnode.children;
        if (isUndef(vnode.text)) {
            if (isArray(oldCh) && isArray(ch)) {
                updateChildren(elm, oldCh, ch, insertedVnodeQueue);
            }
            else if (isArray(oldCh)) {
                if (vnode.text) {
                    nodeApi.setTextContent(elm, '');
                }
                removeVnodes(elm, oldCh, 0, oldCh.length - 1);
            }
            else if (isArray(ch)) {
                addVnodes(elm, ch, 0, ch.length - 1, insertedVnodeQueue);
            }
        }
        else if (oldVnode.text !== vnode.text) {
            if (isArray(oldCh)) {
                removeVnodes(elm, oldCh, 0, oldCh.length - 1);
            }
            nodeApi.setTextContent(elm, String(vnode.text));
        }
        // 执行 vnode prePatch hook
        if (isDef(hook) && isDef(i = hook.postPatch)) {
            i(oldVnode, vnode);
        }
    }
    return function patch(oldVnode, vnode) {
        const insertedVnodeQueue = [];
        // 执行 module pre hooks
        for (const preHook of cbs.pre) {
            preHook();
        }
        if (isUndef(oldVnode)) {
            // 首次挂载
            createElm(vnode, insertedVnodeQueue);
        }
        else {
            if (isSameVnode(oldVnode, vnode)) {
                patchVnode(oldVnode, vnode, insertedVnodeQueue);
            }
            else {
                const oldElm = oldVnode.elm;
                const parentElm = nodeApi.parentNode(oldElm);
                createElm(vnode, insertedVnodeQueue);
                nodeApi.insertBefore(parentElm, vnode.elm, nodeApi.nextSibling(oldElm));
                nodeApi.removeChild(parentElm, oldElm);
            }
        }
        // 执行 vnode inserted hook
        invokeInsertedHooks(insertedVnodeQueue);
        // 执行 module post hooks
        for (const postHook of cbs.post) {
            postHook();
        }
        return vnode;
    };
}
