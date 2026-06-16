export type CanvasMode = 'WEB' | 'GRAPHIC' | 'SVG' | 'CONTENT' | 'ALL' | null;

export interface ParsedMessage {
  text: string;
  canvasContent: string | null;
  canvasMode: CanvasMode;
}

export function parseMessage(message: string): ParsedMessage {
  let text = message;
  let canvasContent = null;
  let canvasMode: CanvasMode = null;

  const webMatch = message.match(/<canvas_web>([\s\S]*?)<\/canvas_web>/);
  if (webMatch) {
    canvasContent = webMatch[1].trim();
    canvasMode = 'WEB';
    text = text.replace(webMatch[0], '').trim();
  }

  const graphicMatch = message.match(/<canvas_graphic>([\s\S]*?)<\/canvas_graphic>/);
  if (graphicMatch) {
    canvasContent = graphicMatch[1].trim();
    canvasMode = 'GRAPHIC';
    text = text.replace(graphicMatch[0], '').trim();
  }

  const svgMatch = message.match(/<canvas_svg>([\s\S]*?)<\/canvas_svg>/);
  if (svgMatch) {
    canvasContent = svgMatch[1].trim();
    canvasMode = 'SVG';
    text = text.replace(svgMatch[0], '').trim();
  }

  const contentMatch = message.match(/<canvas_content>([\s\S]*?)<\/canvas_content>/);
  if (contentMatch) {
    canvasContent = contentMatch[1].trim();
    canvasMode = 'CONTENT';
    text = text.replace(contentMatch[0], '').trim();
  }

  return { text, canvasContent, canvasMode };
}
