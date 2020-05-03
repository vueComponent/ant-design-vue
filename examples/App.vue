<template>
  <div>
    <div style="padding: 40px">
      <table class="conf">
        <tr>
          <td><a-input size="small" placeholder="Текст"></a-input></td>
          <td><a-button type="primary" size="small" icon="container">Кнопка</a-button></td>
          <td>
            <a-radio-group default-value="1" size="small">
              <a-radio-button value="1">1</a-radio-button>
              <a-radio-button value="2">2</a-radio-button>
              <a-radio-button value="3">3</a-radio-button>
            </a-radio-group>
          </td>
          <td>
            <a-select default-value="lucy" size="small">
              <a-select-option value="jack">Jack</a-select-option>
              <a-select-option value="lucy">Lucy11</a-select-option>
            </a-select>
          </td>
          <td><a-date-picker size="small" format="DD.MM.YYYY"/></td>
          <td><a-input-number size="small" :min="8" :max="12" :value="10"></a-input-number></td>
          <td style="vertical-align: middle;"><a-switch checked-children="1" un-checked-children="0" size="small" v-decorator="['switch', { valuePropName: 'checked' }]" /></td>
          <td style="vertical-align: middle;"><a-switch loading checked size="small" v-decorator="['switch', { valuePropName: 'checked' }]" /></td>
          <td style="vertical-align: middle;"><a-switch disabled checked size="small" v-decorator="['switch', { valuePropName: 'checked' }]" /></td>
        </tr>
        <tr>
          <td><a-input placeholder="Текст"></a-input></td>
          <td><a-button type="primary" icon="container">Кнопка</a-button></td>
          <td>
            <a-radio-group default-value="1" size="default">
              <a-radio-button value="1">1</a-radio-button>
              <a-radio-button value="2">2</a-radio-button>
              <a-radio-button value="3">3</a-radio-button>
            </a-radio-group>
          </td>
          <td>
            <a-select default-value="lucy">
              <a-select-option value="jack">Jack</a-select-option>
              <a-select-option value="lucy">Lucy11</a-select-option>
            </a-select>
          </td>
          <td><a-date-picker/></td>
          <td><a-input-number :min="8" :max="12" :value="10"></a-input-number></td>
          <td style="vertical-align: middle;"><a-switch checked-children="1" un-checked-children="0" v-decorator="['switch', { valuePropName: 'checked' }]" /></td>
          <td style="vertical-align: middle;"><a-switch loading v-decorator="['switch', { valuePropName: 'checked' }]" /></td>
          <td style="vertical-align: middle;"><a-switch disabled v-decorator="['switch', { valuePropName: 'checked' }]" /></td>
        </tr>
        <tr>
          <td><a-input size="large" placeholder="Текст"></a-input></td>
          <td><a-button type="primary" size="large" icon="container">Кнопка</a-button></td>
          <td>
            <a-radio-group default-value="1" size="large">
              <a-radio-button value="1">1</a-radio-button>
              <a-radio-button value="2">2</a-radio-button>
              <a-radio-button value="3">3</a-radio-button>
            </a-radio-group>
          </td>
          <td>
            <a-select default-value="lucy" size="large">
              <a-select-option value="jack">Jack</a-select-option>
              <a-select-option value="lucy">Lucy11</a-select-option>
            </a-select>
          </td>
          <td><a-date-picker size="large"/></td>
          <td><a-input-number size="large" :min="8" :max="12" :value="10"></a-input-number></td>
          <td style="vertical-align: middle;"><a-switch size="large" v-decorator="['switch', { valuePropName: 'checked' }]" /></td>
          <td style="vertical-align: middle;"><a-switch checked size="large" loading v-decorator="['switch', { valuePropName: 'checked' }]" /></td>
          <td style="vertical-align: middle;"><a-switch size="large" disabled v-decorator="['switch', { valuePropName: 'checked' }]" /></td>
        </tr>
      </table>

      <br/>
      <br/>

      <a-button type="dashed">
        Dashed
      </a-button>
      <a-button type="danger">
        Danger
      </a-button>
      <a-button type="primary">
        按钮
      </a-button>
      <a href="#" class="ant-btn"><span>Кнопка-ссылка</span></a>
      <a href="#" class="ant-btn" disabled><span>Кнопка-ссылка</span></a>
      <a-button type="link">
        Link
      </a-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Demo',
};
</script>
