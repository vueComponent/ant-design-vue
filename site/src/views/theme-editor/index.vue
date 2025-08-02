<template>
  <Header />
  <div class="theme-editor">
    <a-config-provider :theme="{ inherit: false }">
      <div class="theme-editor-header">
        <div class="theme-editor-title">
          <a-typography-title :level="5" :style="{ margin: 0 }">
            {{ locale.title }}
          </a-typography-title>
          <!-- 状态标识标签 -->
          <a-tag
            :color="currentThemeSource === 'local' ? 'blue' : 'green'"
            class="theme-source-tag"
          >
            {{
              currentThemeSource === 'local'
                ? locale.localCache
                : `${locale.cloudTheme}: ${currentThemeName}`
            }}
          </a-tag>
        </div>

        <!-- 中间图标区域 -->
        <div class="theme-editor-icons">
          <a-tooltip :title="locale.loadFromCloud">
            <div class="icon-button" @click="handleLoadFromCloud">
              <template v-if="currentThemeSource === 'cloud'">
                <PhCloudCheck :size="20" weight="regular" />
              </template>
              <template v-else>
                <PhCloudArrowDown :size="20" weight="regular" />
              </template>
            </div>
          </a-tooltip>
          <a-tooltip
            :title="currentThemeSource === 'local' ? locale.saveToCloud : locale.updateToCloud"
          >
            <div class="icon-button" @click="handleSaveToCloud">
              <template v-if="currentThemeSource === 'local'">
                <PhCloudArrowUp :size="20" weight="regular" />
              </template>
              <template v-else>
                <a-badge
                  :dot="currentThemeSource === 'cloud' && hasCloudThemeModified"
                  color="#52c41a"
                >
                  <PhArrowsClockwise :size="20" weight="regular" />
                </a-badge>
              </template>
            </div>
          </a-tooltip>
          <a-tooltip :title="locale.exportJson">
            <div class="icon-button" @click="handleExportJson">
              <PhDownloadSimple :size="20" weight="regular" />
            </div>
          </a-tooltip>
        </div>

        <div class="theme-editor-actions">
          <!-- 编辑主题配置弹窗 -->
          <a-modal
            v-model:open="editModelOpen"
            :title="locale.editModelTitle"
            :width="600"
            :ok-text="locale.save"
            @ok="editSave"
            @cancel="editModelClose"
          >
            <Suspense>
              <template #fallback>
                <div :style="{ textAlign: 'center', width: '100%', padding: '24px 0' }">
                  <a-spin :tip="locale.initialEditor" />
                </div>
              </template>
              <template #default>
                <JSONEditor
                  :content="themeConfigContent"
                  :on-change="handleEditConfigChange"
                  :main-menu-bar="false"
                />
              </template>
            </Suspense>
          </a-modal>

          <!-- 保存到云端弹窗 -->
          <a-modal
            v-model:open="saveToCloudModalOpen"
            :title="
              currentThemeSource === 'local' ? locale.saveToCloudModalTitle : locale.updateToCloud
            "
            :width="500"
            :ok-text="locale.confirm"
            :cancel-text="locale.cancel"
            :confirm-loading="saveToCloudLoading"
            @ok="handleSaveToCloudConfirm"
            @cancel="handleSaveToCloudCancel"
          >
            <a-form :model="saveToCloudForm" layout="vertical">
              <a-form-item :label="locale.themeName" required>
                <a-input
                  v-model:value="saveToCloudForm.name"
                  :placeholder="locale.themeNamePlaceholder"
                  :disabled="currentThemeSource === 'cloud'"
                />
              </a-form-item>
              <a-form-item :label="locale.themeDescription">
                <a-textarea
                  v-model:value="saveToCloudForm.description"
                  :placeholder="locale.themeDescriptionPlaceholder"
                  :rows="3"
                />
              </a-form-item>
            </a-form>
          </a-modal>

          <!-- 从云端加载弹窗 -->
          <a-modal
            v-model:open="loadFromCloudModalOpen"
            :title="locale.loadFromCloudModalTitle"
            :width="800"
            :footer="null"
            @cancel="handleLoadFromCloudCancel"
          >
            <a-spin :spinning="loadFromCloudLoading">
              <div
                v-if="cloudThemeConfigs.length === 0 && !loadFromCloudLoading"
                style="text-align: center; padding: 40px 0"
              >
                <a-empty :description="locale.noThemeConfigs" />
              </div>
              <a-table
                v-else
                :columns="cloudThemeColumns"
                :data-source="cloudThemeConfigs"
                :pagination="false"
                size="small"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'createdAt'">
                    {{ formatDate(record.created_at) }}
                  </template>
                  <template v-else-if="column.key === 'updatedAt'">
                    {{ formatDate(record.updated_at) }}
                  </template>
                  <template v-else-if="column.key === 'actions'">
                    <a-space>
                      <a-button type="primary" size="small" @click="handleLoadThemeConfig(record)">
                        {{ locale.load }}
                      </a-button>
                      <a-popconfirm
                        :title="locale.confirmDelete"
                        @confirm="handleDeleteThemeConfig(record.id)"
                      >
                        <a-button type="primary" danger size="small">
                          {{ locale.delete }}
                        </a-button>
                      </a-popconfirm>
                    </a-space>
                  </template>
                </template>
              </a-table>
            </a-spin>
          </a-modal>

          <a-button class="theme-editor-header-actions" @click="handleExport">
            {{ locale.export }}
          </a-button>
          <a-button class="theme-editor-header-actions" @click="handleEditConfig">
            {{ locale.edit }}
          </a-button>
          <a-button type="primary" class="theme-editor-header-actions" @click="handleSave">
            {{ locale.save }}
          </a-button>
        </div>
      </div>
      <ThemeEditor
        :theme="{ name: 'Custom Theme', key: 'test', config: theme }"
        :style="{ height: 'calc(100vh - 64px - 56px)' }"
        :locale="lang === 'cn' ? zhCN : enUS"
        @themeChange="handleThemeChange"
      />
    </a-config-provider>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, ref, watch, onMounted, nextTick } from 'vue';
