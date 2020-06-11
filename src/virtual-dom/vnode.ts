import { IVNode, IVNodeData } from './types/vnode.types'

export class VNode implements IVNode {
	tag?: string
	data?: IVNodeData
	children?: IVNode[]
	text?: string
	elm?: Element | Text

	constructor(
		tag?: string,
		data?: IVNodeData,
		children?: IVNode[],
		text?: string
	) {
		this.tag = tag
		this.data = data
		this.children = children
		this.text = text
	}
}