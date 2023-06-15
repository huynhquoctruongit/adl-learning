import { MathJax } from 'better-react-mathjax';
import React from 'react';
let content_replace = '';
const MathJaxBlock = ({ content, name, ...rest }) => {
  if (!content) return null;
  content_replace = (content + '').replaceAll(/^(<p>&nbsp;<\/p>){1,}/g, '');
  content_replace = content_replace.replaceAll(/(<p>&nbsp;<\/p>){1,}$/g, '');
  return (
    <MathJax>
      <div {...rest} className="mathjax-custom-block" dangerouslySetInnerHTML={{ __html: content_replace }}></div>
    </MathJax>
  );
};
export default React.memo(MathJaxBlock);
