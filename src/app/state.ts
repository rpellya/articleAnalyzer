import { Article, GraphDense, GraphSparse } from './types';

interface State {
    articles: Article[] | null;
    sparse: GraphSparse | null;
    dense: GraphDense | null;
    loadedFile: string | null;
}

// СОСТОЯНИЕ СЕССИИ
export const state: State = {
    articles: null,
    sparse: null,
    dense: null,
    loadedFile: null,
};
