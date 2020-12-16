/**
 *
 * @class BinaryHeap 二叉堆
 */
class BinaryHeap {
  constructor(compare) {
    this.data = [];
    this.compare = compare;
  }
  insert(value) {
    this.insertAt(this.data.length, value);
  }
  insertAt(index, value) {
    this.data[index] = value;
    // 对比当前节点与其父节点，如果当前节点更小就交换它们
    while (index > 0 && this.compare(value, this.data[Math.floor((index - 1) / 2)]) < 0) {
      this.data[index] = this.data[Math.floor((index - 1) / 2)];
      this.data[Math.floor((index - 1) / 2)] = value;
      index = Math.floor((index - 1) / 2);
    }
  }
  delete(index) {
    if (this.data.length === 0) return;

    let value = this.data[index];
    let i = index;
    // fix heap
    while (i < this.data.length) {
      let left = i * 2 + 1;
      let right = i * 2 + 2;
      // 没有左子节点
      if (left >= this.data.length) break;
      // 没有右子节点
      if (right >= this.data.length) {
        this.data[i] = this.data[left];
        i = left;
        break;
      }
      // 比较左右子节点的大小，更小的补到父节点
      if (this.compare(this.data[left], this.data[right]) < 0) {
        this.data[i] = this.data[left];
        i = left;
      } else {
        this.data[i] = this.data[right];
        i = right;
      }
    }
    // 查看最后的空位是不是最后的叶子节点
    if (i < this.data.length - 1) {
      this.insertAt(i, this.data.pop());
    } else {
      this.data.pop();
    }
    return value;
  }

  printHeap() {
    console.log("nHeap = ");
    console.log(this.data);
  }
}

let maxHeap = new BinaryHeap((a, b) => b - a);
maxHeap.insert(10);
maxHeap.insert(4);
maxHeap.insert(9);
maxHeap.insert(1);
maxHeap.insert(7);
maxHeap.insert(5);
maxHeap.insert(3);

maxHeap.printHeap();
maxHeap.delete(5);
maxHeap.printHeap();
maxHeap.delete(2);
maxHeap.printHeap();