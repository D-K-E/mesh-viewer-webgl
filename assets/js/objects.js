// objects in ndc coordinates
var cube_vertex_normal_texture = {
    "data": new Float32Array([
        // back face
        -1.0, -1.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // bottom-let
        1.0, 1.0, -1.0, 0.0, 0.0, -1.0, 1.0, 1.0, // top-right
        1.0, -1.0, -1.0, 0.0, 0.0, -1.0, 1.0, 0.0, // bottom-right         
        1.0, 1.0, -1.0, 0.0, 0.0, -1.0, 1.0, 1.0, // top-right
        -1.0, -1.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // bottom-let
        -1.0, 1.0, -1.0, 0.0, 0.0, -1.0, 0.0, 1.0, // top-let
        // front face
        -1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, // bottom-let
        1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, // bottom-right
        1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, // top-right
        1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, // top-right
        -1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, // top-let
        -1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, // bottom-let
        // left face
        -1.0, 1.0, 1.0, -1.0, 0.0, 0.0, 1.0, 0.0, // top-right
        -1.0, 1.0, -1.0, -1.0, 0.0, 0.0, 1.0, 1.0, // top-let
        -1.0, -1.0, -1.0, -1.0, 0.0, 0.0, 0.0, 1.0, // bottom-let
        -1.0, -1.0, -1.0, -1.0, 0.0, 0.0, 0.0, 1.0, // bottom-let
        -1.0, -1.0, 1.0, -1.0, 0.0, 0.0, 0.0, 0.0, // bottom-right
        -1.0, 1.0, 1.0, -1.0, 0.0, 0.0, 1.0, 0.0, // top-right
        // right face
        1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, // top-let
        1.0, -1.0, -1.0, 1.0, 0.0, 0.0, 0.0, 1.0, // bottom-right
        1.0, 1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 1.0, // top-right         
        1.0, -1.0, -1.0, 1.0, 0.0, 0.0, 0.0, 1.0, // bottom-right
        1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, // top-let
        1.0, -1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, // bottom-let     
        // bottom face
        -1.0, -1.0, -1.0, 0.0, -1.0, 0.0, 0.0, 1.0, // top-right
        1.0, -1.0, -1.0, 0.0, -1.0, 0.0, 1.0, 1.0, // top-let
        1.0, -1.0, 1.0, 0.0, -1.0, 0.0, 1.0, 0.0, // bottom-let
        1.0, -1.0, 1.0, 0.0, -1.0, 0.0, 1.0, 0.0, // bottom-let
        -1.0, -1.0, 1.0, 0.0, -1.0, 0.0, 0.0, 0.0, // bottom-right
        -1.0, -1.0, -1.0, 0.0, -1.0, 0.0, 0.0, 1.0, // top-right
        // top face
        -1.0, 1.0, -1.0, 0.0, 1.0, 0.0, 0.0, 1.0, // top-let
        1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, // bottom-right
        1.0, 1.0, -1.0, 0.0, 1.0, 0.0, 1.0, 1.0, // top-right     
        1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, // bottom-right
        -1.0, 1.0, -1.0, 0.0, 1.0, 0.0, 0.0, 1.0, // top-let
        -1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0 // bottom-let    
    ]),
    "nb_triangles": 0,
    "vertices": [],
    "indices": []
};
cube_vertex_normal_texture["vertices"] =
    Vertex.from_arrays(cube_vertex_normal_texture["data"]);

cube_vertex_normal_texture["nb_triangles"] =
    cube_vertex_normal_texture["vertices"].length / 3;
for (var index = 0; index < cube_vertex_normal_texture["nb_triangles"]; index++) {
    cube_vertex_normal_texture["indices"].push(index);
}

//
var cube_vertex_texture_normal = {
    "data": new Float32Array([
        // back face
        -1.0, -1.0, -1.0, 0.0, 0.0, 0.0, 0.0, -1.0, // bottom-let
        1.0, 1.0, -1.0, 1.0, 1.0, 0.0, 0.0, -1.0, // top-right
        1.0, -1.0, -1.0, 1.0, 0.0, 0.0, 0.0, -1.0, // bottom-right         
        1.0, 1.0, -1.0, 1.0, 1.0, 0.0, 0.0, -1.0, // top-right
        -1.0, -1.0, -1.0, 0.0, 0.0, 0.0, 0.0, -1.0, // bottom-let
        -1.0, 1.0, -1.0, 0.0, 1.0, 0.0, 0.0, -1.0, // top-let
        // front face
        -1.0, -1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, // bottom-let
        1.0, -1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, // bottom-right
        1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, // top-right
        1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, // top-right
        -1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, // top-let
        -1.0, -1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, // bottom-let
        // left face
        -1.0, 1.0, 1.0, 1.0, 0.0, -1.0, 0.0, 0.0, // top-right
        -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 0.0, 0.0, // top-let
        -1.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 0.0, // bottom-let
        -1.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 0.0, // bottom-let
        -1.0, -1.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // bottom-right
        -1.0, 1.0, 1.0, 1.0, 0.0, -1.0, 0.0, 0.0, // top-right
        // right face
        1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, // top-let
        1.0, -1.0, -1.0, 0.0, 1.0, 1.0, 0.0, 0.0, // bottom-right
        1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 0.0, 0.0, // top-right         
        1.0, -1.0, -1.0, 0.0, 1.0, 1.0, 0.0, 0.0, // bottom-right
        1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, // top-let
        1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, // bottom-let     
        // bottom face
        -1.0, -1.0, -1.0, 0.0, 1.0, 0.0, -1.0, 0.0, // top-right
        1.0, -1.0, -1.0, 1.0, 1.0, 0.0, -1.0, 0.0, // top-let
        1.0, -1.0, 1.0, 1.0, 0.0, 0.0, -1.0, 0.0, // bottom-let
        1.0, -1.0, 1.0, 1.0, 0.0, 0.0, -1.0, 0.0, // bottom-let
        -1.0, -1.0, 1.0, 0.0, 0.0, 0.0, -1.0, 0.0, // bottom-right
        -1.0, -1.0, -1.0, 0.0, 1.0, 0.0, -1.0, 0.0, // top-right
        // top face
        -1.0, 1.0, -1.0, 0.0, 1.0, 0.0, 1.0, 0.0, // top-let
        1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, // bottom-right
        1.0, 1.0, -1.0, 1.0, 1.0, 0.0, 1.0, 0.0, // top-right     
        1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, // bottom-right
        -1.0, 1.0, -1.0, 0.0, 1.0, 0.0, 1.0, 0.0, // top-let
        -1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0 // bottom-let    
    ]),
    "nb_triangles": 0,
    "vertices": [],
    "indices": []
};
cube_vertex_texture_normal["vertices"] =
    Vertex.from_arrays(cube_vertex_texture_normal["data"]);

cube_vertex_texture_normal["nb_triangles"] =
    cube_vertex_texture_normal["vertices"].length / 3;
for (var index = 0; index < cube_vertex_texture_normal["nb_triangles"]; index++) {
    cube_vertex_texture_normal["indices"].push(index);
}
