import { defineComponent, onMounted, ref, toRefs, watch } from 'vue';
import type { ExtractPropTypes } from 'vue';
import classNames from '../_util/classNames';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { initDefaultProps } from '../_util/props-util';
import useStyle from './style';
import { useLocaleReceiver } from '../locale/LocaleReceiver';
import defaultLocale from '../locale/en_US';
import { toCanvas, toDataURL } from 'qrcode';
import { withInstall } from '../_util/type';
import Spin from '../spin';
import Button from '../button';
import { ReloadOutlined } from '@ant-design/icons-vue';
import { useToken } from '../theme/internal';

interface QRCodeCanvasColor {
  dark?: string; // 默认#000000ff
  light?: string; // 默认#ffffffff
}
interface QRCodeCanvasOptions {
  version?: number;
  errorCorrectionLevel?: string; // 默认"M"
  maskPattern?: number; // 遮罩符号的掩码图案
  toSJISFunc?: Function; // 将汉字转换为其 Shift JIS 值的帮助程序函数
  margin?: number;
  scale?: number;
  small?: boolean;
  width: number;
  color?: QRCodeCanvasColor;
}
const qrcodeProps = () => {
  return {
    value: String,
    errorLevel: String,
    size: { type: Number, default: 160 },
    icon: String,
    iconSize: { type: Number, default: 40 },
    color: String,
    status: { type: String, default: 'active' },
    bordered: { type: Boolean, default: true },
  };
};
export type QRCodeProps = Partial<ExtractPropTypes<ReturnType<typeof qrcodeProps>>>;
const canvasProps = () => {
  return {
    value: String,
    errorLevel: { type: String, default: 'M' },
    size: Number,
    icon: String,
    iconSize: { type: Number, default: 40 },
    color: { type: String, default: '#000000ff' },
  };
};
const QRCodeCanvas = defineComponent({
  name: 'QRCodeCanvas',
  props: initDefaultProps(canvasProps(), {}),
  setup(props) {
    const qrcodeCanvasRef = ref();
    const { size, value, errorLevel, icon, iconSize, color } = toRefs(props);
    watch(size, newSize => {
      createQRCode(newSize);
    });
    watch(errorLevel, newLevel => {
      createQRCode(size.value, newLevel);
    });
    const createQRCode = (width = size.value, level = errorLevel.value) => {
      const options: QRCodeCanvasOptions = {
        errorCorrectionLevel: level || getErrorCorrectionLevel(value.value),
        margin: 0,
        width,
        color: { dark: color.value },
      };
      toCanvas(qrcodeCanvasRef.value, value.value, options);
      if (icon.value) {
        const ctx = qrcodeCanvasRef.value.getContext('2d');
        const image = new Image(iconSize.value, iconSize.value);
        image.src = icon.value;
        image.style.backgroundColor = '#000';
        image.onload = () => {
          /*
            drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
            sx,sy 在画布指定位置绘制
            sw,sh 被剪切的部分
            dx,dy 在目标画布的起点位置
            dw,dh 在目标画布绘制的宽高
          */
          ctx.drawImage(qrcodeCanvasRef.value, 0, 0, width, width);
          const center = (width - iconSize.value) / 2;
          ctx.drawImage(image, center, center, iconSize.value, iconSize.value);
        };
      }
    };
    function getErrorCorrectionLevel(content) {
      if (content.length > 36) {
        return 'M';
      } else if (content.length > 16) {
        return 'Q';
      } else {
        return 'H';
      }
    }
    onMounted(() => {
      createQRCode();
    });
    return () => (
      <>
        <canvas ref={qrcodeCanvasRef} />
      </>
    );
  },
});
const QRCode = defineComponent({
  name: 'AQrcode',
  props: initDefaultProps(qrcodeProps(), {}),
  emits: ['refresh'],
  setup(props, { emit, expose }) {
    const [locale] = useLocaleReceiver('QRCode', defaultLocale.QRCode);
    const { prefixCls } = useConfigInject('qrcode', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const [, token] = useToken();
    const { value, size, status, bordered } = toRefs(props);
    const pre = prefixCls.value;
    const toDataUrl = async () => {
      return await toDataURL(value.value);
    };
    expose({ toDataUrl });
    return () => {
      return wrapSSR(
        <div
          style={{ width: size.value + 'px', height: size.value + 'px' }}
          class={classNames(hashId.value, pre, {
            [`${prefixCls}-borderless`]: !bordered.value,
          })}
        >
          {status.value !== 'active' && (
            <div class={classNames(`${pre}-mask`)}>
              {status.value === 'loading' && <Spin />}
              {status.value === 'expired' && (
                <>
                  <p class={classNames(`${pre}-expired`)}>{locale.value.expired}</p>
                  <Button type="link" onClick={() => emit('refresh')}>
                    <ReloadOutlined />
                    {locale.value.refresh}
                  </Button>
                </>
              )}
            </div>
          )}
          <QRCodeCanvas
            value={props.value}
            errorLevel={props.errorLevel}
            size={props.size - (token.value.paddingSM + token.value.lineWidth) * 2}
            icon={props.icon}
            iconSize={props.iconSize}
            color={props.color}
          />
        </div>,
      );
    };
  },
});
export default withInstall(QRCode);
