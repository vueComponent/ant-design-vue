<template>
  <div class="phosphor-example">
    <h2>Phosphor Icons 示例</h2>

    <!-- 基础图标使用 -->
    <div class="icon-section">
      <h3>基础图标</h3>
      <div class="icon-row">
        <PhHeart />
        <PhStar />
        <PhHouse />
        <PhUser />
        <PhGear />
      </div>
    </div>

    <!-- 不同尺寸的图标 -->
    <div class="icon-section">
      <h3>不同尺寸</h3>
      <div class="icon-row">
        <PhHeart :size="16" />
        <PhHeart :size="24" />
        <PhHeart :size="32" />
        <PhHeart :size="48" />
      </div>
    </div>

    <!-- 不同颜色的图标 -->
    <div class="icon-section">
      <h3>不同颜色</h3>
      <div class="icon-row">
        <PhHeart color="red" />
        <PhHeart color="blue" />
        <PhHeart color="green" />
        <PhHeart color="orange" />
      </div>
    </div>

    <!-- 不同权重的图标 -->
    <div class="icon-section">
      <h3>不同权重</h3>
      <div class="icon-row">
        <PhHeart weight="thin" />
        <PhHeart weight="light" />
        <PhHeart weight="regular" />
        <PhHeart weight="bold" />
        <PhHeart weight="fill" />
        <PhHeart weight="duotone" />
      </div>
    </div>

    <!-- 组合使用 -->
    <div class="icon-section">
      <h3>组合使用</h3>
      <div class="icon-row">
        <PhHeart :size="32" color="hotpink" weight="fill" />
        <PhStar :size="32" color="gold" weight="fill" />
        <PhGear :size="32" color="gray" weight="bold" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * Phosphor Icons 使用示例组件
 * 展示了如何在 Vue 3 项目中使用 @phosphor-icons/vue 包
 */
import { PhHeart, PhStar, PhHouse, PhUser, PhGear } from '@phosphor-icons/vue';
</script>

<style scoped>
.phosphor-example {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.icon-section {
  margin-bottom: 30px;
}

.icon-section h3 {
  margin-bottom: 15px;
  color: #333;
  font-size: 18px;
}

.icon-row {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.icon-row > * {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #f9f9f9;
  transition: all 0.2s ease;
}

.icon-row > *:hover {
  background-color: #f0f0f0;
  transform: scale(1.1);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}
</style>
