'use client';

import { useState, useEffect } from 'react';

const decodeHTMLEntities = (text: string) => {
  if (typeof window === 'undefined') return text;
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
}

interface ClientSideContentProps {
  html: string;
  maxLength?: number;
}

const ClientSideContent = ({ html, maxLength }: ClientSideContentProps) => {
  const [processedHtml, setProcessedHtml] = useState(html);

  useEffect(() => {
    let decodedText = decodeHTMLEntities(html);
    if (maxLength) {
      decodedText = truncateText(decodedText, maxLength);
    }
    setProcessedHtml(decodedText);
  }, [html, maxLength]);

  return <div dangerouslySetInnerHTML={{ __html: processedHtml }} />;
}

export default ClientSideContent;