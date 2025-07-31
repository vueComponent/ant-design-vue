import { createClient } from '@supabase/supabase-js';

// 从环境变量获取 Supabase 配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 验证环境变量是否存在
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    '缺少 Supabase 环境变量配置。请检查 .env.local 文件中的 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY',
  );
}

// 创建 Supabase 客户端
export const supabase = createClient(supabaseUrl, supabaseKey);

// 主题配置服务类
export class ThemeConfigService {
  static tableName = 'theme_configs';

  /**
   * 保存主题配置到云端
   * @param {Object} config - 主题配置对象
   * @param {string} name - 主题名称
   * @param {string} description - 主题描述
   * @returns {Promise<Object>} 操作结果
   */
  static async saveThemeConfig(config, name, description = '') {
    try {
      // 构建插入数据，包含必要字段和默认用户ID
      const insertData = {
        name: name,
        config: config,
        user_id: 'anonymous', // 默认用户ID，后续可以改为实际的用户认证
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // 如果提供了描述，则添加到插入数据中
      if (description && description.trim()) {
        insertData.description = description;
      }

      const { data, error } = await supabase.from(this.tableName).insert([insertData]).select();

      if (error) {
        console.error('保存主题配置失败:', error);
        return {
          success: false,
          message: error.message,
          error: error,
        };
      }

      return {
        success: true,
        data: data[0],
        message: '保存成功',
      };
    } catch (error) {
      console.error('保存主题配置异常:', error);
      return {
        success: false,
        message: '保存失败，请检查网络连接',
        error: error,
      };
    }
  }

  /**
   * 获取所有主题配置
   * @returns {Promise<Object>} 操作结果
   */
  static async getAllThemeConfigs() {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('获取主题配置失败:', error);
        return {
          success: false,
          message: error.message,
          error: error,
        };
      }

      return {
        success: true,
        data: data || [],
        message: '获取成功',
      };
    } catch (error) {
      console.error('获取主题配置异常:', error);
      return {
        success: false,
        message: '获取失败，请检查网络连接',
        error: error,
      };
    }
  }

  /**
   * 根据ID获取主题配置
   * @param {string} id - 主题配置ID
   * @returns {Promise<Object>} 操作结果
   */
  static async getThemeConfigById(id) {
    try {
      const { data, error } = await supabase.from(this.tableName).select('*').eq('id', id).single();

      if (error) {
        console.error('获取主题配置失败:', error);
        return {
          success: false,
          message: error.message,
          error: error,
        };
      }

      return {
        success: true,
        data: data,
        message: '获取成功',
      };
    } catch (error) {
      console.error('获取主题配置异常:', error);
      return {
        success: false,
        message: '获取失败，请检查网络连接',
        error: error,
      };
    }
  }

  /**
   * 更新主题配置
   * @param {string} id - 主题配置ID
   * @param {Object} config - 新的主题配置对象
   * @param {string} name - 主题名称
   * @param {string} description - 主题描述
   * @returns {Promise<Object>} 操作结果
   */
  static async updateThemeConfig(id, config, name, description = '') {
    try {
      // 构建更新数据，只包含必要字段
      const updateData = {
        name: name,
        config: config,
        updated_at: new Date().toISOString(),
      };

      // 如果提供了描述，则添加到更新数据中
      if (description && description.trim()) {
        updateData.description = description;
      }

      const { data, error } = await supabase
        .from(this.tableName)
        .update(updateData)
        .eq('id', id)
        .select();

      if (error) {
        console.error('更新主题配置失败:', error);
        return {
          success: false,
          message: error.message,
          error: error,
        };
      }

      return {
        success: true,
        data: data[0],
        message: '更新成功',
      };
    } catch (error) {
      console.error('更新主题配置异常:', error);
      return {
        success: false,
        message: '更新失败，请检查网络连接',
        error: error,
      };
    }
  }

  /**
   * 删除主题配置
   * @param {string} id - 主题配置ID
   * @returns {Promise<Object>} 操作结果
   */
  static async deleteThemeConfig(id) {
    try {
      const { error } = await supabase.from(this.tableName).delete().eq('id', id);

      if (error) {
        console.error('删除主题配置失败:', error);
        return {
          success: false,
          message: error.message,
          error: error,
        };
      }

      return {
        success: true,
        message: '删除成功',
      };
    } catch (error) {
      console.error('删除主题配置异常:', error);
      return {
        success: false,
        message: '删除失败，请检查网络连接',
        error: error,
      };
    }
  }

  /**
   * 根据名称搜索主题配置
   * @param {string} searchTerm - 搜索关键词
   * @returns {Promise<Object>} 操作结果
   */
  static async searchThemeConfigs(searchTerm) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('搜索主题配置失败:', error);
        return {
          success: false,
          message: error.message,
          error: error,
        };
      }

      return {
        success: true,
        data: data || [],
        message: '搜索成功',
      };
    } catch (error) {
      console.error('搜索主题配置异常:', error);
      return {
        success: false,
        message: '搜索失败，请检查网络连接',
        error: error,
      };
    }
  }
}

// 默认导出
export default {
  supabase,
  ThemeConfigService,
};
