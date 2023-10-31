// верхний шейдер
const VSHADER_SOURCE = 'attribute vec4 a_Position;\n' +
  'uniform mat4 u_xformMatrix; \n' +
  'void main() {\n' + 
      'gl_Position = u_xformMatrix * a_Position;\n' +
  '}'

// фрагментный шейдер
const FSHADER_SOURCE = 'precision mediump float; \n' + 
  'uniform vec4 u_FragColor; \n' + 
  'void main() {\n' + 
      ' gl_FragColor = u_FragColor; }'  

// угол поворота
const ANGLE = -90.0

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

  // передаем в вершинный шейдер данные, необходимые для поворота фигуры
  // const radian = Math.PI * ANGLE / 180.0
  // const cosB = Math.cos(radian)
  // const sinB = Math.sin(radian)
  const Tx = 0.5, Ty = 0.5, Tz = 0.0

  const xformMatrix = new Float32Array([
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0,  0.0, 1.0, 0.0,
    Tx, Ty,  Tz, 1.0
  ])
  // const xformMatrix = new Float32Array([
  //   cosB, sinB, 0.0, 0.0,
  //   -sinB, cosB, 0.0, 0.0,
  //   0.0,  0.0, 1.0, 0.0,
  //   0.0, 0.0,  0.0, 1.0
  // ])

  const u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix')
  if (!u_xformMatrix) {
    console.log('failed get uniform u_xformMatrix')
    return
  }
  gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix)

  // указываем цвет для очистки <canvas>
  gl.clearColor(0.0, 0.0,  0.0, 1.0)

  // очищяем <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT)

  // рисуем точки
  gl.drawArrays(gl.TRIANGLES, 0, n)
}

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
}
