// This wrapper provides DOM parsing capabilities that work in both browser and Node environments

// In the browser, we'll use the browser's native DOM parsing
// In Node.js environments, we would use JSDOM (but we're focusing on browser usage now)

export const parseHTML = (html: string): Document => {
  // In browser environment, use DOMParser
  const parser = new DOMParser();
  return parser.parseFromString(html, 'text/html');
};

export const createVirtualDocument = (html: string = '<!DOCTYPE html><html><body></body></html>'): Document => {
  return parseHTML(html);
};

export default {
  parseHTML,
  createVirtualDocument
};