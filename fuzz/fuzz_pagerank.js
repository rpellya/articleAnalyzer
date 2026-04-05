const { pagerankSparse } = require("../dist/app/algorithm/pagerank.js");
const { buildGraphSparse } = require("../dist/app/algorithm/graph.js");

module.exports.fuzz = function (data) {
  try {
    const str = data.toString("utf-8");
    let input;
    try {
      input = JSON.parse(str);
    } catch (e) {
      return;
    }
    if (!Array.isArray(input?.articles)) return;

    const graph = buildGraphSparse(input.articles);
    const n = input.articles.length;
    const damping = typeof input.damping === "number" ? input.damping : 0.85;
    const iterations =
      typeof input.iterations === "number" ? input.iterations : 20;

    pagerankSparse(graph, damping, iterations, n);
  } catch (e) {
    // Зависание при делении на ноль, NaN в PR — баги
    if (e instanceof RangeError) throw e; // stack overflow
  }
};
