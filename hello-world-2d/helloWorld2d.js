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

  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  // const positions = [
  //   10, 20,
  //   80, 20,
  //   10, 30,
  //   10, 30,
  //   80, 20,
  //   80, 30
  // ]
  // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  resize(gl.canvas)
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.useProgram(program)

  gl.uniform2f(u_resolution, gl.canvas.width, gl.canvas.height)

  gl.enableVertexAttribArray(a_position)

  // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0)

  for (let ii = 0; ii < 100; ++ii) {
    setRectangle(gl, randomInt(400), randomInt(500), randomInt(700), randomInt(400))

    gl.uniform4f(u_color, Math.random(), Math.random(), Math.random(), 1)

    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }
}

function randomInt(range) {
  return Math.floor(Math.random() * range)
}

function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2,
  ]), gl.STATIC_DRAW);
}
