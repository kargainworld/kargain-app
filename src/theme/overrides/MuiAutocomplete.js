export default {
    popupIndicatorOpen: {
        transform: 'rotate(0deg)'
    },
    inputRoot: {
      flexWrap: 'wrap',
      '$hasPopupIcon &, $hasClearIcon &': {
        paddingRight: 26 + 4
      },
      '$hasPopupIcon$hasClearIcon &': {
        paddingRight: 52 + 4
      },
      '& $input': {
        width: 0,
        minWidth: 30
      },
      '&[class*="MuiInput-root"]': {
        paddingBottom: 1,
        '& $input': {
          padding: 4
        },
        '& $input:first-child': {
          padding: '6px 0'
        }
      },
      '&[class*="MuiInput-root"][class*="MuiInput-marginDense"]': {
        '& $input': {
          padding: '4px 4px 5px'
        },
        '& $input:first-child': {
          padding: '3px 0 6px'
        }
      },
      '&[class*="MuiOutlinedInput-root"]': {
        padding: 2,
        '$hasPopupIcon &, $hasClearIcon &': {
          paddingRight: 26 + 4 + 9
        },
        '$hasPopupIcon$hasClearIcon &': {
          paddingRight: 52 + 4 + 9
        },
        '& $input': {
          padding: '7px 4px'
        },
        '& $input:first-child': {
          paddingLeft: 6
        },
        '& $endAdornment': {
          right: 9
        }
      },
      '&[class*="MuiOutlinedInput-root"][class*="MuiOutlinedInput-marginDense"]': {
        padding: 6,
        '& $input': {
          padding: '4.5px 4px'
        }
      },
      '&[class*="MuiFilledInput-root"]': {
        paddingTop: 19,
        paddingLeft: 8,
        '$hasPopupIcon &, $hasClearIcon &': {
          paddingRight: 26 + 4 + 9
        },
        '$hasPopupIcon$hasClearIcon &': {
          paddingRight: 52 + 4 + 9
        },
        '& $input': {
          padding: '9px 4px'
        },
        '& $endAdornment': {
          right: 9
        }
      },
      '&[class*="MuiFilledInput-root"][class*="MuiFilledInput-marginDense"]': {
        paddingBottom: 1,
        '& $input': {
          padding: '4.5px 4px'
        }
      }
    }
}
