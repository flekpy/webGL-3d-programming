// Simple webGL-program point
// add dynamic values from js and set point on click 

// верхний шейдер
const VSHADER_SOURCE = 'attribute vec4 a_Position;\n' +
  'void main() {\n' + 
      'gl_Position = a_Position;\n' +
      'gl_PointSize = 10.0;\n' + 
  '}'

// фрагментный шейдер
const FSHADER_SOURCE = 'void main() { gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); }'  

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

  // получаем ссылку на переменную-атрибут
  const a_Position = gl.getAttribLocation(gl.program, 'a_Position')
  if (a_Position < 0) {
    console.log('failed to get the storage location of a_Position')
    return
  }

  // регистрируем функцию обработчик для вызова по щелчку
  canvas.onmousedown = (event) => click(event, gl, canvas, a_Position)

  // указываем цвет для очистки <canvas>
  gl.clearColor(0.0, 0.0,  0.0, 1.0)

  // очищяем <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT)
}

const g_points = []
function click(event, gl, canvas, a_Position) {
  let x = event.clientX
  let y = event.clientY
  let rect = event.target.getBoundingClientRect()

  x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2)
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2)

  // сохраняем координаты в массиве g_points
  g_points.push(x)
  g_points.push(y)

  // очищяем <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT)

  let len = g_points.length
  for (let i = 0; i < len; i += 2) {
    console.log(g_points[i], g_points[i + 1])
    // передаём координаты щелчка в переменную a_Position
    gl.vertexAttrib3f(a_Position, g_points[i], g_points[i + 1], 0.0)

    // рисуем точку
    gl.drawArrays(gl.POINTS, 0, 1)
  }
}
