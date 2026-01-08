import { getPages } from "../lib/utils.js";

export const initPagination = ({ pages, fromRow, toRow, totalRows }, createPage) => {
    if (!pages.firstElementChild) {
        console.error('Pagination template missing');
        return { applyPagination: () => ({}), updatePagination: () => {} };
    }

    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.firstElementChild.remove();

    let pageCount = 1;

    const applyPagination = (query, state, action) => {
        const limit = state.rowsPerPage;
        let page = state.page;

        if (action && typeof action.name === 'string') {
            switch (action.name) {
                case 'prev': page = Math.max(1, page - 1); break;
                case 'next': page = Math.min(pageCount, page + 1); break;
                case 'first': page = 1; break;
                case 'last': page = pageCount; break;
            }
        }

        return { ...query, limit, page };
    };

    const updatePagination = (total, { page, limit }) => {
        pageCount = total === 0 ? 1 : Math.ceil(total / limit);

        const visiblePages = getPages(page, pageCount, 5);
        pages.replaceChildren(...visiblePages.map(pageNumber => {
            const el = pageTemplate.cloneNode(true);
            el.dataset.page = pageNumber;
            return createPage(el, pageNumber, pageNumber === page);
        }));

        if (total === 0) {
            fromRow.textContent = 0;
            toRow.textContent = 0;
        } else {
            fromRow.textContent = (page - 1) * limit + 1;
            toRow.textContent = Math.min(page * limit, total);
        }
        totalRows.textContent = total;
    };

    return {
        updatePagination,
        applyPagination
    };
};