"use client";

/* ════════════════════════════════════════════════════════════════
 * 텍스트 명령 → 3D GLB 캐릭터 애니메이션 컨트롤 (클라이언트 컴포넌트)
 * ────────────────────────────────────────────────────────────────
 * ▶ 설치 (프로젝트 루트에서 1회)
 *     npm i three
 *     npm i -D @types/three
 *
 * ▶ 모델 파일 배치 — public/ 폴더 기준 (★ 아래 MODEL_PATHS 수정)
 *     public/
 *       models/
 *         character.fbx   ← 기본 캐릭터 (스킨 + 본) — 필수
 *         idle.fbx        ← 모션 파일 — 선택
 *         walk.fbx
 *         run.fbx
 *         jump.fbx
 *   · 확장자(.fbx / .glb)를 보고 FBXLoader / GLTFLoader를 자동
 *     선택하므로 두 포맷을 섞어 써도 됩니다.
 *   · 캐릭터 파일 안에 클립이 전부 내장돼 있으면 모션 파일이
 *     하나도 없어도 동작합니다 (이름 매칭으로 자동 추출).
 *   · 모션을 파일로 분리한 경우, 캐릭터와 같은 스켈레톤(본 이름)
 *     이어야 합니다. (예: 전부 Mixamo 리깅이면 OK —
 *     모션은 Mixamo에서 "Without Skin"으로 받는 걸 권장)
 * ════════════════════════════════════════════════════════════════ */

import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
// Draco 압축 GLB라면 주석 해제 (아래 setDRACOLoader도 함께)
// import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

/* ── 0. 설정 ─────────────────────────────────────────────────── */
// ★★★ 모델 경로 — public/ 기준 절대 경로. 여기만 수정하세요 ★★★
// (.fbx와 .glb 둘 다 지원 — 확장자를 보고 로더를 자동 선택)
const MODEL_PATHS = {
  character: "/models/character.fbx",
  motions: {
    idle: "/models/idle.fbx", // 대기
    walk: "/models/walk.fbx", // 걷기
    run: "/models/run.fbx", //   달리기
    jump: "/models/jump.fbx", // 점프
  } as Record<string, string>,
};

const ACTION_KEYS = Object.keys(MODEL_PATHS.motions); // ["idle","walk","run","jump"]
const FADE_DURATION = 0.5; //           크로스페이드 시간(초)
const ONE_SHOT = new Set(["jump"]); //  1회 재생 후 idle로 자동 복귀할 동작
const USE_LLM_API = false; //           true → LLM API로 의도 파악 (아래 4-B)

/* ════════════════════════════════════════════════
 * 자연어 의도 파악 (Intent Extractor) — 순수 함수
 * 반환: { action: "idle"|"walk"|"run"|"jump"|null, timeScale: number }
 * ════════════════════════════════════════════════ */
type Intent = { action: string | null; timeScale: number };

/* (4-A) 패턴 매칭 더미 — 개발 초기 오프라인 테스트용 */
function extractIntentByPattern(text: string): Intent {
  const t = text.trim().toLowerCase();

  // 속도 수식어 → timeScale
  let timeScale = 1.0;
  if (/천천히|느리게|살살|슬로우|slow/.test(t)) timeScale = 0.55;
  else if (/빨리|빠르게|전속력|풀스피드|fast|quick/.test(t)) timeScale = 1.6;

  // ⚠ 검사 순서 중요: "뛰어올라"(jump)가 "뛰-"(run)에 먼저 걸리지 않도록 jump부터
  if (/점프|뛰어\s*오|폴짝|jump/.test(t)) return { action: "jump", timeScale };
  if (/달려|달리|뛰|질주|조깅|런|run/.test(t)) return { action: "run", timeScale };
  if (/걸어|걷|산책|워킹|walk|이동|앞으로\s*가/.test(t)) return { action: "walk", timeScale };
  if (/멈춰|멈추|정지|그만|가만|쉬|스탑|stop|idle/.test(t)) return { action: "idle", timeScale };

  return { action: null, timeScale }; // 이해 실패 → 현재 동작 유지
}

