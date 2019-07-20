// Based on no-scroll
// Copyright (c) 2015 David Clark
// Licensed under MIT License
// https://github.com/davidtheclark/no-scroll/blob/master/index.js

import { useEffect } from 'react'

export default function useNoBodyScroll(active) {
  useEffect(() => {
    if (active) {
      let doc = document.documentElement
      let scrollTop = window.pageYOffset

      doc.style.position = 'fixed'
      doc.style.top = -scrollTop + 'px'
      doc.style.overflow = 'hidden'
      doc.style.width = '100vw'

      return () => {
        doc.style.width = ''
        doc.style.position = ''
        doc.style.top = ''
        doc.style.overflow = ''
        window.scroll(0, scrollTop)
      }
    }
  }, [active])
}
