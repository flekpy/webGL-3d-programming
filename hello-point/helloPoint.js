// Simple webGL-program point

// верхний шейдер, установка позиции и размера
const VSHADER_SOURCE = 'void main() { gl_Position = vec4(0.0, 0.0, 0.0, 1.0); gl_PointSize = 10.0; }'

// фрагментный шейдер, установка цвета
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

  // указываем цвет для очистки <canvas>
  gl.clearColor(0.0, 0.0,  0.0, 1.0)

  // очищяем <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT)

  // рисуем точку
  gl.drawArrays(gl.POINTS, 0, 1)
}
