/**
 * Client-side diagnostics collection.
 *
 * PRIVACY: nothing here ever reads or serialises image pixels. Every value is a
 * dimension, a byte count, a timing or an *aggregate* brightness statistic. A
 * report is safe to paste into a support chat. The optional 96px preview in the
 * diagnostics panel is the only thing that includes image data, and only when
 * the user explicitly ticks the box.
 *
 * It exists because the "foto preta ao salvar" bug is silent (no exception, the
 * export just comes out black) and does not reproduce for us — so we need the
 * user's device to tell us which stage produced the black frame.
 */

// ---------------------------------------------------------------------------
// Session counters (reset on page load)
// ---------------------------------------------------------------------------

interface SessionCounters {
  imagesLoaded: number;
  heicConversions: number;
  lastHeic: { ms: number; inBytes: number; outBytes: number } | null;
  cropSaves: number;
  exports: number;
  blackExportsDetected: number;
}

const session: SessionCounters = {
  imagesLoaded: 0,
  heicConversions: 0,
  lastHeic: null,
  cropSaves: 0,
  exports: 0,
  blackExportsDetected: 0,
};

export type SessionSnapshot = Readonly<SessionCounters>;

export const diagSession = {
  bump(key: "imagesLoaded" | "heicConversions" | "cropSaves" | "exports" | "blackExportsDetected") {
    session[key] += 1;
  },
  setLastHeic(value: SessionCounters["lastHeic"]) {
    session.lastHeic = value;
  },
  snapshot(): SessionSnapshot {
    return { ...session };
  },
};

// ---------------------------------------------------------------------------
// Crop-stage diagnostics (filled in by getCroppedImg)
// ---------------------------------------------------------------------------

export interface CropDiagnostics {
  sourceNatural: { w: number; h: number };
  requestedCrop: { x: number; y: number; width: number; height: number };
  clampedCrop: { x: number; y: number; width: number; height: number };
  clampAdjusted: boolean;
  outputSize: { w: number; h: number };
  transformedPath: boolean;
  outputLuminance: LuminanceSample;
}

let lastCropDiagnostics: CropDiagnostics | null = null;

export function setLastCropDiagnostics(value: CropDiagnostics) {
  lastCropDiagnostics = value;
}

export function getLastCropDiagnostics(): CropDiagnostics | null {
  return lastCropDiagnostics;
}

// ---------------------------------------------------------------------------
// Brightness sampling — how we tell "this frame is basically black/blank"
// ---------------------------------------------------------------------------

export interface LuminanceSample {
  mean: number;
  min: number;
  max: number;
  fractionOpaque: number;
  fractionNearBlack: number;
  looksBlank: boolean;
  looksBlack: boolean;
  error?: string;
}

type Drawable = HTMLCanvasElement | HTMLImageElement | ImageBitmap;

export function sampleLuminance(source: Drawable, size = 32): LuminanceSample {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      return blankSample("no-context");
    }
    ctx.drawImage(source as CanvasImageSource, 0, 0, size, size);
    const { data } = ctx.getImageData(0, 0, size, size);

    const total = size * size;
    let sum = 0;
    let min = 255;
    let max = 0;
    let opaque = 0;
    let nearBlack = 0;
    for (let i = 0; i < data.length; i += 4) {
      const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      sum += luminance;
      if (luminance < min) min = luminance;
      if (luminance > max) max = luminance;
      if (data[i + 3] > 250) opaque += 1;
      if (luminance < 8) nearBlack += 1;
    }
    const mean = sum / total;
    return {
      mean: round1(mean),
      min: round1(min),
      max: round1(max),
      fractionOpaque: round3(opaque / total),
      fractionNearBlack: round3(nearBlack / total),
      looksBlank: max - min < 4,
      looksBlack: mean < 10 && max < 24,
    };
  } catch (error) {
    return blankSample(errName(error));
  }
}

function blankSample(error: string): LuminanceSample {
  return {
    mean: 0,
    min: 0,
    max: 0,
    fractionOpaque: 0,
    fractionNearBlack: 1,
    looksBlank: true,
    looksBlack: true,
    error,
  };
}

// ---------------------------------------------------------------------------
// Environment + capability probes
// ---------------------------------------------------------------------------

interface NavigatorExtras {
  userAgentData?: { brands?: { brand: string; version: string }[]; platform?: string };
  deviceMemory?: number;
  connection?: { effectiveType?: string; saveData?: boolean };
  storage?: { estimate?: () => Promise<{ usage?: number; quota?: number }> };
}

