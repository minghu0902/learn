/**
 * 
 * @class Deque 双端队列
 */
class Deque {
  constructor(k) {
    this._capacity = k + 1
    this._deque = []
    this._front = 0
    this._rear = 0
  }
  /**
   * 将一个元素添加到双端队列头部。 如果操作成功返回 true。
   */
  insertFront(value) {
    if (this.isFull()) return false
    this._front = (this._capacity + this._front - 1) % this._capacity
    this._deque[this._front] = value
    return true
  }
  /**
   * 将一个元素添加到双端队列尾部。如果操作成功返回 true。
   */
  insertLast(value) {
    if (this.isFull()) return false
    this._deque[this._rear] = value
    this._rear = (this._rear + 1) % this._capacity
    return true
  }
  /**
   * 从双端队列头部删除一个元素。 如果操作成功返回 true。
   */
  deleteFront() {
    if (this.isEmpty()) return false
    this._deque[this._front] = null
    this._front = (this._front + 1) % this._capacity
    return true
  }
  /**
   * 从双端队列尾部删除一个元素。如果操作成功返回 true。
   */
  deleteLast() {
    if (this.isEmpty()) return false
    this._rear = (this._capacity + this._rear - 1) % this._capacity
    this._deque[this._rear] = null
    return false
  }
  /**
   * 从双端队列头部获得一个元素。如果双端队列为空，返回 -1。
   */
  getFront() {
    if (this.isEmpty()) return -1
    return this._deque[this._front]
  }
  /**
   * 获得双端队列的最后一个元素。 如果双端队列为空，返回 -1。
   */
  getRear() {
    if (this.isEmpty()) return -1
    return this._deque[(this._capacity + this._rear - 1) % this._capacity]
  }
  /**
   * 检查双端队列是否为空。
   */
  isEmpty() {
    return this._front === this._rear
  }
  /**
   * 检查双端队列是否满了。
   */
  isFull() {
    return (this._rear + 1) % this._capacity === this._front
  }
}