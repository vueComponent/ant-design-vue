import { defineComponent, onMounted, ref, watch } from 'vue';
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
    value: { type: String, required: true },
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
    watch(
      () => props.size,
      newSize => {
        createQRCode(newSize);
      },
    );
    watch(
      () => props.errorLevel,
      newLevel => {
        createQRCode(props.size, newLevel);
      },
    );
    const createQRCode = (width = props.size, level = props.errorLevel) => {
      const options: QRCodeCanvasOptions = {
        errorCorrectionLevel: level || getErrorCorrectionLevel(props.value),
        margin: 0,
        width,
        color: { dark: props.color },
      };
      toCanvas(qrcodeCanvasRef.value, props.value, options);
      if (props.icon) {
        const ctx = qrcodeCanvasRef.value.getContext('2d');
        const image = new Image(props.iconSize, props.iconSize);
        image.src = props.icon;
        image.onload = () => {
          /*
            drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
            sx,sy 在画布指定位置绘制
            sw,sh 被剪切的部分
            dx,dy 在目标画布的起点位置
            dw,dh 在目标画布绘制的宽高
          */
          ctx.drawImage(qrcodeCanvasRef.value, 0, 0, width, width);
          const center = (width - props.iconSize) / 2;
          ctx.drawImage(image, center, center, props.iconSize, props.iconSize);
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
    const pre = prefixCls.value;
    const toDataUrl = async () => {
      return await toDataURL(props.value);
    };
    expose({ toDataUrl });
    return () => {
      return wrapSSR(
        <div
          style={{ width: props.size + 'px', height: props.size + 'px' }}
          class={classNames(hashId.value, pre, {
            [`${prefixCls}-borderless`]: !props.bordered,
          })}
        >
          {props.status !== 'active' && (
            <div class={classNames(`${pre}-mask`)}>
              {props.status === 'loading' && <Spin />}
              {props.status === 'expired' && (
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
