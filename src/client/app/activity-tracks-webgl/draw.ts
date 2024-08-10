import vertexShaderSource from './shaders/vertex.glsl';
import fragmentShaderSource from './shaders/fragment.glsl';

type DataItem = {
  value: number;
  count: number;
  totalCount: number;
};

const draw = ({
  canvas,
  data
}: {
  canvas: HTMLCanvasElement;
  data: DataItem[][];
}) => {
  let { vertices, values } = transformDataToRectangleVertices({
    canvasWidth: canvas.width,
    data
  });

  const gl = canvas.getContext("webgl2");
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  const program = createProgram(gl, vertexShader, fragmentShader);

  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const intensityAttributeLocation = gl.getAttribLocation(program, "a_intensity");


  const positionBuffer = initPositionBuffer({
    gl,
    values: vertices
  });

  const intensityBuffer = initIntensityBuffer({
    gl,
    values
  });

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

  gl.useProgram(program);
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  setPositionAttribute({
    gl,
    buffer: positionBuffer,
    vertexLocation: positionAttributeLocation
  });

  setIntensityAttribute({
    gl,
    buffer: intensityBuffer,
    intensityLocation: intensityAttributeLocation
  });

  const primitiveType = gl.TRIANGLES;
  const count = vertices.length/2;

  gl.drawArrays(primitiveType, 0, count);
};



const createShader = (gl: WebGL2RenderingContext, type: GLenum, source: string): WebGLShader => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (success) {
    return shader;
  } else {
    gl.deleteShader(shader);
  }
};

const createProgram = (gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) => {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);

  if (success) {
    return program;
  } else {
    gl.deleteProgram(program);
  }
};

const setPositionAttribute = ({
  gl,
  buffer,
  vertexLocation
}: {
  gl: WebGL2RenderingContext;
  buffer: WebGLBuffer;
  vertexLocation: number;
}) => {
  const size = 2;          // 2 components per iteration
  const type = gl.FLOAT;   // the data is 32bit floats
  const normalize = false; // don't normalize the data
  const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  const offset = 0;        // start at the beginning of the buffer

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(
    vertexLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(vertexLocation);
};

const setIntensityAttribute = ({
  gl,
  buffer,
  intensityLocation
}: {
  gl: WebGL2RenderingContext;
  buffer: WebGLBuffer;
  intensityLocation: number;
}) => {
  const size = 1;          // 1 component per iteration
  const type = gl.FLOAT;   // the data is 32bit floats
  const normalize = false; // don't normalize the data
  const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  const offset = 0;        // start at the beginning of the buffer

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(
    intensityLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(intensityLocation);
};

const initPositionBuffer = ({gl, values}: {
  gl: WebGL2RenderingContext;
  values: number[];
}) => {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), gl.STATIC_DRAW);

  return positionBuffer;
};

const initIntensityBuffer = ({gl, values}: {
  gl: WebGL2RenderingContext;
  values: number[];
}) => {
  const intensityBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, intensityBuffer);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), gl.STATIC_DRAW);

  return intensityBuffer;
};


const transformDataToRectangleVertices = ({ canvasWidth, data }: { canvasWidth: number, data: DataItem[][] }) => {
  const allVertices = [];
  const values = [];


  // const totalItemCount = data.reduce((acc, item) => acc + item.count, 0);
  // console.log(Math.max(...data.map(item => item.value)));

  const rowsCount = data.length;
  
  for (let i = 0; i < rowsCount; i++) {
    const rectangleHeight = 10;
    const spaceBetweenRows = 20;
    const y1 = i * spaceBetweenRows + 100;
    const y2 = y1 + rectangleHeight;
    
    let currentRectX = 0;

    for (const item of data[i]) {
      const rectWidthFractionOfData = item.count / item.totalCount;
      const rectWidthFractionOfCanvas = rectWidthFractionOfData * canvasWidth;
      const rectWidth = rectWidthFractionOfCanvas;
  
      // const rectWidth = Math.max(1, Math.round((item.count / item.totalCount) * canvasWidth));
      let x = currentRectX;
      currentRectX += rectWidth; // for the next rectangle
  
      const vertices = getRectangleVertices({
        x1: x,
        x2: x + rectWidth,
        y1,
        y2
      });
 
      allVertices.push(...vertices);
      values.push(...Array(6).fill(item.value)); // there are 6 vertices per rectangle
    }

  }



  return {
    vertices: allVertices,
    values
  };
};


const getRectangleVertices = (params: { x1: number, x2: number, y1: number, y2: number }) => {
  const { x1, x2, y1, y2 } = params;

  return [
    x1, y1,
    x2, y1,
    x1, y2,
    x1, y2,
    x2, y1,
    x2, y2
  ];
};



export default draw;