/* (4-B) 실제 LLM API 연동 — Placeholder ────────────────────────────
 * 브라우저에 Gemini/OpenAI API 키를 직접 넣으면 키가 노출되므로,
 * Next.js API 라우트를 프록시로 두고 서버에서 호출하세요.
 *
 *   [브라우저] ──{ text }──▶ [app/api/intent/route.ts] ──프롬프트+키──▶ [Gemini / OpenAI]
 *              ◀────── { "action": "run", "timeScale": 0.6 } ──────
 *
 * app/api/intent/route.ts 뼈대:
 *   export async function POST(req: Request) {
 *     const { text } = await req.json();
 *     // 서버에서만 process.env.GEMINI_API_KEY 등을 사용해 LLM 호출
 *     // 시스템 프롬프트: 반드시 아래 JSON만 출력하게 강제
 *     //   { "action": "idle" | "walk" | "run" | "jump",
 *     //     "timeScale": 0.3~2.0 사이 숫자 }
 *     //   예) "천천히 뛰어줘" → { "action": "run", "timeScale": 0.6 }
 *     return Response.json({ action: "run", timeScale: 0.6 });
 *   }
 * ──────────────────────────────────────────────────────────────── */
async function extractIntentWithLLM(text: string): Promise<Intent> {
  const res = await fetch("/api/intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`API 응답 오류: ${res.status}`);
  const data = (await res.json()) as { action?: string; timeScale?: number };

  // 응답 검증: LLM이 이상한 값을 줘도 씬이 깨지지 않도록 방어
  return {
    action: data.action && ACTION_KEYS.includes(data.action) ? data.action : null,
    timeScale:
      typeof data.timeScale === "number"
        ? THREE.MathUtils.clamp(data.timeScale, 0.3, 2.0)
        : 1.0,
  };
}

async function extractIntent(text: string): Promise<Intent> {
  if (USE_LLM_API) {
    try {
      return await extractIntentWithLLM(text);
    } catch (err) {
      console.warn("LLM 호출 실패 → 패턴 매칭으로 대체:", err);
    }
  }
  return extractIntentByPattern(text);
}

/* ════════════════════════════════════════════════
 * 컴포넌트
 * ════════════════════════════════════════════════ */
type ThreeCtx = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  mixer: THREE.AnimationMixer | null;
  actions: Record<string, THREE.AnimationAction>;
  currentAction: THREE.AnimationAction | null;
};

type Status =
  | { kind: "action"; key: string; timeScale: number }
  | { kind: "message"; text: string; error?: boolean };

