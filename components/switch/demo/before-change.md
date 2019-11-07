<cn>
#### 切换前加判断
切换开关前可判断是否允许切换，如：等接口返回结果后再更新开关
</cn>

<us>
#### beforeChange
It can be judged whether switching is allowed before switching.
</us>

```tpl
<template>
  <div>
    <a-switch :beforeChange="() => Math.random() > 0.5" @change='onChange'/>
    <br/>
    <br/>
    <a-switch :loading="loading" :beforeChange="beforeChange" @change='onChange'/>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        loading: false
      }
    },
    methods: {
      beforeChange(checked){
        console.log('beforeChange', checked)
        this.loading = true;
        return new Promise((resolve) => {
          setTimeout(() => {
            let bool = Math.random() > 0.5;
            if(bool) {
              resolve();
              this.$message.success('update success');
            }else {
              this.$message.error('update error');
            }
            this.loading = false;
          }, 500);
        });
      },
      onChange(checked){
        console.log(`co-switch to ${checked}`);
      },
    },
  }
</script>
```
