function createShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  const isSuccess = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (isSuccess) return shader

  console.log(gl.getShaderInfoLog(shader))
  gl.deleteShader(shader)
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  const isSuccess = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (isSuccess) return program

  console.log(gl.getProgramInfoLog(program))
  gl.deleteProgram(program)
}

function resize(canvas) {
  const displayWidth = canvas.clientWidth
  const displayHeight = canvas.clientHeight

  if (canvas.width != displayWidth || canvas.height != displayHeight) {
    canvas.width = displayWidth
    canvas.height = displayHeight
  }
}

function main() {
  const canvas = document.getElementById('webGL')
  const gl = canvas.getContext('webgl')
  if (!gl) {
    console.log('webGL not working')
    return
  }

  const vertexShaderSource = document.querySelector("#vertex-shader-2d").text
  const fragmentShaderSource = document.querySelector("#fragment-shader-2d").text

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

  const program = createProgram(gl, vertexShader, fragmentShader)

  const a_position = gl.getAttribLocation(program, 'a_position')
  const u_resolution = gl.getUniformLocation(program, 'u_resolution')
  const u_color = gl.getUniformLocation(program, 'u_color')

  gl.clearColor(0, 0, 0, 0)

  const translation = [111, 222]
  const color = [Math.random(), Math.random(), Math.random(), 1] 

  const translationLocation = gl.getUniformLocation(program, 'u_translation')
  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  setGeometry(gl)

  function drawScene() {
    resize(gl.canvas)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(program)
    gl.enableVertexAttribArray(a_position)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0)
    gl.uniform2f(u_resolution, gl.canvas.width, gl.canvas.height)
    gl.uniform2fv(translationLocation, translation)
    gl.uniform4fv(u_color, color)
    gl.drawArrays(gl.TRIANGLES, 0, 18)
  }
  drawScene()
}

function setGeometry(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      // вертикальный столб
      0, 0,
      30, 0,
      0, 150,
      0, 150,
      30, 0,
      30, 150,

      // верхняя перекладина
      30, 0,
      100, 0,
      30, 30,
      30, 30,
      100, 0,
      100, 30,

      // перекладина посередине
      30, 60,
      67, 60,
      30, 90,
      30, 90,
      67, 60,
      67, 90,
    ]),
    gl.STATIC_DRAW);
}
