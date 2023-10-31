// верхний шейдер
const VSHADER_SOURCE = 
  'attribute vec4 a_Position; \n' +
  'uniform mat4 u_ModelMatrix; \n' +
  'void main() {\n' + 
      'gl_Position = u_ModelMatrix * a_Position;\n' +
  '}'

// фрагментный шейдер
const FSHADER_SOURCE = 'precision mediump float; \n' + 
  'uniform vec4 u_FragColor; \n' + 
  'void main() {\n' + 
      ' gl_FragColor = u_FragColor; }'  

// угол поворота
const ANGLE_STEP = 45.0

let gl
function main() {
  const canvas = document.getElementById('webgl')
  if (!getWebGLContext(canvas)) {
    console.log('failed to get the render context webGL')
    return
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('failed init shaders')
    return
  }

  // определяем координаты вершин
  const n = initVertextBuffers(gl)
  if (n < 0) {
    console.log('failed to set the position of the verticles')
    return
  }

  // указываем цвет для очистки <canvas>
  gl.clearColor(0.0, 0.0,  0.0, 1.0)

  const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix')
  if (!u_ModelMatrix) {
    console.log('failed get uniform u_xformMatrix')
    return
  }

  // текущий угол поворота
  let currentAngle = 0.0

  const modelMatrix = new Matrix4()

  const tick = () => {
    // меняем угол поворота
    currentAngle = animate(currentAngle)
    draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix)

    // браузер вызывает tick fn
    requestAnimationFrame(tick)
  }
  tick()
};

function initVertextBuffers(gl) {
  const vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5])
  const n = 3 // число вершин
  const vertextBuffer = gl.createBuffer()
  if (!vertextBuffer) {
    console.log('failed to create the buffer object')
    return -1
  }

  // определяем тип буферного объекта
  gl.bindBuffer(gl.ARRAY_BUFFER, vertextBuffer)

  // записываем данные в буферный объект
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  const a_Position = gl.getAttribLocation(gl.program, 'a_Position')

  // получаем ссылку на uniform переменную u_FragColor
  const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor')

  // передаём цвет точки в переменную u_FragColor
  gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0)

  // сохраняем ссылку на буферный объект в переменной a_Position
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
  
  // разрешаем присваивание переменной a_Position
  gl.enableVertexAttribArray(a_Position)
  return n
};

function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
  // определяем матрицу вращения
  modelMatrix.setRotate(currentAngle, 0, 0, 1)

  // передаем матрицу в вершинный шейдер
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)

  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.drawArrays(gl.TRIANGLES, 0, n)
}

let g_last = Date.now()
function animate(angle) {
  let now = Date.now()
  let elapsed = now - g_last
  g_last = now
  let newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0
  return newAngle %= 360
}
