// Simple webGL-program point
// add dynamic values from js to attribute variable

// верхний шейдер
const VSHADER_SOURCE = 'attribute vec4 a_Position;\n' +
  'attribute float a_PointSize; \n' +
  'void main() {\n' + 
      'gl_Position = a_Position;\n' +
      'gl_PointSize = a_PointSize;\n' + 
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
  const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize')
  if (a_Position < 0 && a_PointSize < 0) {
    console.log('failed to get the storage location of a_Position')
    return
  }

  // сохраняем координаты в переменной-атрибуте
  gl.vertexAttrib3f(a_Position, -0.5, -0.5, 0.0)
  gl.vertexAttrib1f(a_PointSize, 50.0)

  // указываем цвет для очистки <canvas>
  gl.clearColor(0.0, 0.0,  0.0, 1.0)

  // очищяем <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT)

  // рисуем точку
  gl.drawArrays(gl.POINTS, 0, 1)
}
