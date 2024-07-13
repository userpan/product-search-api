'use client';

import { useState, useEffect } from 'react';

function decodeHTMLEntities(text: string) {
  if (typeof window === 'undefined') return text; // 服务器端返回原始文本
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
}

interface ClientSideContentProps {
  html: string;
}

export default function ClientSideContent({ html }: ClientSideContentProps) {
  const [decodedHtml, setDecodedHtml] = useState(html);

  useEffect(() => {
    setDecodedHtml(decodeHTMLEntities(html));
  }, [html]);

  return <div dangerouslySetInnerHTML={{ __html: decodedHtml }} />;
}