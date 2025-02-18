/**
 * author : Lim Chaehyeon (chaehyeon)
 * data : 2025.02.18
 * description : 스크롤
 * React
 */

import React, { useRef, useEffect } from 'react';

export default function useInfiniteScroll(callback) {
  const observerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [callback]);

  return observerRef;
}
