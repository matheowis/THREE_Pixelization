import { BufferGeometry, BufferAttribute, Mesh, WireframeGeometry, LineSegments } from 'three';

const CreateProceduralMesh = (size, faces) => {
  var geometry = new BufferGeometry();
  // var vertices = [
  //   -1, -1, 1,
  //   1, -1, 1,
  //   -1, 1, 1,
  //   1, 1, 1,
  // ];
  var faces = [
    0, 1, 2,
    3, 2, 1
  ];

  var vertices = [];
  for (var x = 0; x <= 2; x++) {
    for (var y = 0; y <= 2; y++) {
      vertices.push(
        x, y, 1
      );
    }
  }

  console.log(vertices)
  //vertices = [...vertices, ...vertices.map((v, i) => i % 3 === 0 ? v + 1 : v)]


  //vertices = vertices.map(v => v * size);

  var typedVertices = new Float32Array(vertices);
  var typedFaces = new Uint16Array(faces)

  geometry.attributes.position = new BufferAttribute(typedVertices, 3)
  geometry.setIndex(new BufferAttribute(typedFaces, 1));

  const mesh = new Mesh(geometry);

  var wireframe = new WireframeGeometry(geometry);
  var line = new LineSegments(wireframe);

  return line;
}

export { CreateProceduralMesh };