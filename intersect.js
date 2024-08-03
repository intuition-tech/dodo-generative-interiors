// Function to convert array format
function convertToClipperFormat(poly) {
  return poly.map(point => ({X: point[0], Y: point[1]}))
}

// Function to intersect paths using Clipper.js
export function intersect(poly1, poly2) {
  let clipper = new ClipperLib.Clipper()
  let solution = new ClipperLib.Paths()

  // Convert poly1 and poly2 to the required format
  const formattedPoly1 = [convertToClipperFormat(poly1)]
  const formattedPoly2 = [convertToClipperFormat(poly2)]

  clipper.AddPaths(formattedPoly1, ClipperLib.PolyType.ptSubject, true)
  clipper.AddPaths(formattedPoly2, ClipperLib.PolyType.ptClip, true)

  clipper.Execute(
    ClipperLib.ClipType.ctIntersection,
    solution,
    ClipperLib.PolyFillType.pftNonZero,
    ClipperLib.PolyFillType.pftNonZero,
  )

  solution = solution.map(poly => poly.map(point => [point.X, point.Y]))
  return solution
}
