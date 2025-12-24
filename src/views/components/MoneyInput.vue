<template>
  <div>
    <el-input-number
      v-model="displayValue"
      :precision="2"
      :max="maxAmount / 100"
      :step="0.01"
      :placeholder="placeholder"
      @change="handleInputChange"
      @blur="handleBlur"
      :class="{ 'is-invalid': invalidAmount }"
    ></el-input-number>
    <div v-if="invalidAmount" class="error-message">
      金额必须小于 {{ maxAmount / 100 }} 元
    </div>
  </div>
</template>

<script>
export default {
  name: 'MoneyInput',
  props: {
    value: {
      type: Number,
      default: 0.00
    },
    maxAmount: {
      type: Number,
      default: 10000000000 // 1亿
    },
    placeholder: {
      type: String,
      default: '0.00'
    }
  },
  data() {
    return {
      invalidAmount: false
    }
  },
  computed: {
    // 将分转换为元（显示用）
    displayValue: {
      get() {
        return this.value / 100.0
      },
      set(value) {
        // 将元转换为分（整数）
        const cents = Math.round(value * 100)
        this.$emit('input', cents)
        return value
      }
    }
  },
  watch: {
    value(newVal) {
      // 确保值在范围内
      if (newVal > this.maxAmount) {
        this.$emit('input', this.maxAmount)
      }
    }
  },
  methods: {
    handleInputChange(value) {
      // 处理输入时的验证
      if (value > this.maxAmount / 100) {
        this.invalidAmount = true
        this.$emit('input', this.maxAmount)
      } else {
        this.invalidAmount = false
      }
    },
    handleBlur() {
      // 确保显示两位小数
      this.displayValue = this.displayValue
    }
  }
}
</script>

<style scoped>
.money-input-container {
  width: 100%;
}

.money-input {
  width: 100%;
  --el-input-number-width: 100%;
}

.currency-symbol {
  color: #606266;
  margin-right: 4px;
  font-size: 14px;
}

.error-message {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 4px;
  height: 18px;
  line-height: 18px;
}

.is-invalid .el-input-number__inner {
  border-color: #f56c6c !important;
  box-shadow: 0 0 0 2px rgba(245, 108, 108, 0.2) !important;
}
</style>
