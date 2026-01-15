import { Element, Parent, Root, RootContent, Text } from 'hast';
import { Node } from 'unist';

const nodeIsParent = (node: Node): node is Parent =>
  Boolean((node as Parent).children);
const nodeIsText = (node: Node): node is Text => node.type === 'text';
const childIsElement = (child: RootContent): child is Element =>
  child.type === 'element';
const childIsText = (child: RootContent): child is Text =>
  child.type === 'text';
/**
 * Transform this complex tree into a flatten tree with simple nodes
 *
 * @param node
 */
function flattenNodes(node: Node): SimpleNode[] {
  if (nodeIsParent(node)) {
    return node.children.flatMap((child) => {
      if (childIsElement(child)) {
        return flattenNodes(child);
      }
      if (childIsText(child)) {
        return { type: 'simple', text: child.value };
      }
      throw new Error('Unexpected state!');
    });
  }
  if (nodeIsText(node)) {
    return [{ type: 'simple', text: node.value }];
  }
  throw new Error('Unhandled state!');
}

const linebreak = Symbol('linebreak');

type LineBreak = typeof linebreak;

function insertLines(
  flattenNodes: SimpleNode[]
): Array<SimpleNode | LineBreak> {
  return flattenNodes
    .map((node) => {
      const lines = node.text.split('\n');
      if (lines.length > 1) {
        return lines.reduce<Array<SimpleNode | LineBreak>>(
          (previous, text) => {
            const current = {
              type: 'simple',
              text,
              className: node.className
            } as const;
            if (previous.length) {
              return [...previous, linebreak, current];
            }
            return [current];
          },
          [] as Array<SimpleNode | LineBreak>
        );
      }
      return node;
    })
    .flat();
}

function makeLines(nodes: Array<SimpleNode | LineBreak>): SimpleNode[][] {
  let breakIndex: number;
  const lines: SimpleNode[][] = [];
  while ((breakIndex = nodes.indexOf(linebreak)) !== -1) {
    const line = nodes.splice(0, breakIndex);
    nodes.shift();
    lines.push(line as SimpleNode[]);
  }
  lines.push(nodes as SimpleNode[]);
  return lines;
}

export type SimpleNode = {
  type: 'simple';
  text: string;
  className?: string[];
};

export default function generateLines({ children }: Root): SimpleNode[][] {
  const flattenTree = children.flatMap(flattenNodes);
  return makeLines(insertLines(flattenTree));
}
