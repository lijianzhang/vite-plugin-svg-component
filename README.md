# vite-plugin-svg-component
将 svg icon 转化为 vue 组件


## 安装

```shell
yarn add vite-plugin-svg-component
#or
npm install vite-plugin-svg-component

```

## 使用

在 vite 配置加入插件
**vite.config.ts**
```typescript
import { defineConfig } from 'vite';
import { vueSvg } from 'vite-plugin-svg-component';

defineConfig({
    plugins[vueSvg()]
    // or
    plugins[vueSvg({
        // 生成组件的类名
        className: 'my-icon-class' // default "svg-icon"
        /**
         *  判断是否转为vue组件的标识 比如  import "arrow.svg?component" 
         *  其中  component 就是标识 也就是 flag 的值
         */
        flag: 'my-flag': // default "component"
    })]
})
```

在 vue 中使用

**app.vue**
```vue
<template>
    <arrow-icon/>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import ArrowIcon from './arrow.svg?component';
defineComponent({
    components: {
        ArrowIcon
    }
})
</script>
```

**arrow.svg**
```svg
<svg width="20" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M6.175 7.15833L10 10.975L13.825 7.15833L15 8.33333L10 13.3333L5 8.33333L6.175 7.15833Z" fill="#33383E"/>
</svg>

```