export function detectEngine() {
  const ua = navigator.userAgent;
  const nav = navigator as Navigator & NavigatorExtras;
  const isIOS =
    /iP(hone|ad|od)/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/.test(ua);
  const isCriOS = /CriOS/.test(ua);
  const isFxiOS = /FxiOS/.test(ua);
  const isEdgiOS = /EdgiOS/.test(ua);
  const isSafari = /Safari/.test(ua) && !/Chrome|CriOS|FxiOS|EdgiOS|Android/.test(ua);
  const isChrome = /Chrome|CriOS/.test(ua) && !/Edg(A|iOS)?\//.test(ua);

  let label = "desconhecido";
  if (isIOS) {
    const brand = isCriOS
      ? "Chrome"
      : isFxiOS
      ? "Firefox"
      : isEdgiOS
      ? "Edge"
      : "Safari";
    label = `iOS WebKit (${brand})`;
  } else if (isAndroid) {
    label = `Android ${isChrome ? "Chrome" : "outro"}`;
  } else if (isSafari) {
    label = "macOS Safari";
  } else if (isChrome) {
    label = "Desktop Chrome";
  }

  return {
    label,
    ua,
    isIOS,
    isAndroid,
    isCriOS,
    isFxiOS,
    isEdgiOS,
    // On iOS *every* browser is WebKit underneath, regardless of branding.
    webkit: isIOS || isSafari,
    brands: nav.userAgentData?.brands ?? null,
    platform: nav.userAgentData?.platform ?? navigator.platform,
  };
}

export function getEnvironment() {
  const nav = navigator as Navigator & NavigatorExtras;
  return {
    engine: detectEngine(),
    language: navigator.language,
    online: navigator.onLine,
    deviceMemoryGB: nav.deviceMemory ?? null,
    cpuCores: navigator.hardwareConcurrency ?? null,
    devicePixelRatio: window.devicePixelRatio,
    screen: { width: window.screen.width, height: window.screen.height },
    viewport: { width: window.innerWidth, height: window.innerHeight },
    visualViewportScale: window.visualViewport?.scale ?? null,
    connection: nav.connection
      ? { effectiveType: nav.connection.effectiveType ?? null, saveData: !!nav.connection.saveData }
      : null,
    jsHeapUsedMB: readJsHeapMB(),
    prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  };
}

export async function getStorageEstimate() {
  try {
    const nav = navigator as Navigator & NavigatorExtras;
    if (!nav.storage?.estimate) return null;
    const estimate = await nav.storage.estimate();
    return {
      usageMB: Math.round((estimate.usage ?? 0) / 1e6),
      quotaMB: Math.round((estimate.quota ?? 0) / 1e6),
    };
  } catch (error) {
    return { error: errName(error) };
  }
}

/**
 * Detects browsers / extensions that poison canvas readback (Brave, Safari
 * "fingerprint protection", DuckDuckGo, some content blockers). When active,
 * getImageData / toDataURL return altered or blank data — which would make both
 * the crop and the html-to-image export come out black, invisibly to us.
 */
export function probeCanvasReadbackFidelity() {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return { error: "no-context" };

    ctx.fillStyle = "rgb(1, 2, 3)";
    ctx.fillRect(0, 0, 8, 16);
    ctx.fillStyle = "rgb(254, 253, 252)";
    ctx.fillRect(8, 0, 8, 16);

    const dark = ctx.getImageData(2, 2, 1, 1).data;
    const light = ctx.getImageData(12, 2, 1, 1).data;
    const readbackExact =
      dark[0] === 1 &&
      dark[1] === 2 &&
      dark[2] === 3 &&
      light[0] === 254 &&
      light[1] === 253 &&
      light[2] === 252;

    const url1 = canvas.toDataURL();
    const url2 = canvas.toDataURL();

    return {
      readbackExact,
      toDataURLStable: url1 === url2,
      toDataURLEmpty: url1 === "data:,",
      toDataURLLength: url1.length,
    };
  } catch (error) {
    return { error: errName(error) };
  }
}

/**
 * Largest canvas this device can actually rasterise *and read back*. WebKit
 * silently returns a blank (→ black) canvas past its area limit (~16.7 MP on
 * many iPhones), so a plain "can I create it" check is not enough — we draw red
 * and read a corner pixel back.
 */
