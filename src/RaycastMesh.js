import { Mesh, Vector3, Ray } from "three"

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
    points.set(x,y,z,"surface")
  }
}

*/
class RaycastMesh extends Mesh {
  constructor(geometry, material) {
    super(geometry, material);

    this.ray = new Ray(new Vector3(0, 0, 0), new Vector3(1, 1, 1).normalize());
    this.faceChunks = []
  }
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