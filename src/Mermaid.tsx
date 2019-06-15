import React, { useState, useEffect } from 'react';
import mermaid from 'mermaid';

export interface MermaidProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Unique name for a diagram.
   */
  name: string;
  /**
   * Mermaid code
   */
  code: string;
  /**
   * Component to show when loading, before the mermaid markup is ready
   */
  loadingComponent?: React.FunctionComponent | React.ComponentClass
}

mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
});

export const Mermaid: React.SFC<MermaidProps> = ({ name, code, loadingComponent, ...extraProps }: MermaidProps) => {
  const [renderedHtml, setRenderedHtml] = useState<string | null>(null);

  useEffect(() => {
    mermaid.render(
      name, code,
      (svg) => {
        const document = new DOMParser().parseFromString(svg, 'image/svg+xml');
        const svgNode = document.getElementById(name);
        if (svgNode == null) {
          console.warn(`Mermaid document did not contain node with id "${name}".`);
          return;
        }
        // Fill the parent div so that we can resize without further modifying the SVG
        if (!svgNode.hasAttribute('width')) {
          const attr = document.createAttribute('width');
          attr.value = '100%';
          svgNode.setAttributeNode(attr);
        }
        if (!svgNode.hasAttribute('height')) {
          const attr = document.createAttribute('height');
          attr.value = '100%';
          svgNode.setAttributeNode(attr);
        }
        setRenderedHtml(svgNode.outerHTML);
      }
    );
  }, [name, code]);

  if (renderedHtml == null) {
    return loadingComponent == null
      ? <>Loading...</>
      : React.createElement(loadingComponent);
  }

  return <div {...extraProps} dangerouslySetInnerHTML={{ __html: renderedHtml }}/>;
};
