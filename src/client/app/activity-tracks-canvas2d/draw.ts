type DataItem = {
  value: number;
  count: number;
  totalCount: number;
};

export const RECTANGLE_HEIGHT = 5 * devicePixelRatio;
export const ROW_HEIGHT = 10 * devicePixelRatio;

const drawOnCanvas2d = ({
  canvas,
  data
}: {
  canvas: HTMLCanvasElement;
  data: DataItem[][];
}) => {
  const canvasContext = canvas.getContext('2d');
  const canvasWidth = canvas.width;

  const rowsCount = data.length;

  for (let i = 0; i < rowsCount; i++) {
    const rectangleHeight = RECTANGLE_HEIGHT;
    const spaceBetweenRows = ROW_HEIGHT;
    const y = i * spaceBetweenRows;
    
    let currentRectX = 0;

    for (const item of data[i]) {
      const rectWidthFractionOfData = item.count / item.totalCount;
      const rectWidthFractionOfCanvas = rectWidthFractionOfData * canvasWidth;
      const rectWidth = rectWidthFractionOfCanvas;
  
      let x = currentRectX;
      currentRectX += rectWidth; // for the next rectangle

      const colorChannelValue = item.value === 0
        ? 255
        : 255 - item.value * 25.5;
      const colorString = `rgb(${colorChannelValue}, ${colorChannelValue}, ${colorChannelValue})`;

      canvasContext.fillStyle = colorString;
      
      canvasContext.fillRect(x, y, rectWidth, rectangleHeight);
    }

  }

};


export default drawOnCanvas2d;
