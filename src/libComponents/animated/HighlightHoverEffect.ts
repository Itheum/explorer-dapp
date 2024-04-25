export class Highlighter {
  container: Element;
  boxes: unknown[];
  mouse: { x: number; y: number };
  containerSize: { w: number; h: number };
  constructor(containerElement: Element) {
    this.container = containerElement;
    this.boxes = Array.from(this.container.children);
    this.mouse = {
      x: 0,
      y: 0,
    };
    this.containerSize = {
      w: 0,
      h: 0,
    };
    this.initContainer = this.initContainer.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.init();
  }

  initContainer() {
    const containerElement = this.container as HTMLElement;
    this.containerSize.w = containerElement.offsetWidth;
    this.containerSize.h = containerElement.offsetHeight;
  }

  onMouseMove(event: { clientX: any; clientY: any }) {
    const { clientX, clientY } = event;
    const rect = this.container.getBoundingClientRect();
    const { w, h } = this.containerSize;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const inside = x < w && x > 0 && y < h && y > 0;
    if (inside) {
      this.mouse.x = x;
      this.mouse.y = y;
      this.boxes.forEach((box: unknown) => {
        if (typeof box === "object" && box !== null) {
          const typedBox = box as {
            getBoundingClientRect: () => { (): any; new (): any; left: number; top: number };
            style: { setProperty: (arg0: string, arg1: string) => void };
          };
          const boxX = -(typedBox.getBoundingClientRect().left - rect.left) + this.mouse.x;
          const boxY = -(typedBox.getBoundingClientRect().top - rect.top) + this.mouse.y;
          typedBox.style.setProperty("--mouse-x", `${boxX}px`);
          typedBox.style.setProperty("--mouse-y", `${boxY}px`);
        }
      });
    }
  }

  init() {
    this.initContainer();
    window.addEventListener("resize", this.initContainer);
    window.addEventListener("mousemove", this.onMouseMove);
  }
}

// Init Highlighter
const highlighters = document.querySelectorAll("[data-highlighter]");
highlighters.forEach((highlighter) => {
  new Highlighter(highlighter);
});