export function probeMaxCanvas() {
  const nav = navigator as Navigator & NavigatorExtras;
  const memory = nav.deviceMemory ?? 4;
  const areaProbes: [number, number][] =
    memory >= 4
      ? [
          [2048, 2048],
          [4096, 4096],
          [4096, 8192],
          [8192, 8192],
        ]
      : [
          [2048, 2048],
          [4096, 4096],
          [4096, 6144],
        ];

  let largestOk: [number, number] | null = null;
  let largestOkMP = 0;
  let firstFail: { size: [number, number]; kind: string } | null = null;

  for (const [width, height] of areaProbes) {
    let canvas: HTMLCanvasElement | null = null;
    try {
      canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        firstFail = { size: [width, height], kind: "no-context" };
        break;
      }
      ctx.fillStyle = "#ff0000";
      ctx.fillRect(0, 0, width, height);
      const pixel = ctx.getImageData(width - 2, height - 2, 1, 1).data;
      if (pixel[0] > 200 && pixel[3] > 200) {
        largestOk = [width, height];
        largestOkMP = round1((width * height) / 1e6);
      } else {
        firstFail = { size: [width, height], kind: "blank-readback" };
        break;
      }
    } catch (error) {
      firstFail = { size: [width, height], kind: errName(error) };
      break;
    } finally {
      if (canvas) {
        canvas.width = 0;
        canvas.height = 0;
      }
    }
  }

  let maxDimension = 0;
  for (const width of [8192, 16384, 32767]) {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = 1;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) break;
      ctx.fillStyle = "#ff0000";
      ctx.fillRect(width - 1, 0, 1, 1);
      if (ctx.getImageData(width - 1, 0, 1, 1).data[0] > 200) {
        maxDimension = width;
      } else {
        break;
      }
      canvas.width = 0;
    } catch {
      break;
    }
  }

  return { largestOk, largestOkMP, firstFail, maxDimension };
}

// ---------------------------------------------------------------------------
// Rendered-image helpers (used by the export step)
// ---------------------------------------------------------------------------

export function srcKind(src: string): string {
  if (src.startsWith("data:")) {
    return src.slice(0, Math.min(src.indexOf(",") + 1, 32));
  }
  if (src.startsWith("blob:")) return "blob:";
  if (src.includes("/_next/image")) return "/_next/image (optimizer)";
  return src.slice(0, 32);
}

export function describeImageElement(img: HTMLImageElement) {
  const src = img.currentSrc || img.src || "";
  const alt = img.getAttribute("alt");
  return {
    role:
      alt && alt.length > 0
        ? alt
        : img.getAttribute("data-test") ||
          img.className.split(/\s+/)[0] ||
          "img",
    complete: img.complete,
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight,
    displayWidth: img.width,
    srcKind: srcKind(src),
    srcLength: src.length,
  };
}

export async function analyzeRenderedImage(dataUrl: string) {
  const img = new Image();
  img.src = dataUrl;
  try {
    if (img.decode) await img.decode();
  } catch {
    /* fall through — sampleLuminance will report the blank */
  }
  return {
    ...sampleLuminance(img),
    width: img.naturalWidth,
    height: img.naturalHeight,
    bytesApprox: Math.round(dataUrl.length * 0.75),
    kind: srcKind(dataUrl),
  };
}

// ---------------------------------------------------------------------------
// Report assembly
// ---------------------------------------------------------------------------

export interface DiagnosticsReport {
  at: string;
  url: string;
  commit: string | null;
  note: string;
  environment: ReturnType<typeof getEnvironment>;
  storage: Awaited<ReturnType<typeof getStorageEstimate>>;
  canvasReadback: ReturnType<typeof probeCanvasReadbackFidelity>;
  maxCanvas: ReturnType<typeof probeMaxCanvas>;
  session: SessionSnapshot;
  crop: CropDiagnostics | null;
  stage: Record<string, unknown>;
  error?: string;
}

export async function buildDiagnosticsReport(
  stage: Record<string, unknown> = {}
): Promise<DiagnosticsReport> {
  return {
    at: new Date().toISOString(),
    url: typeof location !== "undefined" ? location.href.replace(/#.*$/, "") : "",
    commit: process.env.NEXT_PUBLIC_COMMIT_SHA || null,
    note: "Somente metadados técnicos — nenhum dado de imagem é incluído aqui.",
    environment: getEnvironment(),
    storage: await getStorageEstimate(),
    canvasReadback: probeCanvasReadbackFidelity(),
    maxCanvas: probeMaxCanvas(),
    session: diagSession.snapshot(),
    crop: getLastCropDiagnostics(),
    ...(typeof stage.error === "string" ? { error: stage.error } : {}),
    stage,
  };
}

// ---------------------------------------------------------------------------

function round1(value: number) {
  return Math.round(value * 10) / 10;
}

function round3(value: number) {
  return Math.round(value * 1000) / 1000;
}

function errName(error: unknown) {
  return error instanceof Error ? `${error.name}: ${error.message}` : String(error);
}

function readJsHeapMB(): number | null {
  const perf = performance as Performance & { memory?: { usedJSHeapSize: number } };
  return perf.memory ? Math.round(perf.memory.usedJSHeapSize / 1e6) : null;
}
