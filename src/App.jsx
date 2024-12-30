import { Suspense, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
    Physics,
    RigidBody,
    BallCollider,
    CuboidCollider,
} from '@react-three/rapier';
import { Environment, Float, Sky } from '@react-three/drei';

export default function App() {
    return (
        <Canvas shadows camera={{ position: [0, 5, 10] }}>
            <ambientLight intensity={0.5} />
            <directionalLight castShadow position={[10, 10, 3]} intensity={1} />
            <SetCamera />
            <SnowmanBuilderGame />
            {/* <OrbitControls /> */}
            <Sky />
            <Environment preset='forest' environmentIntensity={0.5}/>
        </Canvas>
    );
}

function SetCamera() {
    const camera = useThree((state) => state.camera);

    useEffect(() => {
        camera.position.set(0, 5, 10);

        camera.lookAt(0, 2, 0);
        camera.fov = 50;
        camera.updateProjectionMatrix();
    }, [camera]);
    return null;
}

function SnowmanBuilderGame() {
    const [balls, setBalls] = useState([]);
    const [count, setCount] = useState(0);

    const size = useMemo(() => 1 * Math.pow(0.75, count), [count]);

    function handleClick(e) {
        if (count >= 3) return;

        const size = 1 * Math.pow(0.75, count);
        console.log(e.intersections[0].point, size);
        setCount((c) => c + 1);
        addBall(e.intersections[0].point, size);
    }

    function addBall(pos, size) {
        const newBall = {
            id: balls.length,
            pos: [pos.x, pos.y, 0],
            size: size,
        };
        setBalls([...balls, newBall]);
    }

    return (
        <>
            <TouchPlane onClick={handleClick} />

            <Suspense>
                <Physics gravity={[0, -9.81, 0]}>
                    <Ground />

                    {balls.map((snowball) => (
                        <Snowball
                            key={snowball.id}
                            position={snowball.pos}
                            size={snowball.size}
                        ></Snowball>
                    ))}
                </Physics>
            </Suspense>
        </>
    );
}

function TouchPlane(props) {
    return (
        <mesh name="touchplane" {...props}>
            <planeGeometry args={[100, 100]} />
            <meshBasicMaterial
                color={'red'}
                transparent
                opacity={0.5}
                visible={false}
            />
        </mesh>
    );
}
function Snowball({ position, size }) {
    return (
        <RigidBody position={position} colliders={false}>
            <CuboidCollider
                args={[size * 0.7, size * 0.7, size * 0.7]}
                friction={10}
                restitution={0}
            />
            <mesh castShadow>
                <sphereGeometry args={[size, 32, 32]} />
                <meshStandardMaterial color="white" />
            </mesh>
        </RigidBody>
    );
}

function Ground({ groundRef }) {
    return (
        <RigidBody type="fixed" ref={groundRef} userData={{ isGround: true }}>
            <mesh receiveShadow>
                <boxGeometry args={[100, 1, 100]} />
                <meshStandardMaterial color="white" />
            </mesh>
        </RigidBody>
    );
}
