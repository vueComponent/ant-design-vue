import type { CSSProperties } from 'vue';
import { defineComponent, shallowRef, watch, computed, watchEffect } from 'vue';
import type { ImageSettings } from './interface';
import { qrProps } from './interface';

import qrcodegen from './qrcodegen';

type Modules = ReturnType<qrcodegen.QrCode['getModules']>;
type Excavation = { x: number; y: number; w: number; h: number };

const ERROR_LEVEL_MAP: { [index: string]: qrcodegen.QrCode.Ecc } = {
  L: qrcodegen.QrCode.Ecc.LOW,
  M: qrcodegen.QrCode.Ecc.MEDIUM,
  Q: qrcodegen.QrCode.Ecc.QUARTILE,
  H: qrcodegen.QrCode.Ecc.HIGH,
};

const DEFAULT_SIZE = 128;
const DEFAULT_LEVEL = 'L';
const DEFAULT_BGCOLOR = '#FFFFFF';
const DEFAULT_FGCOLOR = '#000000';
const DEFAULT_INCLUDEMARGIN = false;

const SPEC_MARGIN_SIZE = 4;
const DEFAULT_MARGIN_SIZE = 0;

// This is *very* rough estimate of max amount of QRCode allowed to be covered.
// It is "wrong" in a lot of ways (area is a terrible way to estimate, it
// really should be number of modules covered), but if for some reason we don't
// get an explicit height or width, I'd rather default to something than throw.
const DEFAULT_IMG_SCALE = 0.1;

function generatePath(modules: Modules, margin = 0): string {
  const ops: Array<string> = [];
  modules.forEach(function (row, y) {
    let start: number | null = null;
    row.forEach(function (cell, x) {
      if (!cell && start !== null) {
        // M0 0h7v1H0z injects the space with the move and drops the comma,
        // saving a char per operation
        ops.push(`M${start + margin} ${y + margin}h${x - start}v1H${start + margin}z`);
        start = null;
        return;
      }

      // end of row, clean up or skip
      if (x === row.length - 1) {
        if (!cell) {
          // We would have closed the op above already so this can only mean
          // 2+ light modules in a row.
          return;
        }
        if (start === null) {
          // Just a single dark module.
          ops.push(`M${x + margin},${y + margin} h1v1H${x + margin}z`);
        } else {
          // Otherwise finish the current line.
          ops.push(`M${start + margin},${y + margin} h${x + 1 - start}v1H${start + margin}z`);
        }
        return;
      }

      if (cell && start === null) {
        start = x;
      }
    });
  });
  return ops.join('');
}

// We could just do this in generatePath, except that we want to support
// non-Path2D canvas, so we need to keep it an explicit step.
function excavateModules(modules: Modules, excavation: Excavation): Modules {
  return modules.slice().map((row, y) => {
    if (y < excavation.y || y >= excavation.y + excavation.h) {
      return row;
    }
    return row.map((cell, x) => {
      if (x < excavation.x || x >= excavation.x + excavation.w) {
        return cell;
      }
      return false;
    });
  });
}

function getImageSettings(
  cells: Modules,
  size: number,
  margin: number,
  imageSettings?: ImageSettings,
): null | {
  x: number;
  y: number;
  h: number;
  w: number;
  excavation: Excavation | null;
} {
  if (imageSettings == null) {
    return null;
  }
  const numCells = cells.length + margin * 2;
  const defaultSize = Math.floor(size * DEFAULT_IMG_SCALE);
  const scale = numCells / size;
  const w = (imageSettings.width || defaultSize) * scale;
  const h = (imageSettings.height || defaultSize) * scale;
  const x = imageSettings.x == null ? cells.length / 2 - w / 2 : imageSettings.x * scale;
  const y = imageSettings.y == null ? cells.length / 2 - h / 2 : imageSettings.y * scale;

  let excavation = null;
  if (imageSettings.excavate) {
    const floorX = Math.floor(x);
    const floorY = Math.floor(y);
    const ceilW = Math.ceil(w + x - floorX);
    const ceilH = Math.ceil(h + y - floorY);
    excavation = { x: floorX, y: floorY, w: ceilW, h: ceilH };
  }

  return { x, y, h, w, excavation };
}

function getMarginSize(includeMargin: boolean, marginSize?: number): number {
  if (marginSize != null) {
    return Math.floor(marginSize);
  }
  return includeMargin ? SPEC_MARGIN_SIZE : DEFAULT_MARGIN_SIZE;
}

// For canvas we're going to switch our drawing mode based on whether or not
// the environment supports Path2D. We only need the constructor to be
// supported, but Edge doesn't actually support the path (string) type
// argument. Luckily it also doesn't support the addPath() method. We can
// treat that as the same thing.
const SUPPORTS_PATH2D = (function () {
  try {
    new Path2D().addPath(new Path2D());
  } catch (e) {
    return false;
  }
  return true;
})();

