import { sortCollection, sortMap } from "../lib/sort.js";

export function initSorting(columns) {
    return (data, state, action) => {
        let field = null;
        let order = null;

        // @todo: #3.1 и #3.2 — обработка нажатия на кнопку сортировки
        if (action && columns.includes(action)) {
            // Обновляем состояние нажатой кнопки
            action.dataset.value = sortMap[action.dataset.value];
            field = action.dataset.field;
            order = action.dataset.value;

            // Сбрасываем все остальные кнопки
            columns.forEach(column => {
                if (column !== action) {
                    column.dataset.value = 'none';
                }
            });
        }

        // @todo: #3.3 — восстановление текущей сортировки при перерисовке
        if (field === null && order === null) {
            columns.forEach(column => {
                if (column.dataset.value !== 'none') {
                    field = column.dataset.field;
                    order = column.dataset.value;
                }
            });
        }

        return sortCollection(data, field, order);
    };
}