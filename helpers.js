export let F = (n, f) => [...Array(n | 0)].map((_, i) => f(i))
export let rot = (x, y, angle) => {
  let c = Math.cos(angle),
    s = Math.sin(angle)
  return [x * c - y * s, x * s + y * c]
}
export let vmul = (a, s) => a.map(d => d * s)
export let sscale = (s, m) => s.map(c => c.map(p => p.map(x => x * m)))
export let strans = (s, v) => s.map(c => c.map(p => p.map((x, i) => x + v[i])))
export let srot = (s, a) => s.map(c => c.map(p => rot(...p, a)))
export let vdot = (a, b) => a[0] * b[0] + a[1] * b[1]
export let PI = Math.PI
export let vadd = (a, b) => a.map((d, i) => d + b[i])
export let vsub = (a, b) => a.map((d, i) => d - b[i])
export let round = x => Math.round(x * 100) / 100

export let vnorm = a => {
  let l = Math.sqrt(vdot(a, a))
  return a.map(d => d / l)
}

export let mod = (x, l) => {
  return ((x % l) + l) % l
}

export function smoothstep(min, max, x) {
  let flip = false
  if (min > max) {
    ;[min, max] = [max, min]
    flip = true
  }
  if (x <= min) return 0
  if (x >= max) return 1
  let t = (x - min) / (max - min)
  let s = t * t * (3 - 2 * t)
  if (flip) s = 1 - s
  return s
}

function generateFileName(seedString) {
  const now = new Date()

  const day = String(now.getDate()).padStart(2, '0')
  const month = String(now.getMonth() + 1).padStart(2, '0') // Месяцы начинаются с 0
  const year = now.getFullYear()

  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')

  const fileName = `${seedString}_${day}_${month}_${year}_${hours}_${minutes}`
  return fileName
}

export function saveSVG(PARAMS) {
  const zip = new JSZip()

  const wallSvg = document.querySelector('#wallpaper svg').outerHTML
  const panelSvg = document.querySelector('#panel svg').outerHTML

  zip.file('wallpaper.svg', wallSvg)
  zip.file('panel.svg', panelSvg)

  zip.generateAsync({type: 'blob'}).then(function (content) {
    saveAs(content, generateFileName(PARAMS.seedString) + '.zip')
  })
}

export function splitmix32(a) {
  let counter = 0
  return function () {
    counter += 1
    a |= 0
    a = (a + 0x9e3779b9) | 0
    var t = a ^ (a >>> 16)
    t = Math.imul(t, 0x21f0aaad)
    t = t ^ (t >>> 15)
    t = Math.imul(t, 0x735a2d97)
    return ((t = t ^ (t >>> 15)) >>> 0) / 4294967296
  }
}

export let R = splitmix32(0)
export let setSeed = (seed = 0) => {
  R = splitmix32(seed)
}

export function stringHash(str) {
  return str
    .split('')
    .reduce(
      (prevHash, currVal) =>
        ((prevHash << 5) - prevHash + currVal.charCodeAt(0)) | 0,
      0,
    )
}

export function parseColors(colors) {
  const regex = /#([a-fA-F0-9]{3,4}|[a-fA-F0-9]{6,8})\b/g
  return colors.match(regex) || []
}

export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(R() * (i + 1))
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}

export function map(x, in_min, in_max, out_min, out_max) {
  return ((x - in_min) / (in_max - in_min)) * (out_max - out_min) + out_min
}
