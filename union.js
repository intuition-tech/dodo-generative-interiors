const SCALE_FACTOR = 100000

function convertToClipperFormat(poly) {
  return poly.map(point => ({
    X: Math.round(point[0] * SCALE_FACTOR),
    Y: Math.round(point[1] * SCALE_FACTOR),
  }))
}

function convertFromClipperFormat(poly) {
  return poly.map(point => [point.X / SCALE_FACTOR, point.Y / SCALE_FACTOR])
}

export function union(polys) {
  if (!polys.length) return []
  if (polys.length === 1) return polys

  let clipper = new ClipperLib.Clipper()
  let solution = new ClipperLib.Paths()

  // Convert all polygons to Clipper format
  let clipperPolys = polys.map(convertToClipperFormat)

  // Perform union on all polygons at once
  clipper.AddPaths(clipperPolys, ClipperLib.PolyType.ptSubject, true)
  clipper.Execute(
    ClipperLib.ClipType.ctUnion,
    solution,
    ClipperLib.PolyFillType.pftNonZero,
    ClipperLib.PolyFillType.pftNonZero,
  )

  // Convert the result back to original format
  return solution.map(convertFromClipperFormat)
}
