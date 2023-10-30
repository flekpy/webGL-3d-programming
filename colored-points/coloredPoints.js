// Simple webGL-program point
// add dynamic values from js
// set point on click 
// and change color

// верхний шейдер
const VSHADER_SOURCE = 'attribute vec4 a_Position;\n' +
  'void main() {\n' + 
      'gl_Position = a_Position;\n' +
      'gl_PointSize = 10.0;\n' + 
  '}'

// фрагментный шейдер
const FSHADER_SOURCE = 'precision mediump float; \n' + 
  'uniform vec4 u_FragColor; \n' + 
  'void main() {\n' + 
      ' gl_FragColor = u_FragColor; }'  

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

  // получаем ссылку на uniform переменную u_FragColor
  const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor')
  if (a_Position < 0 && u_FragColor !== null) {
    console.log('failed to get the storage location of a_Position')
    return
  }

  // регистрируем функцию обработчик для вызова по щелчку
  canvas.onmousedown = (event) => click(event, gl, canvas, a_Position, u_FragColor)

  // указываем цвет для очистки <canvas>
  gl.clearColor(0.0, 0.0,  0.0, 1.0)

  // очищяем <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT)
}

const g_points = []
const g_colors = []
function click(event, gl, canvas, a_Position, u_FragColor) {
  let x = event.clientX
  let y = event.clientY
  let rect = event.target.getBoundingClientRect()

  x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2)
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2)

  // сохраняем координаты в массиве g_points
  g_points.push([x, y])

  // сохраняем цвет в массиве g_colors
  if (x >= 0.0 && y >= 0.0) {
    g_colors.push([1.0, 0.0, 0.0, 1.0]) // red color
  } else if (x < 0.0 && y < 0.0) {
    g_colors.push([0.0, 1.0, 0.0, 1.0]) // green color
  } else {
    g_colors.push([0.0, 0.0, 1.0, 1.0]) // blue color
  }

  // очищяем <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT)

  let len = g_points.length
  for (let i = 0; i < len; i += 1) {
    const xy = g_points[i]
    const rgba = g_colors[i]

    // передаём координаты щелчка в переменную a_Position
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0)

    // передаём цвет точки в переменную u_FragColor
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3])

    // рисуем точку
    gl.drawArrays(gl.POINTS, 0, 1)
  }
}
