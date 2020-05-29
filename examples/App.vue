<template>
  <a-config-provider :locale="locale">
    <div>
      <a-radio-group :value="locale" @change="changeLocale">
        <a-radio-button key="en" :value="enUS">
          English
        </a-radio-button>
        <a-radio-button key="cn" :value="zhCN">
          中文
        </a-radio-button>
      </a-radio-group>
      <div><h4>v-model: <input v-model="color" type="text"></h4><a-color-picker v-model="color" style="width:130px" @show="changeHandler" /></div>
      <div><h4>v-model:{{ color }}</h4><a-color-picker v-model="color" style="width:130px" @show="changeHandler" /></div>
      <div><h4>备选颜色</h4><a-color-picker :config="config1" /></div>
      <div><h4>多种输入格式</h4><a-color-picker :config="config2" :get-popup-container="node=>node.parentNode" /></div>
      <div>
        <button @click="config2.components.preview = !config2.components.preview">
          修改config
        </button>
      </div>
      <div><h4>多种尺寸</h4><a-color-picker size="large" /></div>
      <div><a-color-picker size="small" /></div>
      <div><h4>切换禁用</h4><a-color-picker :disabled="disabled" /></div>
      <div>
        <button @click="disabled = !disabled">
          切换
        </button>
      </div>
      <div><h4>切换格式 [color:{{ color2 }}]</h4><a-color-picker v-model="color2" :locale="zhCN" :format="format" /></div>
      <div>
        <button @click="format = 'HEX'">
          HEX
        </button>
        <button @click="format = 'RGBA'">
          RGBA
        </button>
        <button @click="format = 'HSVA'">
          HSVA
        </button>
        <button @click="format = 'HSLA'">
          HSLA
        </button>
        <button @click="format = 'CMYK'">
          CMYK
        </button>
      </div>
    </div>
  </a-config-provider>
</template>

<script>
import enUS from 'ant-design-vue/../components/locale/en_US';
import zhCN from 'ant-design-vue/../components/locale/zh_CN';
export default {
  name: 'Demo',
  data () {
    return {
      color:'#ccc',
      color2:'#ccc',
      disabled:false,
      format:'',
      locale: enUS,
      enUS,
      zhCN,
      config1:{
        swatches: [
          'rgba(244, 67, 54, 1)',
          'rgba(233, 30, 99, 0.95)',
          'rgba(156, 39, 176, 0.9)',
          'rgba(103, 58, 183, 0.85)',
          'rgba(63, 81, 181, 0.8)',
          'rgba(33, 150, 243, 0.75)',
          'rgba(3, 169, 244, 0.7)',
          'rgba(0, 188, 212, 0.7)',
          'rgba(0, 150, 136, 0.75)',
          'rgba(76, 175, 80, 0.8)',
          'rgba(139, 195, 74, 0.85)',
          'rgba(205, 220, 57, 0.9)',
          'rgba(255, 235, 59, 0.95)',
          'rgba(255, 193, 7, 1)',
      ],
      },
      config2:{
        components: {
          // Main components
            preview: true,
            opacity: true,
            hue: true,
          interaction: {
                hex: true,
                rgba: true,
                hsla: true,
                hsva: true,
                cmyk: true,
                input: true,
                clear: true,
                save: true,
            },
            strings: {
                save: 'Save',
                clear: 'Clear',
                cancel: 'Cancel',
            },
        },
      },
    };
  },
  methods:{
    changeHandler(...arg){
      arg;
      // console.log(arg);
    },
    changeLocale(e) {
      const localeValue = e.target.value;
      this.locale = localeValue;
    },
  },
};
</script>
