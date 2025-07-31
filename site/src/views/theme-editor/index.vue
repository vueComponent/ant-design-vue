<template>
  <Header />
  <div class="theme-editor">
    <a-config-provider :theme="{ inherit: false }">
      <div class="theme-editor-header">
        <a-typography-title :level="5" :style="{ margin: 0 }">
          {{ locale.title }}
        </a-typography-title>

        <div>
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
            :title="locale.saveToCloudModalTitle"
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

          <a-button class="theme-editor-header-actions" @click="handleLoadFromCloud">
            {{ locale.loadFromCloud }}
          </a-button>
          <a-button class="theme-editor-header-actions" @click="handleSaveToCloud">
            {{ locale.saveToCloud }}
          </a-button>
          <a-button class="theme-editor-header-actions" @click="handleExportJson">
            {{ locale.exportJson }}
          </a-button>
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
      saveToCloudForm.value.name = '';
      saveToCloudForm.value.description = '';
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
        const result = await ThemeConfigService.saveThemeConfig(
          theme.value,
          saveToCloudForm.value.name.trim(),
          saveToCloudForm.value.description.trim(),
        );

        if (result.success) {
          message.success(locale.value.saveToCloudSuccessfully);
          saveToCloudModalOpen.value = false;
        } else {
          message.error(result.message || locale.value.saveToCloudFailed);
        }
      } catch (error) {
        console.error('保存到云端失败:', error);
        message.error(locale.value.saveToCloudFailed);
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
      message.success(locale.value.loadFromCloudSuccessfully);
      loadFromCloudModalOpen.value = false;
    };

    const handleDeleteThemeConfig = async id => {
      try {
        const result = await ThemeConfigService.deleteThemeConfig(id);
        if (result.success) {
          message.success(locale.value.deleteSuccessfully);
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
      const file = new File([JSON.stringify(theme.value, null, 2)], `Ant Design Vue Theme.json`, {
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
     * 导出JSON文件，按照设计令牌标准格式，只包含修改过的受影响的变量
     */
    const handleExportJson = () => {
      // 获取当前主题的token配置
      const currentToken = theme.value.token || {};

      // 找出修改过的seed token
      const modifiedSeedTokens = [];
      Object.keys(currentToken).forEach(key => {
        if (seedToken[key] !== undefined && currentToken[key] !== seedToken[key]) {
          modifiedSeedTokens.push(key);
        }
      });

      // 如果没有修改任何seed token，提示用户
      if (modifiedSeedTokens.length === 0) {
        console.warn('没有检测到任何修改的seed token');
        return;
      }

      // 获取完整的计算后的token值
      const computedTokens = getDesignToken({
        token: currentToken,
        algorithm: theme.value.algorithm,
        components: theme.value.components || {},
      });

      // 收集所有受影响的变量
      const affectedTokens = {};
      modifiedSeedTokens.forEach(seedKey => {
        // 添加修改的seed token本身
        affectedTokens[seedKey] = computedTokens[seedKey];

        // 添加相关的Map Token
        const relatedMapTokens = seedRelatedMap[seedKey] || [];
        relatedMapTokens.forEach(mapTokenKey => {
          if (computedTokens[mapTokenKey] !== undefined) {
            affectedTokens[mapTokenKey] = computedTokens[mapTokenKey];
          }
        });
      });

      // 按照设计令牌标准格式组织数据
      const formatTokensForExport = tokens => {
        const result = {
          Colors: {
            Brand: {
              Primary: {},
              Success: {},
              Error: {},
              Warning: {},
              Info: {},
            },
          },
        };

        /**
         * 根据实际颜色值生成对应的引用格式
         * @param {string} tokenKey - token名称
         * @param {string} tokenValue - 实际颜色值
         * @returns {string} 引用格式或实际颜色值
         */
        const generateColorReference = (tokenKey, tokenValue) => {
          // 如果是主色，直接使用颜色值
          if (
            tokenKey === 'colorPrimary' ||
            tokenKey === 'colorSuccess' ||
            tokenKey === 'colorError' ||
            tokenKey === 'colorWarning' ||
            tokenKey === 'colorInfo'
          ) {
            return tokenValue;
          }

          // 对于衍生的token，直接使用实际的颜色值
          return tokenValue;
        };

        Object.keys(tokens).forEach(tokenKey => {
          const tokenValue = tokens[tokenKey];
          const referenceValue = generateColorReference(tokenKey, tokenValue);
          const tokenData = {
            $type: 'color',
            $value: referenceValue,
          };

          // 根据token名称分类到Brand下的不同子类别
          if (tokenKey.includes('Primary') || tokenKey === 'colorPrimary') {
            result.Colors.Brand.Primary[tokenKey] = tokenData;
          } else if (tokenKey.includes('Success')) {
            result.Colors.Brand.Success[tokenKey] = tokenData;
          } else if (tokenKey.includes('Error')) {
            result.Colors.Brand.Error[tokenKey] = tokenData;
          } else if (tokenKey.includes('Warning')) {
            result.Colors.Brand.Warning[tokenKey] = tokenData;
          } else if (tokenKey.includes('Info')) {
            result.Colors.Brand.Info[tokenKey] = tokenData;
          } else {
            // 其他颜色放在Brand.Primary下
            result.Colors.Brand.Primary[tokenKey] = tokenData;
          }
        });

        // 清理空的分类
        Object.keys(result.Colors.Brand).forEach(category => {
          if (Object.keys(result.Colors.Brand[category]).length === 0) {
            delete result.Colors.Brand[category];
          }
        });

        return result;
      };

      const exportData = formatTokensForExport(affectedTokens);

      const file = new File([JSON.stringify(exportData, null, 2)], `Design Tokens.json`, {
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
}
</style>