export default function MotionConsole() {
  const mountRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<ThreeCtx | null>(null);

  const [status, setStatus] = useState<Status>({ kind: "message", text: "3D 씬을 준비하는 중…" });
  const [currentKey, setCurrentKey] = useState<string | null>(null);
  const [loadedKeys, setLoadedKeys] = useState<string[]>([]);
  const [phase, setPhase] = useState<"loading" | "ready" | "error">("loading");
  const [errorDetail, setErrorDetail] = useState("");
  const [overlayOpen, setOverlayOpen] = useState(true);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  /* ── 3. 크로스페이드 재생 (fadeIn / fadeOut) ── */
  const playAction = useCallback((key: string, timeScale = 1.0) => {
    const ctx = ctxRef.current;
    if (!ctx?.mixer) return;

    const next = ctx.actions[key];
    if (!next) {
      setStatus({ kind: "message", text: `'${key}' 애니메이션이 아직 로드되지 않았습니다`, error: true });
      return;
    }

    // 같은 동작을 다시 명령: 속도만 갱신 (점프는 처음부터 재시작)
    if (next === ctx.currentAction) {
      next.setEffectiveTimeScale(timeScale);
      if (ONE_SHOT.has(key)) next.reset().play();
      setStatus({ kind: "action", key, timeScale });
      return;
    }

    next
      .reset() //                        클립을 0초 지점으로
      .setEffectiveTimeScale(timeScale)
      .setEffectiveWeight(1)
      .fadeIn(FADE_DURATION) //          새 동작: 가중치 0 → 1 (0.5초)
      .play();

    ctx.currentAction?.fadeOut(FADE_DURATION); // 이전 동작: 1 → 0

    ctx.currentAction = next;
    setCurrentKey(key);
    setStatus({ kind: "action", key, timeScale });
  }, []);

  /* ── 1~2. 씬 구축 + GLB 로드 (마운트 시 1회) ── */
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let disposed = false;

    /* 1. 기본 씬 */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090f0d);
    scene.fog = new THREE.Fog(0x090f0d, 8, 26);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 1.7, 4.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.0, 0);
    controls.enableDamping = true;
    controls.maxPolarAngle = Math.PI * 0.52; // 바닥 밑으로 못 내려가게
    controls.minDistance = 1.5;
    controls.maxDistance = 12;

    // 조명 (AmbientLight + DirectionalLight)
    scene.add(new THREE.AmbientLight(0xdcefe4, 0.7));
    const sun = new THREE.DirectionalLight(0xffffff, 2.6);
    sun.position.set(4, 7, 5);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = sun.shadow.camera.bottom = -6;
    sun.shadow.camera.right = sun.shadow.camera.top = 6;
    sun.shadow.bias = -0.0004;
    scene.add(sun);

    // 바닥 + 그리드
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(14, 64),
      new THREE.MeshStandardMaterial({ color: 0x102018, roughness: 0.95 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const grid = new THREE.GridHelper(28, 28, 0x22392e, 0x152219);
    grid.position.y = 0.001;
    scene.add(grid);

    const ctx: ThreeCtx = { renderer, scene, camera, controls, mixer: null, actions: {}, currentAction: null };
    ctxRef.current = ctx;

    /* 컨테이너 크기에 맞춰 리사이즈 (고정 헤더 높이와 무관하게 동작) */
    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    /* 렌더 루프 */
    const clock = new THREE.Clock();
    renderer.setAnimationLoop(() => {
      const dt = clock.getDelta();
      ctx.mixer?.update(dt); // 크로스페이드 가중치도 여기서 갱신됨
      controls.update();
      renderer.render(scene, camera);
    });

    /* 2. 모델 로드 & 애니메이션 클립 등록 — 확장자로 FBX/GLB 자동 판별 */
    const gltfLoader = new GLTFLoader();
    const fbxLoader = new FBXLoader();
    // Draco 압축 GLB면 주석 해제:
    // const draco = new DRACOLoader();
    // draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
    // gltfLoader.setDRACOLoader(draco);

    /** 확장자에 맞는 로더로 읽어 { root, animations } 공통 형태로 반환 */
    const loadAsset = async (
      path: string
    ): Promise<{ root: THREE.Object3D; animations: THREE.AnimationClip[] }> => {
      if (/\.fbx(\?|#|$)/i.test(path)) {
        const fbx = await fbxLoader.loadAsync(path); // FBX: 루트 Group에 애니메이션이 붙어 옴
        return { root: fbx, animations: fbx.animations };
      }
      const gltf = await gltfLoader.loadAsync(path); // GLB/GLTF: { scene, animations } 구조
      return { root: gltf.scene, animations: gltf.animations };
    };

    /** 클립 배열에서 이름에 key가 포함된 클립 찾기 (대소문자 무시) */
    const findClipByName = (clips: THREE.AnimationClip[], key: string) =>
      clips.find((c) => c.name.toLowerCase().includes(key.toLowerCase())) ?? null;

    /** AnimationAction 생성 + 등록. 같은 key가 이미 있으면 덮어씀 */
    const registerClip = (key: string, clip: THREE.AnimationClip) => {
      if (!ctx.mixer) return;
      const action = ctx.mixer.clipAction(clip);
      if (ONE_SHOT.has(key)) {
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true; // 끝 프레임 유지 → idle 복귀 페이드가 자연스러움
      }
      ctx.actions[key] = action;
    };

    /** 모델 크기를 사람 키(≈1.7m) 기준으로 보정하고 발을 지면(y=0)에 맞춤 */
    const fitToGround = (root: THREE.Object3D, targetHeight = 1.7) => {
      const box = new THREE.Box3().setFromObject(root);
      const height = box.getSize(new THREE.Vector3()).y;
      // cm 단위 모델(Mixamo FBX 등 — 키가 170으로 잡힘)의 스케일을 자동 보정
      if (height > 0 && (height < targetHeight * 0.4 || height > targetHeight * 2.5)) {
        root.scale.setScalar(targetHeight / height);
      }
      const box2 = new THREE.Box3().setFromObject(root);
      root.position.y -= box2.min.y;
    };

    /* ── 분리 모션의 본 이름 매칭 도우미 ──────────────────────────
     * 분리된 모션 클립은 '본 이름'으로 캐릭터 뼈를 찾아 움직인다.
     * 이름이 다르면(mixamorig vs mixamorig1, 커스텀 리깅 등) 에러 없이
     * 조용히 실패하므로, 여기서 차이를 흡수하고 진단 로그를 남긴다. */

    /** 본 이름 정규화 — 네임스페이스·구분자 차이 흡수 ("mixamorig1:Hips" ≈ "Hips") */
    const normalizeBoneName = (name: string) =>
      name.toLowerCase().replace(/[^a-z0-9]/g, "").replace(/^mixamorig\d*/, "");

    /** 캐릭터 쪽 노드 이름 색인 */
    const buildNodeMaps = (root: THREE.Object3D) => {
      const exact = new Set<string>();
      const normalized = new Map<string, string>(); // 정규화 이름 → 실제 이름
      const samples: string[] = [];
      root.traverse((o) => {
        if (!o.name) return;
        exact.add(o.name);
        const n = normalizeBoneName(o.name);
        if (n && !normalized.has(n)) normalized.set(n, o.name);
        if ((o as THREE.Bone).isBone && samples.length < 6) samples.push(o.name);
      });
      return { exact, normalized, samples };
    };
    type NodeMaps = ReturnType<typeof buildNodeMaps>;

    /** "mixamorigHips.quaternion" → ["mixamorigHips", ".quaternion"] */
    const splitTrackName = (trackName: string): [string, string] => {
      const i = trackName.lastIndexOf(".");
      return i < 0 ? [trackName, ""] : [trackName.slice(0, i), trackName.slice(i)];
    };

    /** 모션 클립의 트랙 이름을 캐릭터 본 이름에 맞게 재매핑.
     *  하나도 못 맞추면 null 반환 (= 스켈레톤이 아예 다른 파일) */
    const remapClipToCharacter = (clip: THREE.AnimationClip, maps: NodeMaps, label: string) => {
      const kept: THREE.KeyframeTrack[] = [];
      let exact = 0;
      let remapped = 0;
      let dropped = 0;
      const droppedSamples: string[] = [];
      for (const track of clip.tracks) {
        const [node, prop] = splitTrackName(track.name);
        if (maps.exact.has(node)) {
          kept.push(track);
          exact += 1;
          continue;
        }
        const match = maps.normalized.get(normalizeBoneName(node));
        if (match) {
          const t = track.clone();
          t.name = match + prop;
          kept.push(t);
          remapped += 1;
        } else {
          dropped += 1;
          if (droppedSamples.length < 6) droppedSamples.push(node);
        }
      }
      if (remapped > 0 || dropped > 0) {
        console.info(
          `[모션:${label}] 트랙 ${clip.tracks.length}개 — 이름 일치 ${exact}, 재매핑 ${remapped}, 미일치 제거 ${dropped}`
        );
      }
      const ratio = clip.tracks.length > 0 ? kept.length / clip.tracks.length : 0;
      if (ratio < 0.5) {
        // Neck/Head처럼 흔한 이름 몇 개만 우연히 겹친 경우 — 반쪽짜리로 재생하면
        // "목만 까딱거리는" 혼란만 주므로 스켈레톤 불일치로 판단하고 등록하지 않음
        console.warn(
          `[모션:${label}] 캐릭터와 본이 ${kept.length}/${clip.tracks.length}개만 일치 — 스켈레톤이 다른 파일로 판단해 등록하지 않습니다 (버튼 비활성).\n` +
            `  · 모션 쪽 본 예시: ${droppedSamples.join(", ")}\n` +
            `  · 캐릭터 본 예시: ${maps.samples.join(", ")}\n` +
            `  → Mixamo에서 리깅이 끝난 '그 캐릭터'를 T-Pose·With Skin으로 다시 받아 character.fbx를 교체하세요.`
        );
        return null;
      }
      return new THREE.AnimationClip(clip.name, clip.duration, kept);
    };

    (async () => {
      try {
        // (1) 기본 캐릭터 ------------------------------------------------
        const character = await loadAsset(MODEL_PATHS.character);
        if (disposed) return;

        const model = character.root;
        model.traverse((o) => {
          if ((o as THREE.Mesh).isMesh) o.castShadow = true;
        });
        fitToGround(model);
        scene.add(model);

        // 진단: 캐릭터 본 확인 (브라우저 콘솔 F12에서 확인)
        let boneCount = 0;
        model.traverse((o) => {
          if ((o as THREE.Bone).isBone) boneCount += 1;
        });
        const nodeMaps = buildNodeMaps(model);
        console.info(
          `[캐릭터] 본 ${boneCount}개 로드: ${nodeMaps.samples.join(", ")}${boneCount > nodeMaps.samples.length ? " …" : ""}`
        );
        if (boneCount === 0) {
          console.warn(
            "[캐릭터] 본(Bone)이 없습니다 — 리깅되지 않은 모델에는 스켈레톤 애니메이션이 적용되지 않습니다."
          );
        }

        const mixer = new THREE.AnimationMixer(model);
        ctx.mixer = mixer;
        // 점프처럼 LoopOnce인 동작이 끝나면 자동으로 idle 복귀
        mixer.addEventListener("finished", (e) => {
          const key = ACTION_KEYS.find((k) => ctx.actions[k] === e.action);
          if (key && ONE_SHOT.has(key) && ctx.actions.idle) playAction("idle");
        });

        // (2) 클립 확보 — 두 가지 배포 형태를 모두 지원 -------------------
        //   케이스 A) character.glb 하나에 클립 전부 내장 → 이름 매칭으로 추출
        //   케이스 B) walk.glb / run.glb … 로 모션 분리   → 파일별 로드 후 등록
        //   섞여 있으면: 내장 클립을 먼저 채우고, 개별 파일 로드에 성공하면 덮어씀
        const embedded = character.animations;
        for (const key of ACTION_KEYS) {
          const clip = findClipByName(embedded, key);
          if (clip) registerClip(key, clip);
        }

        await Promise.all(
          Object.entries(MODEL_PATHS.motions).map(async ([key, path]) => {
            try {
              const g = await loadAsset(path);
              // 모션 파일 안에도 클립이 여러 개일 수 있으니 이름 매칭 → 없으면 첫 클립
              // (Mixamo FBX는 클립 이름이 "mixamo.com"이라 매칭에 실패하고 첫 클립이 쓰임 — 정상)
              const raw = findClipByName(g.animations, key) ?? g.animations[0];
              if (!raw) {
                console.warn(`[모션:${key}] ${path} 안에 애니메이션 클립이 없습니다`);
                return;
              }
              // 본 이름이 다르면 재매핑, 아예 다른 스켈레톤이면 등록하지 않음
              const clip = remapClipToCharacter(raw, nodeMaps, key);
              if (clip && !disposed) registerClip(key, clip);
            } catch {
              // 파일이 없어도 치명적이지 않음 (내장 클립이 있으면 그대로 사용)
              console.warn(`[모션] ${path} 로드 실패 — 건너뜀`);
            }
          })
        );
        if (disposed) return;

        if (Object.keys(ctx.actions).length === 0) {
          throw new Error(
            "사용 가능한 애니메이션 클립을 하나도 찾지 못했습니다. character.glb 내장 클립 또는 모션 파일을 확인하세요."
          );
        }

        setLoadedKeys(Object.keys(ctx.actions));
        setPhase("ready");
        setOverlayOpen(false);
        playAction(ctx.actions.idle ? "idle" : Object.keys(ctx.actions)[0]); // 시작 동작
      } catch (err) {
        if (disposed) return;
        console.error(err);
        setErrorDetail(String((err as Error)?.message ?? err));
        setPhase("error");
        // 씬이 비어 보이지 않도록 임시 캡슐 배치
        const capsule = new THREE.Mesh(
          new THREE.CapsuleGeometry(0.28, 0.95, 6, 16),
          new THREE.MeshStandardMaterial({ color: 0x36a269, roughness: 0.5 })
        );
        capsule.position.y = 0.95 / 2 + 0.28;
        capsule.castShadow = true;
        scene.add(capsule);
      }
    })();

    /* 정리 — 개발 모드 StrictMode 이중 마운트에도 안전 */
    return () => {
      disposed = true;
      ro.disconnect();
      renderer.setAnimationLoop(null);
      controls.dispose();
      ctx.mixer?.stopAllAction();
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.geometry?.dispose();
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((m) => m?.dispose());
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
      ctxRef.current = null;
    };
  }, [playAction]);

  /* ── 텍스트 명령 처리 ── */
  const handleCommand = useCallback(async () => {
    const t = text.trim();
    if (!t || busy || phase !== "ready") return;
    setText("");
    setBusy(true);
    setStatus({ kind: "message", text: `"${t}" 해석 중…` });

    const { action, timeScale } = await extractIntent(t);
    setBusy(false);

    if (!action) {
      setStatus({
        kind: "message",
        text: `"${t}" → 이해하지 못했어요. 걷기·달리기·점프·정지 관련 표현을 써보세요.`,
        error: true,
      });
      return;
    }
    playAction(action, timeScale);
  }, [text, busy, phase, playAction]);

  /* ── UI ── */
  return (
    <section className="motion-console" aria-label="3D 캐릭터 애니메이션 컨트롤">
      <div ref={mountRef} className="motion-stage" aria-hidden="true" />

      <div className="motion-hud">
        <p className="eyebrow">Motion Console</p>
        <h1>
          텍스트 명령으로
          <br />
          캐릭터를 움직입니다
        </h1>
      </div>

      <div className="motion-dock">
        <p className={`motion-status${status.kind === "message" && status.error ? " error" : ""}`}>
          {status.kind === "action" ? (
            <>
              현재 동작: <strong>{status.key.toUpperCase()}</strong>
              {status.timeScale !== 1 ? ` · 속도 x${status.timeScale}` : ""}
            </>
          ) : (
            status.text
          )}
        </p>

        <div className="motion-quick" aria-label="빠른 동작 버튼">
          {ACTION_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              className={currentKey === key ? "active" : undefined}
              disabled={!loadedKeys.includes(key)}
              onClick={() => playAction(key)}
            >
              {key}
            </button>
          ))}
        </div>

        <div className="motion-input">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              // isComposing: 한글 IME 조합 중 Enter가 두 번 처리되는 것 방지
              if (e.key === "Enter" && !e.nativeEvent.isComposing) handleCommand();
            }}
            placeholder='예: "천천히 뛰어줘", "앞으로 걸어가봐", "점프!"'
            autoComplete="off"
            aria-label="캐릭터 명령 입력"
          />
          <button type="button" className="motion-send" onClick={handleCommand} disabled={busy || phase !== "ready"}>
            전송
          </button>
        </div>
      </div>

      {overlayOpen && (
        <div className="motion-boot">
          {phase !== "error" ? (
            <>
              <div className="motion-spinner" aria-hidden="true" />
              <p>3D 모델 로딩 중… ({MODEL_PATHS.character})</p>
            </>
          ) : (
            <div className="motion-error">
              <b>모델을 불러오지 못했습니다</b>
              <br />
              1. <code>public{MODEL_PATHS.character}</code> 위치에 GLB 파일이 있는지
              <br />
              2. <code>MODEL_PATHS</code>의 경로·파일명이 실제와 맞는지 확인하세요
              <br />
              <span className="motion-error-detail">{errorDetail}</span>
              <button type="button" className="motion-dismiss" onClick={() => setOverlayOpen(false)}>
                빈 씬 보기
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
