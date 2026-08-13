// three-bg.js
// Signature background: a field of abstract jersey-stripe bars drifting in 3D space.
// Blends deep royal blue, teal-cyan, and indigo into one "night match under floodlights" scene.
(function () {
    'use strict';

    var container = document.getElementById('bg-3d');
    if (!container || typeof THREE === 'undefined') return;

    var prefersReducedMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var COLORS = [
        0x2148c9, // deep royal blue
        0x2148c9,
        0x00b8d9, // india blue / teal-cyan
        0x00e5ff, // bright cyan
        0x38bdf8, // sky blue
        0x818cf8, // indigo
        0xf3ede0  // cream (rare bright glint)
    ];

    var isNarrow = window.innerWidth < 640;
    var isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
    var STRIPE_COUNT = prefersReducedMotion ? 16 : (isNarrow ? 20 : isTablet ? 30 : 42);

    var scene, camera, renderer, rig, stripes = [];
    var mouseX = 0, mouseY = 0, targetRigX = 0, targetRigY = 0;
    var clock = new THREE.Clock();
    var running = true;
    var lastW = window.innerWidth, lastH = window.innerHeight;
    var maxScroll = 1;
    var camZ = 15, rigZ = 0;

    function rand(min, max) { return min + Math.random() * (max - min); }

    function init() {
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(
            50, window.innerWidth / window.innerHeight, 0.1, 100
        );
        camera.position.set(0, 0, 15);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setClearColor(0x0a1128, 1);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        // Lighting -- sky blue + deep blue rim to give the stripes a floodlit fabric sheen
        scene.add(new THREE.AmbientLight(0x2a3466, 1.1));

        var skyLight = new THREE.PointLight(0x38bdf8, 1.4, 60);
        skyLight.position.set(10, 8, 12);
        scene.add(skyLight);

        var blueLight = new THREE.PointLight(0x3a63e0, 1.1, 60);
        blueLight.position.set(-12, -6, 8);
        scene.add(blueLight);

        rig = new THREE.Group();
        scene.add(rig);

        for (var i = 0; i < STRIPE_COUNT; i++) {
            var length = rand(3.5, 9);
            var thickness = rand(0.28, 0.6);
            var depth = rand(0.06, 0.12);

            var geometry = new THREE.BoxGeometry(length, thickness, depth);
            var colorHex = COLORS[Math.floor(Math.random() * COLORS.length)];
            var material = new THREE.MeshStandardMaterial({
                color: colorHex,
                emissive: colorHex,
                emissiveIntensity: 0.22,
                metalness: 0.15,
                roughness: 0.55
            });

            var mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                rand(-16, 16),
                rand(-9, 9),
                rand(-20, 3)
            );
            mesh.rotation.z = rand(-0.75, 0.75); // diagonal sash tilt
            mesh.rotation.x = rand(-0.35, 0.35);
            mesh.rotation.y = rand(-0.35, 0.35);

            rig.add(mesh);
            stripes.push({
                mesh: mesh,
                baseY: mesh.position.y,
                floatAmp: rand(0.4, 1.2),
                floatSpeed: rand(0.15, 0.4),
                phase: rand(0, Math.PI * 2),
                rotSpeed: rand(-0.06, 0.06)
            });
        }

        window.addEventListener('resize', onResize, { passive: true });
        window.addEventListener('mousemove', onMouseMove, { passive: true });
        document.addEventListener('visibilitychange', onVisibilityChange);
        window.addEventListener('load', updateScrollBounds, { passive: true, once: true });

        updateScrollBounds();

        if (prefersReducedMotion) {
            renderer.render(scene, camera);
        } else {
            animate();
        }
    }

    function updateScrollBounds() {
        var doc = document.documentElement;
        maxScroll = (doc.scrollHeight - doc.clientHeight) || 1;
    }

    function onResize() {
        var w = window.innerWidth, h = window.innerHeight;
        if (w === lastW && h === lastH) return;
        lastW = w; lastH = h;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        updateScrollBounds();
    }

    function onMouseMove(e) {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;
        targetRigY = mouseX * 0.18;
        targetRigX = mouseY * 0.1;
    }

    function onVisibilityChange() {
        running = !document.hidden;
        if (running && !prefersReducedMotion) {
            clock.getDelta(); // avoid a large delta jump after being hidden
            animate();
        }
    }

    function getScrollProgress() {
        return Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
    }

    function animate() {
        if (!running) return;
        requestAnimationFrame(animate);

        var delta = Math.min(clock.getDelta(), 0.1);
        var t = clock.elapsedTime;
        var scrollProgress = getScrollProgress();

        for (var i = 0; i < stripes.length; i++) {
            var s = stripes[i];
            s.mesh.position.y = s.baseY + Math.sin(t * s.floatSpeed + s.phase) * s.floatAmp;
            s.mesh.rotation.z += s.rotSpeed * delta;
        }

        // gentle mouse parallax on the whole rig
        rig.rotation.y += (targetRigY - rig.rotation.y) * 0.04;
        rig.rotation.x += (targetRigX - rig.rotation.x) * 0.04;

        // scroll pulls the camera back and tilts the field slightly, reading as depth
        // (eased toward the target so scroll jitter doesn't translate into visual jerk)
        camZ += (15 + scrollProgress * 6 - camZ) * 0.06;
        rigZ += (scrollProgress * 0.12 - rigZ) * 0.06;
        camera.position.z = camZ;
        rig.rotation.z = rigZ;

        renderer.render(scene, camera);
    }

    try {
        init();
    } catch (err) {
        console.warn('3D background unavailable, falling back to flat navy background.', err);
        if (container) container.style.display = 'none';
    }
})