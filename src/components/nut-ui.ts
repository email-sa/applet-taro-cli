import { Button, Cell, CellGroup, Toast } from '@nutui/nutui-taro';
import { App } from 'vue';

// 按需导入组件
export default function nutImport(app: App) {
    [Button, Toast, Cell, CellGroup].forEach(v => {
        app.use(v);
    });
    return app;
}
