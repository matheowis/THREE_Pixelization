import { Raycaster } from "three";

const raycaster = new Raycaster()
const direction = new Vector3(1, 1, 1);

const geometryMath = {
  isInside
};

function isInside(point, mesh) {
  raycaster.set(point, direction);
  const intersects = raycaster.intersectObject(mesh);
  if (intersects.length && direction.dot(intersects[0].face.normal) > 0) {
    return true;
  } else {
    return false;
  }
}

export default geometryMath;