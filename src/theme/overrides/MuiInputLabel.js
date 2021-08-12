export default {
    outlined: {
        // see comment above on filled.zIndex
        zIndex: 1,
        pointerEvents: 'none',
        transform: 'translate(14px, 14px) scale(1)',
        '&$marginDense': {
          transform: 'translate(14px, 12px) scale(1)'
        },
        '&$shrink': {
          transform: 'translate(14px, -6px) scale(0.75)'
        }
      }
}
