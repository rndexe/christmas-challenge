import { Suspense, useEffect, useState, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import { Environment, Sky } from '@react-three/drei';
import {
    MeshBasicMaterial,
    Mesh,
    SphereGeometry,
    MeshStandardMaterial,
    ConeGeometry
} from 'three';

export default function App() {
    const [gameState, setgameState] = useState(0);

    function changeState(newState) {
        setgameState(newState);
    }

    return (
        <>
            <Canvas shadows camera={{ position: [0, 3, 7] }}>
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <directionalLight
                        castShadow
                        position={[10, 10, 3]}
                        intensity={1}
                    />
                    <SetCamera />
                    <SnowmanBuilderGame
                        changeState={changeState}
                        gameState={gameState}
                    />
                    <Sky />
                    <Environment preset="forest" environmentIntensity={0.5} />
                </Suspense>
            </Canvas>
            <div
                style={{
                    fontFamily: 'Bangers',
                    position: 'absolute',
                    bottom: '2%',
                    width: '100%',
                    textAlign: 'center',
                    color: 'blue',
                }}
            >
                <h1
                    style={{
                        fontSize: '3rem',
                        fontWeight: '400',
                        marginBlock: '1rem',
                    }}
                >
                    {gameState == 0
                        ? 'Click to drop snowballs'
                        : gameState == 1
                        ? 'Click to add eyes/buttons'
                        : gameState == 2
                        ? 'Add nose'
                        : 'Merry Christmas'}
                </h1>
                {gameState == 1 && (
                    <button
                        onClick={() => {
                            changeState(2);
                        }}
                        style={{
                            fontFamily: 'Bangers',
                            fontSize: '2rem',
                            padding: '0.75rem 1.75rem',
                            border: '4px solid #121212',
                            color: '#121212',
                        }}
                    >
                        Done
                    </button>
                )}
            </div>
        </>
    );
}

function SetCamera() {
    const camera = useThree((state) => state.camera);

    useEffect(() => {
        camera.position.set(0, 3, 8);

        camera.lookAt(0, 2, 0);
        camera.fov = 40;
        camera.updateProjectionMatrix();
    }, [camera]);
    return null;
}

function SnowmanBuilderGame({ changeState, gameState }) {
    const [balls, setBalls] = useState([]);
    const [count, setCount] = useState(0);

    // const size = useMemo(() => 1 * Math.pow(0.75, count), [count]);

    function handleClick(e) {
        if (count == 2) {
            changeState(1);
        }
        if (count >= 3) return;
        const size = 1 * Math.pow(0.75, count);
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
                            id={snowball.id}
                            position={snowball.pos}
                            size={snowball.size}
                            gameState={gameState}
                            changeState={changeState}
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

function Snowball({ id, position, size, gameState, changeState }) {
    const ref = useRef();

    function putThings(event) {
        if (gameState == 1) putEyes(event);
        else if (gameState == 2) putNose(event);
    }

    function putEyes(event) {
        const point = event.intersections[0].point.clone();
        const eye = new Mesh(
            new SphereGeometry(0.05, 32, 32),
            new MeshBasicMaterial({ color: 'black' })
        );
        eye.position.copy(point);
        ref.current.attach(eye);
    }

    function putNose(event) {
        const point = event.intersections[0].point.clone();
        const nose = new Mesh(
            new ConeGeometry(0.1, 1, 8),
            new MeshStandardMaterial({ color: 'orange' })
        );

        nose.position.copy(point);
        nose.rotateX(Math.PI/2)
        ref.current.attach(nose);
        changeState(3)
    }

    return (
        <RigidBody position={position} colliders={false}>
            <CuboidCollider
                args={[size * 0.7, size * 0.7, size * 0.7]}
                friction={10}
                restitution={0}
            />
            <mesh castShadow ref={ref} onClick={putThings} name="snowball">
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
