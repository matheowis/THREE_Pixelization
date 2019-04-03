import { Mesh, Vector3, Ray } from "three"
import Points from "./Points";

const closeRay = new Ray();

// mesh segmentation
// filter clamped triangles inside chunk, find intersections only inside those chunks 
// single face loop
/*
for(var i =0;i< faces.length;i++){
  const face = faces[i];
  const faceCenter = new Vector().add(verts[face.a]).add(verts[face.b]).add(verts[face.c]).div(3);
  const size = 4;
  const x = Math.floot(faceCenter.x / size) * size;
  const y = Math.floot(faceCenter.y / size) * size;
  const z = Math.floot(faceCenter.z / size) * size;
  if(!points.get(x,y,z)){
    points.set(x,y,z,[face])
  }
}
needs integrity check, what if face is bigger than size
if too big store face for later, check integrity within face based on its normal, if lacking add them
*/
// https://www.khronos.org/opengl/wiki/Calculating_a_Surface_Normal
// Begin Function CalculateSurfaceNormal (Input Triangle) Returns Vector

// 	Set Vector U to (Triangle.p2 minus Triangle.p1)
// 	Set Vector V to (Triangle.p3 minus Triangle.p1)

// 	Set Normal.x to (multiply U.y by V.z) minus (multiply U.z by V.y)
// 	Set Normal.y to (multiply U.z by V.x) minus (multiply U.x by V.z)
// 	Set Normal.z to (multiply U.x by V.y) minus (multiply U.y by V.x)

// 	Returning Normal

// End Function
class RaycastMesh extends Mesh {
  constructor(geometry, material) {
    super(geometry, material);

    this.ray = new Ray(new Vector3(0, 0, 0), new Vector3(1, 1, 1).normalize());
    this.faceChunks = [];
    this.shellPoints = new Points();
  }
  createShellSegments(size = 4) {
    const { faces, vertices } = this.geometry;
    for (var i = 0; i < faces.length; i++) {
      const face = faces[i];
      const faceCenter = new Vector3()
        .add(vertices[face.a])
        .add(vertices[face.b])
        .add(vertices[face.c])
        .divideScalar(3).toArray();
      const faceGridCenter = faceCenter.map(val => Math.floor(val / size) * size);
      this.shellPoints.append(...faceGridCenter, [face]);
    }
  }
  // probably wont have to check that, just use small shell segments with after face correction
  isPointInsideMe(point = new Vector3(0, 0, 0)) {
    return closestPoint(point, new Vector3(1, 0, 0), this.geometry);
  }

  isPointInsideMe6(point = new Vector3(0, 0, 0)) {
    return {
      xp: closestPoint(point, new Vector3(1, 0, 0), this.geometry),
      xn: closestPoint(point, new Vector3(-1, 0, 0), this.geometry),
      yp: closestPoint(point, new Vector3(0, 1, 0), this.geometry),
      yn: closestPoint(point, new Vector3(0, -1, 0), this.geometry),
      zp: closestPoint(point, new Vector3(0, 0, 1), this.geometry),
      zn: closestPoint(point, new Vector3(0, 0, -1), this.geometry),
    }
  }

  faceSegmentation(segments = 3) {
    const boxSize = this.geometry.boundingBox.max.clone().sub(this.geometry.boundingBox.min).toArray();
    const shortest = Math.min(...boxSize);
    const proportions = boxSize.map(size => Math.ceil(size / (shortest / segments)));
    console.log(proportions);
    //shortest / segments is the base square chunk, or try something that with minimum overlaping size
  }
}

function closestPoint(point, direction, geometry) {
  const { faces, vertices } = geometry;
  closeRay.origin.copy(point);
  closeRay.direction.copy(direction);
  const intersects = [];
  for (var i = 0; i < faces.length; i++) {
    const target = new Vector3();
    const intersectionPoint = closeRay.intersectTriangle(vertices[faces[i].a], vertices[faces[i].b], vertices[faces[i].c], false, target);
    if (intersectionPoint) {
      intersects.push({ length: target.length(), dot: closeRay.direction.dot(faces[i].normal) });
    }
  }
  var min = { length: Infinity, dot: -1 };
  for (var i = 0; i < intersects.length; i++) {
    if (intersects[i].length < min.length) {
      Object.assign(min, intersects[i]);
    }
  }
  if (min.dot > 0) {
    return min.length
  }
  return false
}

export { RaycastMesh };