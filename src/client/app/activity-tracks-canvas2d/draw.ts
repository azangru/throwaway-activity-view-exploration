type DataItem = {
  value: number;
  count: number;
  totalCount: number;
};

const drawOnCanvas2d = ({
  canvas,
  data
}: {
  canvas: HTMLCanvasElement;
  data: DataItem[];
}) => {
  const canvasContext = canvas.getContext('2d');
  const canvasWidth = canvas.width;

  const rowsCount = 50;

  for (let i = 0; i < rowsCount; i++) {
    const rectangleHeight = 10;
    const spaceBetweenRows = 20;
    const y = i * spaceBetweenRows;
    
    let currentRectX = 0;

    for (const item of data) {
      const rectWidthFractionOfData = item.count / item.totalCount;
      const rectWidthFractionOfCanvas = rectWidthFractionOfData * canvasWidth;
      const rectWidth = rectWidthFractionOfCanvas;
  
      let x = currentRectX;
      currentRectX += rectWidth; // for the next rectangle

      const colorChannelValue = item.value === 0
        ? 255
        : Math.max(255 - Math.log(item.value) * 20, 0);
      const colorString = `rgb(${colorChannelValue}, ${colorChannelValue}, ${colorChannelValue})`;

      canvasContext.fillStyle = colorString;
      
      canvasContext.fillRect(x, y, rectWidth, rectangleHeight);
    }

  }

};


export default drawOnCanvas2d;
