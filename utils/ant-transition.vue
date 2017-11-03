<template>
  <transition
    :name="name"
    :enter-to-class="enterTo"
    :enter-active-class="enterActive"
    :leave-to-class="leaveTo"
  >
    <slot></slot>
  </transition>
</template>

<script>
	export default {
		name: 'ant-transition',
    props: {
		  name: {
		    required: true,
      }
    },
    computed: {
      enterTo() {
        return this.name + '-enter'
      },
      enterActive() {
        return `${this.name}-enter ${this.name}-enter-active`
      },
      leaveTo() {
        return this.name + '-leave'
      }
    }
	}
</script>
