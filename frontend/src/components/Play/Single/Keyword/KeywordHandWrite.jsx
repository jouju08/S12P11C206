import React from 'react';
import KeywordMenu from './KeywordMenu';

export default function KeywordHandWrite({ back, next, reload }) {
  return (
    <div>
      <KeywordMenu
        back={back}
        next={next}
        reload={reload}
      />
    </div>
  );
}