export const QRCodeCanvas = defineComponent({
  name: 'QRCodeCanvas',
  inheritAttrs: false,
  props: { ...qrProps(), level: String, bgColor: String, fgColor: String, marginSize: Number },
  setup(props, { attrs, expose }) {
    const imgSrc = computed(() => props.imageSettings?.src);
    const _canvas = shallowRef<HTMLCanvasElement>(null);
    const _image = shallowRef<HTMLImageElement>(null);
    const isImgLoaded = shallowRef(false);
    expose({
      toDataURL: (type?: string, quality?: any) => {
        return _canvas.value?.toDataURL(type, quality);
      },
    });
    watchEffect(
      () => {
        const {
          value,
          size = DEFAULT_SIZE,
          level = DEFAULT_LEVEL,
          bgColor = DEFAULT_BGCOLOR,
          fgColor = DEFAULT_FGCOLOR,
          includeMargin = DEFAULT_INCLUDEMARGIN,
          marginSize,
          imageSettings,
        } = props;
        if (_canvas.value != null) {
          const canvas = _canvas.value;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return;
          }

          let cells = qrcodegen.QrCode.encodeText(value, ERROR_LEVEL_MAP[level]).getModules();
          const margin = getMarginSize(includeMargin, marginSize);
          const numCells = cells.length + margin * 2;
          const calculatedImageSettings = getImageSettings(cells, size, margin, imageSettings);

          const image = _image.value;
          const haveImageToRender =
            isImgLoaded.value &&
            calculatedImageSettings != null &&
            image !== null &&
            image.complete &&
            image.naturalHeight !== 0 &&
            image.naturalWidth !== 0;

          if (haveImageToRender) {
            if (calculatedImageSettings.excavation != null) {
              cells = excavateModules(cells, calculatedImageSettings.excavation);
            }
          }

          // We're going to scale this so that the number of drawable units
          // matches the number of cells. This avoids rounding issues, but does
          // result in some potentially unwanted single pixel issues between
          // blocks, only in environments that don't support Path2D.
          const pixelRatio = window.devicePixelRatio || 1;
          canvas.height = canvas.width = size * pixelRatio;
          const scale = (size / numCells) * pixelRatio;
          ctx.scale(scale, scale);

          // Draw solid background, only paint dark modules.
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, numCells, numCells);

          ctx.fillStyle = fgColor;
          if (SUPPORTS_PATH2D) {
            // $FlowFixMe: Path2D c'tor doesn't support args yet.
            ctx.fill(new Path2D(generatePath(cells, margin)));
          } else {
            cells.forEach(function (row, rdx) {
              row.forEach(function (cell, cdx) {
                if (cell) {
                  ctx.fillRect(cdx + margin, rdx + margin, 1, 1);
                }
              });
            });
          }

          if (haveImageToRender) {
            ctx.drawImage(
              image,
              calculatedImageSettings.x + margin,
              calculatedImageSettings.y + margin,
              calculatedImageSettings.w,
              calculatedImageSettings.h,
            );
          }
        }
      },
      { flush: 'post' },
    );
    watch(imgSrc, () => {
      isImgLoaded.value = false;
    });

    return () => {
      const size = props.size ?? DEFAULT_SIZE;
      const canvasStyle = { height: `${size}px`, width: `${size}px` };

      let img = null;
      if (imgSrc.value != null) {
        img = (
          <img
            src={imgSrc.value}
            key={imgSrc.value}
            style={{ display: 'none' }}
            onLoad={() => {
              isImgLoaded.value = true;
            }}
            ref={_image}
          />
        );
      }
      return (
        <>
          <canvas {...attrs} style={[canvasStyle, attrs.style as CSSProperties]} ref={_canvas} />
          {img}
        </>
      );
    };
  },
});

export const QRCodeSVG = defineComponent({
  name: 'QRCodeSVG',
  inheritAttrs: false,
  props: {
    ...qrProps(),
    color: String,
    level: String,
    bgColor: String,
    fgColor: String,
    marginSize: Number,
    title: String,
  },
  setup(props) {
    let cells = null;
    let margin = null;
    let numCells = null;
    let calculatedImageSettings = null;

    let fgPath = null;
    let image = null;

    watchEffect(() => {
      const {
        value,
        size = DEFAULT_SIZE,
        level = DEFAULT_LEVEL,
        includeMargin = DEFAULT_INCLUDEMARGIN,
        marginSize,
        imageSettings,
      } = props;

      cells = qrcodegen.QrCode.encodeText(value, ERROR_LEVEL_MAP[level]).getModules();

      margin = getMarginSize(includeMargin, marginSize);
      numCells = cells.length + margin * 2;
      calculatedImageSettings = getImageSettings(cells, size, margin, imageSettings);

      if (imageSettings != null && calculatedImageSettings != null) {
        if (calculatedImageSettings.excavation != null) {
          cells = excavateModules(cells, calculatedImageSettings.excavation);
        }

        image = (
          <image
            xlinkHref={imageSettings.src}
            height={calculatedImageSettings.h}
            width={calculatedImageSettings.w}
            x={calculatedImageSettings.x + margin}
            y={calculatedImageSettings.y + margin}
            preserveAspectRatio="none"
          />
        );
      }

      // Drawing strategy: instead of a rect per module, we're going to create a
      // single path for the dark modules and layer that on top of a light rect,
      // for a total of 2 DOM nodes. We pay a bit more in string concat but that's
      // way faster than DOM ops.
      // For level 1, 441 nodes -> 2
      // For level 40, 31329 -> 2
      fgPath = generatePath(cells, margin);
    });

    return () => {
      const bgColor = props.bgColor && DEFAULT_BGCOLOR;
      const fgColor = props.fgColor && DEFAULT_FGCOLOR;
      return (
        <svg height={props.size} width={props.size} viewBox={`0 0 ${numCells} ${numCells}`}>
          {!!props.title && <title>{props.title}</title>}
          <path
            fill={bgColor}
            d={`M0,0 h${numCells}v${numCells}H0z`}
            shape-rendering="crispEdges"
          />
          <path fill={fgColor} d={fgPath} shape-rendering="crispEdges" />
          {image}
        </svg>
      );
    };
  },
});
