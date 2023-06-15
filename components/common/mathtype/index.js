import { convertTag } from '@/service/convert';
import { useEffect, useMemo, useState } from 'react';
import { MathJax } from 'better-react-mathjax';
const ContentBlock = ({ content, name, ...rest }) => {
  const renderContent = useMemo(() => {
    if (!content) return '';
    return convertTag(content);
  }, [content]);
  if (!content) return null;
  return (
    <MathJax key={name}>
      <div
        // style={{ visibility: loading ? 'hidden' : 'visible' }}
        {...rest}
        dangerouslySetInnerHTML={{ __html: renderContent }}
      ></div>
    </MathJax>
  );
};
export default ContentBlock;
