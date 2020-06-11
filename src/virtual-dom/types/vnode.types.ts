
export interface IPlainObject {
	[key: string]: any
}

export interface IVNode {
	tag?: string
	data?: IVNodeData
	children?: IVNode[]
	text?: string
	elm?: Element | Text
}

export interface IVNodeData {
	key?: string | number
	class?: string
	style?: IPlainObject
	props?: IPlainObject
	attrs?: IPlainObject
}
