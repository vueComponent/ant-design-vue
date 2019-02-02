<template>
  <div class="snd-ad">
    <div class="sponsorsWrap">
      <span class="sponsorsTitle">
        {{ title }}
      </span>
      <ul>
        <li class="sponsorsItem">
          <a
            href="https://tipe.io/?ref=ant-design-vue"
            target="_blank"
          >
            <img
              width="34"
              src="https://cdn.tipe.io/tipe/tipe-cat-no-text.svg"
              alt="tipe"
            >
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: ['title'],
};
</script>
