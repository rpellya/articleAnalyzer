export interface ArticleInput {
    id?: any;
    title?: any;
    authors?: any;
    year?: any;
    citations?: any;
}

export function validateArticle(article: ArticleInput): boolean {
    if (!article.id || typeof article.id !== 'string') return false;

    if (!article.title || typeof article.title !== 'string') return false;

    if (article.authors !== undefined && !Array.isArray(article.authors)) {
        return false;
    }

    if (article.year !== undefined) {
        if (typeof article.year !== 'number' || article.year < 1900) {
            return false;
        }
    }

    if (article.citations !== undefined && !Array.isArray(article.citations)) {
        return false;
    }

    return true;
}
