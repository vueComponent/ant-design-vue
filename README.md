# Ant Design Vue 
by Mottor 💪

## Основные изменения по сравнению с оригинальным Ant Design Vue 

1. Изменены стили отдельных элементов

2. Возможность изменять заголовок у Select. Для этого нужно добавить слот `headRender`.

Пример:
```
<a-select default-value="lucy" style="width: 120px">
  <div slot="headRender">
    <a-button type="link">Select head</a-button>
  </div>
  <a-select-option value="jack">
    Jack
  </a-select-option>
  <a-select-option value="lucy">
    Lucy
  </a-select-option>
</a-select>
```

Также есть возможность оставить стрелку из оригинального компонента, для этого в слоте есть атрибут `arrow` (bool):
```
<a-select default-value="lucy">
  <div slot="headRender"
       :arrow="true">
    <a-button type="link"
              style="padding-right: 24px;">
      Custom head with arrow
    </a-button>
  </div>
  <a-select-option value="jack">
    Jack
  </a-select-option>
  <a-select-option value="lucy">
    Lucy
  </a-select-option>
</a-select>
```
