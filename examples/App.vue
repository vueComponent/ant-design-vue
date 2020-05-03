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


      <br/>
      <br/>
      <table class="conf">
        <tr>
          <td>
            <a-dropdown :trigger="['click']">
              <a-button>Открывашка</a-button>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a target="_blank" rel="noopener noreferrer" href="#">Первый пункт</a>
                </a-menu-item>
                <a-menu-item>
                  <a target="_blank" rel="noopener noreferrer" href="#">Второй пункт</a>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item>
                  <a target="_blank" rel="noopener noreferrer" href="#">Третий пункт</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </td>
          <td>
            <a-dropdown :trigger="['click']">
              <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                Click me <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a target="_blank" rel="noopener noreferrer" href="#">Первый пункт</a>
                </a-menu-item>
                <a-menu-item>
                  <a target="_blank" rel="noopener noreferrer" href="#">Второй пункт</a>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item>
                  <a target="_blank" rel="noopener noreferrer" href="#">Третий пункт</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </td>
        </tr>
      </table>

      <br/>
      <br/>

      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="Tab 1">
          Tab 1
        </a-tab-pane>
        <a-tab-pane key="2" tab="Tab 2">
          Tab 2
        </a-tab-pane>
        <a-tab-pane key="3" tab="Tab 3">
          Tab 3
        </a-tab-pane>
        <a-tab-pane key="4" tab="Tab 4" disabled>
          Tab 4
        </a-tab-pane>
      </a-tabs>

      <br/>
      <br/>
      <h2>Popover</h2>

      <div style="padding: 50px 200px;">
        <table class="conf">
          <tr>
            <td>&nbsp;</td>
            <td>
              <a-popover placement="topLeft">
                <template slot="content">
                  <p>Content</p>
                  <p>Content</p>
                </template>
                <template slot="title">
                  <span>Title</span>
                </template>
                <a-button>TL</a-button>
              </a-popover>
            </td>
            <td>
              <a-popover placement="top" visible="true">
                <template slot="content">
                  <p>Content</p>
                  <p>Content</p>
                </template>
                <template slot="title">
                  <span>Title</span>
                </template>
                <a-button>Top</a-button>
              </a-popover>
            </td>
            <td>
              <a-popover placement="topRight">
                <template slot="content">
                  <p>Content</p>
                  <p>Content</p>
                </template>
                <template slot="title">
                  <span>Title</span>
                </template>
                <a-button>TR</a-button>
              </a-popover>
            </td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td><a-popover placement="leftTop">
              <template slot="content">
                <p>Content</p>
                <p>Content</p>
              </template>
              <template slot="title">
                <span>Title</span>
              </template>
              <a-button>LT</a-button>
            </a-popover></td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>
              <a-popover placement="rightTop">
                <template slot="content">
                  <p>Content</p>
                  <p>Content</p>
                </template>
                <template slot="title">
                  <span>Title</span>
                </template>
                <a-button>RT</a-button>
              </a-popover>
            </td>
          </tr>
          <tr>
            <td>
              <a-popover placement="left">
                <template slot="content">
                  <p>Content</p>
                  <p>Content</p>
                </template>
                <template slot="title">
                  <span>Title</span>
                </template>
                <a-button>Left</a-button>
              </a-popover>
            </td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>
              <a-popover placement="right" visible="true">
                <template slot="content">
                  <p>Content</p>
                  <p>Content</p>
                </template>
                <template slot="title">
                  <span>Title</span>
                </template>
                <a-button>Right</a-button>
              </a-popover>
            </td>
          </tr>
          <tr>
            <td>
              <a-popover placement="leftBottom">
                <template slot="content">
                  <p>Content</p>
                  <p>Content</p>
                </template>
                <template slot="title">
                  <span>Title</span>
                </template>
                <a-button>LB</a-button>
              </a-popover>
            </td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>
              <a-popover placement="rightBottom">
                <template slot="content">
                  <p>Content</p>
                  <p>Content</p>
                </template>
                <template slot="title">
                  <span>Title</span>
                </template>
                <a-button>RB</a-button>
              </a-popover>
            </td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>
              <a-popover placement="bottomLeft">
                <template slot="content">
                  <p>Content</p>
                  <p>Content</p>
                </template>
                <template slot="title">
                  <span>Title</span>
                </template>
                <a-button>BL</a-button>
              </a-popover>
            </td>
            <td>
              <a-popover placement="bottom">
                <template slot="content">
                  <p>Content</p>
                  <p>Content</p>
                </template>
                <template slot="title">
                  <span>Title</span>
                </template>
                <a-button>Bottom</a-button>
              </a-popover>
            </td>
            <td>
              <a-popover placement="bottomRight">
                <template slot="content">
                  <p>Content</p>
                  <p>Content</p>
                </template>
                <template slot="title">
                  <span>Title</span>
                </template>
                <a-button>BR</a-button>
              </a-popover>
            </td>
            <td>&nbsp;</td>
          </tr>
        </table>
      </div>

      <br/>
      <br/>
      <h2>Tooltip</h2>

      <div style="padding: 50px 200px;">
        <table class="conf">
          <tr>
            <td>&nbsp;</td>
            <td>
              <a-tooltip placement="topLeft">
                <template slot="title">
                  <span>Текст подсказки</span>
                </template>
                <a-button>TL</a-button>
              </a-tooltip>
            </td>
            <td>
              <a-tooltip placement="top" visible="true">
                <template slot="title">
                  <span>Текст подсказки</span>
                </template>
                <a-button>Top</a-button>
              </a-tooltip>
            </td>
            <td>
              <a-tooltip placement="topRight">
                <template slot="title">
                  <span>Текст подсказки</span>
                </template>
                <a-button>TR</a-button>
              </a-tooltip>
            </td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>
              <a-tooltip placement="leftTop">
                <template slot="title">
                  <span>prompt<br/>text</span>
                </template>
                <a-button>LT</a-button>
              </a-tooltip>
            </td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>
              <a-tooltip placement="rightTop">
                <template slot="title">
                  <span>prompt<br/>text</span>
                </template>
                <a-button>RT</a-button>
              </a-tooltip>
            </td>
          </tr>
          <tr>
            <td>
              <a-tooltip placement="left" visible="true">
                <template slot="title">
                  <span>Текст подсказки</span>
                </template>
                <a-button>Left</a-button>
              </a-tooltip>
            </td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>
              <a-tooltip placement="right" visible="true">
                <template slot="title">
                  <span>Текст подсказки</span>
                </template>
                <a-button>Right</a-button>
              </a-tooltip>
            </td>
          </tr>
          <tr>
            <td>
              <a-tooltip placement="leftBottom">
                <template slot="title">
                  <span>prompt<br/>text</span>
                </template>
                <a-button>LB</a-button>
              </a-tooltip>
            </td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>
              <a-tooltip placement="rightBottom">
                <template slot="title">
                  <span>prompt<br/>text</span>
                </template>
                <a-button>RB</a-button>
              </a-tooltip>
            </td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>
              <a-tooltip placement="bottomLeft">
                <template slot="title">
                  <span>Текст подсказки</span>
                </template>
                <a-button>BL</a-button>
              </a-tooltip>
            </td>
            <td>
              <a-tooltip placement="bottom" visible="true">
                <template slot="title">
                  <span>Текст подсказки</span>
                </template>
                <a-button>Bottom</a-button>
              </a-tooltip>
            </td>
            <td>
              <a-tooltip placement="bottomRight">
                <template slot="title">
                  <span>Текст подсказки</span>
                </template>
                <a-button>BR</a-button>
              </a-tooltip>
            </td>
            <td>&nbsp;</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Demo',
};
</script>
