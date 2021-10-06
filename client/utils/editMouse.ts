interface isTransition {
  [key: string]: any;
  value: boolean;
}
function windowAddMouseWheel(canvasBox: HTMLElement) {
  const win: any = window,
    de: any = document;
  let move: number;
  const scrollFunc = function (e: any) {
    const [nowX, nowY] = getDomTransfrom(canvasBox);
    e = e || window.event;
    const path = e.path;
    for(let i=0;i<path.length;i++){
      if((path[i].getAttribute && path[i].getAttribute('class') && path[i].getAttribute('class').indexOf('dynamic') >= 0) || (path[i].getAttribute && path[i].getAttribute('class') && path[i].getAttribute('class').indexOf('editor_pages_right')>=0)){
        return
      }
    }
    if (e.wheelDelta) {
      //判断浏览器IE，谷歌滑轮事件
      if (e.wheelDelta > 0) {
        //当滑轮向上滚动时
        console.log("滑轮向下滚动");
      }
      if (e.wheelDelta < 0) {
        //当滑轮向下滚动时
        console.log("滑轮向上滚动");
      }
      move = e.wheelDelta;
    } else if (e.detail) {
      //Firefox滑轮事件
      if (e.detail > 0) {
        //当滑轮向上滚动时
        console.log("滑轮向下滚动");
      }
      if (e.detail < 0) {
        //当滑轮向下滚动时
        console.log("滑轮向上滚动");
      }
      move = e.detail;
    }
    canvasBox.style.transform = `translate(${nowX}px, ${nowY + move}px)`;
  };
  document.addEventListener("DOMMouseScroll", scrollFunc, false);
  win.onmousewheel = de.onmousewheel = scrollFunc;
}
/**
 * 获取用户点击编辑器当前的transform值
 * @param {HTMLElement} dom 获取transfrom中的x,y值
 * @returns {Array<number>} 返回数组
 */
function getDomTransfrom(dom: HTMLElement): Array<number> {
  const translates = getComputedStyle(dom).transform;
  const translatesArr: string[] = translates.substring(7).split(",");
  let nowX = 0;
  let nowY = 0;
  if (translatesArr.length > 4) {
    nowX = parseFloat(translatesArr[4]);
    nowY = parseFloat(translatesArr[5].replace(/\)/g, ""));
  }
  return [nowX, nowY];
}
function getDomScale(dom: HTMLElement): number {
  const translates = getComputedStyle(dom).transform;
  const translatesArr: string[] = translates.substring(7).split(",");
  return parseFloat(translatesArr[0])
}
/**
 * 移动元素
 * @param {HTMLElement} canvasBox 用户移动的元素
 * @param {any} e 鼠标点击事件对象
 * @returns {isTransition} isTransition 是否需要补间动画
 */
export function useUserMove(canvasBox: HTMLElement, e: any, isTransition: isTransition): void {
  // 检查用户鼠标落到编辑器中
  e.preventDefault();
  e.stopPropagation();
  const [nowX, nowY] = getDomTransfrom(canvasBox);
  const scale = getDomScale(canvasBox) || 1;
  const startX = e.clientX;
  const startY = e.clientY;
  const move = (e: any) => {
    const moveX = e.clientX;
    const moveY = e.clientY;
    const x = moveX - startX + nowX;
    const y = moveY - startY + nowY;
    canvasBox.style.transform = `translate(${x}px, ${y}px) scale(${scale}, ${scale})`;
  };
  const up = () => {
    // 鼠标松开，则恢复补件动画
    isTransition.value = true;
    document.documentElement.removeEventListener("mousemove", move);
    document.documentElement.removeEventListener("mouseup", up);
  };
  document.documentElement.addEventListener("mousemove", move);
  document.documentElement.addEventListener("mouseup", up);
}
/**
 * 获取用户移动滚轮事件
 * @param {HTMLElement} dom 监听鼠标滚动
 */
export function handleWheelScroll(dom: HTMLElement): any {
  windowAddMouseWheel(dom);
}
