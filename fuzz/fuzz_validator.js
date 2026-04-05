const { validateArticle } = require("../dist/app/algorithm/validator.js");

/**
 * @param { Buffer } data
 */
module.exports.fuzz = function (data) {
  try {
    // Преобразуем буфер в строку и пытаемся распарсить как JSON
    const str = data.toString("utf-8");
    let article;
    try {
      article = JSON.parse(str);
    } catch (e) {
      // Некорректный JSON — пропускаем
      return;
    }
    validateArticle(article);
  } catch (e) {
    // Ожидаемые ошибки валидации — не краш
    if (e instanceof TypeError && e.message.includes("Cannot read")) {
      // Это баг — необработанное обращение к свойству null
      throw e;
    }
  }
};
