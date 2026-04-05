export interface Article {
    id: string;
    title: string;
    authors: string[];
    year: number;
    citations: string[];
}

export interface RawArticle {
    id: string | number;
    title: string;
    authors?: string[];
    year?: number;
    citations?: string[];
    references?: string[];
}

export interface GraphDense {
    matrix: number[][]; // плотная матрица смежности
    n: number;
}

export interface GraphSparse {
    outLinks: number[][]; // для каждой вершины список индексов исходящих соседей
    inLinks: number[][]; // входящие соседи
    outDegree: number[];
    n: number;
}
