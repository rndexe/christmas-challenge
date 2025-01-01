/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Author: Hard_wall (https://sketchfab.com/benraupp)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/fence-lowpoly-efc9ccd498d8492fb64dd9bd42429a00
Title: Fence Lowpoly
*/

import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';

export function Fence(props) {
    const { nodes, materials } = useGLTF('./fence_lowpoly/scene.gltf');
    return (
        <group {...props} dispose={null}>
            <group
                position={[-121.534, 65.74, -19.846]}
                rotation={[1.863, 1.544, 2.857]}
                scale={[-35.766, 24.475, 373.276]}
            >
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Cube002_Material007_0.geometry}
                    material={materials['Material.007']}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Cube002_Material006_0.geometry}
                    material={materials['Material.006']}
                />
            </group>
        </group>
    );
}

useGLTF.preload('./fence_lowpoly/scene.gltf');