import { message } from 'ant-design-vue';
import { useLocale } from '../../i18n';
import locales from './locales';

import Header from '../../layouts/header/index.vue';

// 导入 Phosphor Icons
import {
  PhCloudArrowDown,
  PhCloudArrowUp,
  PhArrowsClockwise,
  PhDownloadSimple,
  PhCloudCheck,
} from '@phosphor-icons/vue';

// antd换肤编辑器
import { enUS, ThemeEditor, zhCN } from '../../components/antdv-token-previewer';
import getDesignToken from '../../components/antdv-token-previewer/utils/getDesignToken';
import { seedRelatedMap } from '../../components/antdv-token-previewer/meta/TokenRelation';
import seedToken from 'ant-design-vue/es/theme/themes/seed';

// Supabase 服务
import { ThemeConfigService } from '../../utils/supabase';

import type { ThemeConfig } from '../../../../components/config-provider/context';

const ANT_DESIGN_VUE_V4_THEME_EDITOR_THEME = 'ant-design-vue-v4-theme-editor-theme';

function isObject(target: any) {
  return Object.prototype.toString.call(target) === '[object Object]';
}

// 格式化日期
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default defineComponent({
  name: 'CustomTheme',
  components: {
    Header,
    ThemeEditor,
    JSONEditor: defineAsyncComponent(() => import('./JSONEditor/index.vue')), // 异步组件加载json编辑器
    // 注册 Phosphor Icons 组件
    PhCloudArrowDown,
    PhCloudArrowUp,
    PhArrowsClockwise,
    PhDownloadSimple,
    PhCloudCheck,
  },
  setup() {
    // 国际化
    const [locale, lang] = useLocale(locales);

    // 换肤
    const theme = ref<ThemeConfig>({});

    const editModelOpen = ref<boolean>(false);
    const editThemeFormatRight = ref<boolean>(true);
    const themeConfigContent = ref({
      text: '{}',
      json: undefined,
    });

    // 当前主题状态管理
    const currentThemeSource = ref<'local' | 'cloud'>('local'); // 'local' 表示本地缓存，'cloud' 表示云端主题
    const currentThemeName = ref<string>(''); // 当前云端主题名称
    const currentThemeId = ref<string>(''); // 当前云端主题ID
    const hasCloudThemeModified = ref<boolean>(false); // 云端主题是否有修改

    // 云端保存相关状态
    const saveToCloudModalOpen = ref<boolean>(false);
    const saveToCloudLoading = ref<boolean>(false);
    const saveToCloudForm = ref({
      name: '',
      description: '',
    });

    // 云端加载相关状态
    const loadFromCloudModalOpen = ref<boolean>(false);
    const loadFromCloudLoading = ref<boolean>(false);
    const cloudThemeConfigs = ref([]);

    // 云端主题配置表格列定义
    const cloudThemeColumns = [
      {
        title: locale.value.themeName,
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: locale.value.themeDescription,
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
      },
      {
        title: locale.value.createdAt,
        key: 'createdAt',
        width: 150,
      },
      {
        title: locale.value.updatedAt,
        key: 'updatedAt',
        width: 150,
      },
      {
        title: locale.value.actions,
        key: 'actions',
        width: 120,
      },
    ];

    const getTheme = () => {
      const storedConfig = localStorage.getItem(ANT_DESIGN_VUE_V4_THEME_EDITOR_THEME);
      if (storedConfig) {
        theme.value = JSON.parse(storedConfig);
      }
    };

    const setTheme = theme => {
      localStorage.setItem(ANT_DESIGN_VUE_V4_THEME_EDITOR_THEME, JSON.stringify(theme));
    };

    const editModelClose = () => {
      editModelOpen.value = false;
    };

    const editSave = () => {
      if (!editThemeFormatRight.value) {
        message.error(locale.value.editJsonContentTypeError);
        return;
      }
      const themeConfig = themeConfigContent.value.text
        ? JSON.parse(themeConfigContent.value.text)
        : themeConfigContent.value.json;

      if (!isObject(themeConfig)) {
        message.error(locale.value.editJsonContentTypeError);
        return;
      }
      theme.value = themeConfig;
      editModelClose();
      message.success(locale.value.editSuccessfully);
    };

    const handleSave = () => {
      setTheme(theme.value);
      message.success(locale.value.saveSuccessfully);
    };

    const handleEditConfig = () => {
      editModelOpen.value = true;
    };

    const handleEditConfigChange = (newcontent, _, status) => {
      themeConfigContent.value = newcontent;
      if (status.contentErrors && status.contentErrors.parseError) {
        editThemeFormatRight.value = false;
      } else {
        editThemeFormatRight.value = true;
      }
    };

    // 云端保存相关方法
    const handleSaveToCloud = () => {
      if (currentThemeSource.value === 'cloud') {
        // 如果是云端主题，预填充当前主题信息
        saveToCloudForm.value.name = currentThemeName.value;
        saveToCloudForm.value.description = ''; // 可以从当前主题获取描述
      } else {
        // 如果是本地缓存，清空表单
        saveToCloudForm.value.name = '';
        saveToCloudForm.value.description = '';
      }
      saveToCloudModalOpen.value = true;
    };

    const handleSaveToCloudCancel = () => {
      saveToCloudModalOpen.value = false;
    };

    const handleSaveToCloudConfirm = async () => {
      if (!saveToCloudForm.value.name.trim()) {
        message.error('请输入主题名称');
        return;
      }

      saveToCloudLoading.value = true;
      try {
        let result;

        if (currentThemeSource.value === 'cloud' && currentThemeId.value) {
          // 更新现有的云端主题
          result = await ThemeConfigService.updateThemeConfig(
            currentThemeId.value,
            theme.value,
            saveToCloudForm.value.name.trim(),
            saveToCloudForm.value.description.trim(),
          );

          if (result.success) {
            message.success(locale.value.updateToCloudSuccessfully);
            // 更新当前主题信息
            currentThemeName.value = saveToCloudForm.value.name.trim();
            hasCloudThemeModified.value = false; // 重置修改状态
          } else {
            message.error(result.message || locale.value.updateToCloudFailed);
          }
        } else {
          // 创建新的云端主题
          result = await ThemeConfigService.saveThemeConfig(
            theme.value,
            saveToCloudForm.value.name.trim(),
            saveToCloudForm.value.description.trim(),
          );

          if (result.success) {
            message.success(locale.value.saveToCloudSuccessfully);
            // 切换到云端主题状态
            currentThemeSource.value = 'cloud';
            currentThemeName.value = saveToCloudForm.value.name.trim();
            currentThemeId.value = result.data.id;
            hasCloudThemeModified.value = false; // 重置修改状态
          } else {
            message.error(result.message || locale.value.saveToCloudFailed);
          }
        }

        if (result.success) {
          saveToCloudModalOpen.value = false;
        }
      } catch (error) {
        console.error('保存到云端失败:', error);
        const errorMessage =
          currentThemeSource.value === 'cloud'
            ? locale.value.updateToCloudFailed
            : locale.value.saveToCloudFailed;
        message.error(errorMessage);
      } finally {
        saveToCloudLoading.value = false;
      }
    };

    // 云端加载相关方法
    const handleLoadFromCloud = async () => {
      loadFromCloudModalOpen.value = true;
      loadFromCloudLoading.value = true;

      try {
        const result = await ThemeConfigService.getAllThemeConfigs();
        if (result.success) {
          cloudThemeConfigs.value = result.data;
        } else {
          message.error(result.message || locale.value.loadFromCloudFailed);
        }
      } catch (error) {
        console.error('从云端加载失败:', error);
        message.error(locale.value.loadFromCloudFailed);
      } finally {
        loadFromCloudLoading.value = false;
      }
    };

    const handleLoadFromCloudCancel = () => {
      loadFromCloudModalOpen.value = false;
    };

    const handleLoadThemeConfig = record => {
      theme.value = record.config;
      setTheme(record.config);

      // 更新当前主题状态
      currentThemeSource.value = 'cloud';
      currentThemeName.value = record.name;
      currentThemeId.value = record.id;
      hasCloudThemeModified.value = false; // 重置修改状态

      message.success(locale.value.loadFromCloudSuccessfully);
      loadFromCloudModalOpen.value = false;
    };

    const handleDeleteThemeConfig = async id => {
      try {
        const result = await ThemeConfigService.deleteThemeConfig(id);
        if (result.success) {
          message.success(locale.value.deleteSuccessfully);

          // 如果删除的是当前正在使用的主题，切换回本地缓存状态
          if (currentThemeId.value === id) {
            currentThemeSource.value = 'local';
            currentThemeName.value = '';
            currentThemeId.value = '';
            hasCloudThemeModified.value = false;
          }

          // 重新加载列表
          const refreshResult = await ThemeConfigService.getAllThemeConfigs();
          if (refreshResult.success) {
            cloudThemeConfigs.value = refreshResult.data;
          }
        } else {
          message.error(result.message || locale.value.deleteFailed);
        }
      } catch (error) {
        console.error('删除失败:', error);
        message.error(locale.value.deleteFailed);
      }
    };

    /**
     * 导出主题配置文件
     */
    const handleExport = () => {
      // 根据主题来源生成文件名
      let fileName = 'Ant Design Vue Theme.json';
      if (currentThemeSource.value === 'cloud' && currentThemeName.value) {
        fileName = `${currentThemeName.value}.json`;
      }

      const file = new File([JSON.stringify(theme.value, null, 2)], fileName, {
        type: 'text/json; charset=utf-8;',
      });
      const tmpLink = document.createElement('a');
      const objectUrl = URL.createObjectURL(file);

      tmpLink.href = objectUrl;
      tmpLink.download = file.name;
      document.body.appendChild(tmpLink);
      tmpLink.click();

      document.body.removeChild(tmpLink);
      URL.revokeObjectURL(objectUrl);
    };

    /**
     * 导出JSON文件，按照设计令牌标准格式，包含所有修改过的变量
     */
    const handleExportJson = () => {
      // 获取当前主题的token配置
      const currentToken = theme.value.token || {};

      // 获取默认的token值用于对比
      const defaultTokens = getDesignToken({
        token: {},
        algorithm: theme.value.algorithm,
        components: {},
      });

      // 获取完整的计算后的token值
      const computedTokens = getDesignToken({
        token: currentToken,
        algorithm: theme.value.algorithm,
        components: theme.value.components || {},
      });

      // 找出所有修改过的token（包括seed token和其他token）
      const modifiedTokens = {};

      // 检查所有当前token与默认值的差异
      Object.keys(computedTokens).forEach(key => {
        if (defaultTokens[key] !== computedTokens[key]) {
          modifiedTokens[key] = computedTokens[key];
        }
      });

      // 同时检查直接设置的token
      Object.keys(currentToken).forEach(key => {
        if (currentToken[key] !== undefined) {
          modifiedTokens[key] = computedTokens[key] || currentToken[key];
        }
      });

      // 如果没有修改任何token，提示用户
      if (Object.keys(modifiedTokens).length === 0) {
        console.warn('没有检测到任何修改的token');
        return;
      }

      console.log('检测到修改的token:', Object.keys(modifiedTokens));

      /**
       * 按照设计令牌标准格式组织数据
       * 参考格式：Colors/Neutral/Bg/colorBgContainer
       * @param {Object} tokens - 需要导出的token对象
       * @returns {Object} 格式化后的JSON结构
       */
      const formatTokensForExport = tokens => {
        const result = {
          Colors: {
            Neutral: {
              Text: {},
              Icon: {},
              Bg: {},
              Border: {},
              Fill: {},
            },
            Brand: {
              Primary: {},
              Success: {},
              Warning: {},
              Info: {},
              Error: {},
            },
          },
        };

        /**
         * 根据token名称确定其在结构中的位置
         * @param {string} tokenKey - token名称
         * @returns {Object} 包含分类路径的对象
         */
        const getTokenCategory = tokenKey => {
          // 主色相关 - 放在Brand.Primary下
          if (
            tokenKey.includes('Primary') ||
            tokenKey === 'colorPrimary' ||
            tokenKey === 'colorPrimaryBg' ||
            tokenKey === 'colorPrimaryBgHover' ||
            tokenKey === 'colorPrimaryBorder' ||
            tokenKey === 'colorPrimaryBorderHover' ||
            tokenKey === 'colorPrimaryHover' ||
            tokenKey === 'colorPrimaryActive' ||
            tokenKey === 'colorPrimaryText' ||
            tokenKey === 'colorPrimaryTextHover' ||
            tokenKey === 'colorPrimaryTextActive'
          ) {
            return { mainCategory: 'Brand', category: 'Primary', subcategory: null };
          }

          // 成功色相关 - 放在Brand.Success下
          if (
            tokenKey.includes('Success') ||
            tokenKey === 'colorSuccess' ||
            tokenKey === 'colorSuccessBg' ||
            tokenKey === 'colorSuccessBgHover' ||
            tokenKey === 'colorSuccessBorder' ||
            tokenKey === 'colorSuccessBorderHover' ||
            tokenKey === 'colorSuccessHover' ||
            tokenKey === 'colorSuccessActive' ||
            tokenKey === 'colorSuccessText' ||
            tokenKey === 'colorSuccessTextHover' ||
            tokenKey === 'colorSuccessTextActive'
          ) {
            return { mainCategory: 'Brand', category: 'Success', subcategory: null };
          }

          // 错误色相关 - 放在Brand.Error下
          if (
            tokenKey.includes('Error') ||
            tokenKey === 'colorError' ||
            tokenKey === 'colorErrorBg' ||
            tokenKey === 'colorErrorBgHover' ||
            tokenKey === 'colorErrorBorder' ||
            tokenKey === 'colorErrorBorderHover' ||
            tokenKey === 'colorErrorHover' ||
            tokenKey === 'colorErrorActive' ||
            tokenKey === 'colorErrorText' ||
            tokenKey === 'colorErrorTextHover' ||
            tokenKey === 'colorErrorTextActive'
          ) {
            return { mainCategory: 'Brand', category: 'Error', subcategory: null };
          }

          // 警告色相关 - 放在Brand.Warning下
          if (
            tokenKey.includes('Warning') ||
            tokenKey === 'colorWarning' ||
            tokenKey === 'colorWarningBg' ||
            tokenKey === 'colorWarningBgHover' ||
            tokenKey === 'colorWarningBorder' ||
            tokenKey === 'colorWarningBorderHover' ||
            tokenKey === 'colorWarningHover' ||
            tokenKey === 'colorWarningActive' ||
            tokenKey === 'colorWarningText' ||
            tokenKey === 'colorWarningTextHover' ||
            tokenKey === 'colorWarningTextActive'
          ) {
            return { mainCategory: 'Brand', category: 'Warning', subcategory: null };
          }

          // 信息色相关 - 放在Brand.Info下
          if (
            tokenKey.includes('Info') ||
            tokenKey === 'colorInfo' ||
            tokenKey === 'colorInfoBg' ||
            tokenKey === 'colorInfoBgHover' ||
            tokenKey === 'colorInfoBorder' ||
            tokenKey === 'colorInfoBorderHover' ||
            tokenKey === 'colorInfoHover' ||
            tokenKey === 'colorInfoActive' ||
            tokenKey === 'colorInfoText' ||
            tokenKey === 'colorInfoTextHover' ||
            tokenKey === 'colorInfoTextActive'
          ) {
            return { mainCategory: 'Brand', category: 'Info', subcategory: null };
          }

          // 链接色相关 - 放在Neutral.Text下
          if (
            tokenKey.includes('Link') ||
            tokenKey === 'colorLink' ||
            tokenKey === 'colorLinkHover' ||
            tokenKey === 'colorLinkActive'
          ) {
            return { mainCategory: 'Neutral', category: 'Text', subcategory: null };
          }

          // 文本相关 - 放在Neutral.Text下
          if (
            tokenKey.includes('Text') ||
            tokenKey === 'colorText' ||
            tokenKey === 'colorTextSecondary' ||
            tokenKey === 'colorTextTertiary' ||
            tokenKey === 'colorTextQuaternary' ||
            tokenKey === 'colorTextHeading' ||
            tokenKey === 'colorTextLabel' ||
            tokenKey === 'colorTextDescription' ||
            tokenKey === 'colorTextDisabled' ||
            tokenKey === 'colorTextPlaceholder' ||
            tokenKey === 'colorTextLightSolid'
          ) {
            return { mainCategory: 'Neutral', category: 'Text', subcategory: null };
          }

          // 图标相关 - 放在Neutral.Icon下
          if (
            tokenKey.includes('Icon') ||
            tokenKey === 'colorIcon' ||
            tokenKey === 'colorIconHover'
          ) {
            return { mainCategory: 'Neutral', category: 'Icon', subcategory: null };
          }

          // 背景相关 - 放在Neutral.Bg下
          if (
            tokenKey.includes('Bg') ||
            tokenKey === 'colorBgContainer' ||
            tokenKey === 'colorBgElevated' ||
            tokenKey === 'colorBgLayout' ||
            tokenKey === 'colorBgMask' ||
            tokenKey === 'colorBgSpotlight' ||
            tokenKey === 'colorBgBase' ||
            tokenKey === 'colorBgContainerDisabled' ||
            tokenKey === 'colorBgTextActive' ||
            tokenKey === 'colorBgTextHover' ||
            tokenKey === 'colorBorderBg'
          ) {
            return { mainCategory: 'Neutral', category: 'Bg', subcategory: null };
          }

          // 边框相关 - 放在Neutral.Border下
          if (
            tokenKey.includes('Border') ||
            tokenKey === 'colorBorder' ||
            tokenKey === 'colorBorderSecondary' ||
            tokenKey === 'colorSplit'
          ) {
            return { mainCategory: 'Neutral', category: 'Border', subcategory: null };
          }

          // 填充相关 - 放在Neutral.Fill下
          if (
            tokenKey.includes('Fill') ||
            tokenKey === 'colorFill' ||
            tokenKey === 'colorFillSecondary' ||
            tokenKey === 'colorFillTertiary' ||
            tokenKey === 'colorFillQuaternary' ||
            tokenKey === 'colorFillContent' ||
            tokenKey === 'colorFillContentHover' ||
            tokenKey === 'colorFillAlter' ||
            tokenKey === 'colorFillAlterSolid'
          ) {
            return { mainCategory: 'Neutral', category: 'Fill', subcategory: null };
          }

          // 默认放在Brand.Primary下
          return { mainCategory: 'Brand', category: 'Primary', subcategory: null };
        };

        Object.keys(tokens).forEach(tokenKey => {
          const tokenValue = tokens[tokenKey];
          const { mainCategory, category } = getTokenCategory(tokenKey);

          const tokenData = {
            $type: 'color',
            $value: tokenValue,
          };

          // 确保分类存在
          if (!result.Colors[mainCategory][category]) {
            result.Colors[mainCategory][category] = {};
          }

          result.Colors[mainCategory][category][tokenKey] = tokenData;
        });

        // 清理空的分类
        ['Neutral', 'Brand'].forEach(mainCat => {
          Object.keys(result.Colors[mainCat]).forEach(category => {
            if (Object.keys(result.Colors[mainCat][category]).length === 0) {
              delete result.Colors[mainCat][category];
            }
          });
          // 如果整个主分类都是空的，也删除它
          if (Object.keys(result.Colors[mainCat]).length === 0) {
            delete result.Colors[mainCat];
          }
        });

        return result;
      };

      const exportData = formatTokensForExport(modifiedTokens);

      // 根据主题来源生成文件名
      let fileName = 'Design Tokens.json';
      if (currentThemeSource.value === 'cloud' && currentThemeName.value) {
        fileName = `${currentThemeName.value}.json`;
      }

      const file = new File([JSON.stringify(exportData, null, 2)], fileName, {
        type: 'text/json; charset=utf-8;',
      });
      const tmpLink = document.createElement('a');
      const objectUrl = URL.createObjectURL(file);

      tmpLink.href = objectUrl;
      tmpLink.download = file.name;
      document.body.appendChild(tmpLink);
      tmpLink.click();

      document.body.removeChild(tmpLink);
      URL.revokeObjectURL(objectUrl);
    };

    const handleThemeChange = newTheme => {
      theme.value = newTheme.config;

      // 如果当前是云端主题，标记为已修改
      if (currentThemeSource.value === 'cloud') {
        hasCloudThemeModified.value = true;
      }
    };

    nextTick(() => {
      getTheme();
    });

    watch(editModelOpen, val => {
      if (!val) {
        themeConfigContent.value = {
          json: theme.value,
          text: undefined,
        } as any;
      }
    });

    watch(theme, val => {
      if (!editModelOpen.value) {
        themeConfigContent.value = {
          json: val,
          text: undefined,
        } as any;
      }
    });

    onMounted(() => {
      document.title = `${locale.value.title} - Ant Design Vue`;
    });

    return {
      locale,
      lang,
      formatDate,

      theme,
      handleThemeChange,

      editModelOpen,
      editThemeFormatRight,
      themeConfigContent,

      editModelClose,
      editSave,

      handleSave,
      handleEditConfig,
      handleEditConfigChange,
      handleExport,
      handleExportJson,

      // 当前主题状态
      currentThemeSource,
      currentThemeName,
      currentThemeId,
      hasCloudThemeModified,

      // 云端保存和加载相关
      saveToCloudModalOpen,
      saveToCloudLoading,
      saveToCloudForm,
      loadFromCloudModalOpen,
      loadFromCloudLoading,
      cloudThemeConfigs,
      cloudThemeColumns,

      handleSaveToCloud,
      handleSaveToCloudCancel,
      handleSaveToCloudConfirm,
      handleLoadFromCloud,
      handleLoadFromCloudCancel,
      handleLoadThemeConfig,
      handleDeleteThemeConfig,

      // 皮肤编辑器的国际化
      zhCN,
      enUS,

      // Phosphor Icons
      PhCloudArrowDown,
      PhCloudArrowUp,
      PhArrowsClockwise,
      PhDownloadSimple,
      PhCloudCheck,
    };
  },
});
</script>

<style lang="less">
.theme-editor {
  &-header {
    display: flex;
    height: 56px;
    align-items: center;
    padding: 0 24px;
    justify-content: space-between;
    border-bottom: 1px solid #f0f0f0;
    box-sizing: border-box;
    &-actions {
      margin-right: 8px;
      &:last-child {
        margin-right: 0;
      }
    }
  }

  &-title {
    display: flex;
    align-items: center;
    gap: 12px;

    .theme-source-tag {
      font-size: 12px;
      margin: 0;
    }
  }

  &-icons {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  &-actions {
    display: flex;
    align-items: center;
  }
}

.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  margin-right: 0;
  padding: 4px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-color);
  background: transparent;

  &:hover {
    background: rgba(0, 0, 0, 0.06);
  }
}

[data-theme='dark'] .icon-button {
  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }
}
</style>
