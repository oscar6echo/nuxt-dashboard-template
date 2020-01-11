import marked from 'marked';
import katex from 'katex';

const renderMathsExpression = (expr) => {
  if (expr[0] === '$' && expr[expr.length - 1] === '$') {
    let displayStyle = false;
    expr = expr.substr(1, expr.length - 2);
    if (expr[0] === '$' && expr[expr.length - 1] === '$') {
      displayStyle = true;
      expr = expr.substr(1, expr.length - 2);
    }
    let html = null;
    try {
      html = katex.renderToString(expr);
    } catch (e) {
      console.err(e);
    }
    if (displayStyle && html) {
      html = html.replace(
        /class="katex"/g,
        'class="katex katex-block" style="display: block;"'
      );
    }
    return html;
  } else {
    return null;
  }
};

const transformed = (text) => {
  const blockRegex = /\$\$[^$]*\$\$/g;
  const inlineRegex = /\$[^$]*\$/g;
  const blockExprArray = text.match(blockRegex);
  const inlineExprArray = text.match(inlineRegex);

  for (const i in blockExprArray) {
    const expr = blockExprArray[i];
    const result = renderMathsExpression(expr);
    text = text.replace(expr, result);
  }
  for (const i in inlineExprArray) {
    const expr = inlineExprArray[i];
    const result = renderMathsExpression(expr);
    text = text.replace(expr, result);
  }
  return originParagraph(text);
};

const renderer = new marked.Renderer();
const rendererRef = new marked.Renderer();

const originParagraph = renderer.paragraph.bind(renderer);
renderer.paragraph = (text) => transformed(text);
renderer.listitem = (text, task, checked) =>
  rendererRef.listitem(transformed(text), task, checked);

marked.setOptions({ renderer });

export default marked;
