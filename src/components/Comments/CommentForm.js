import useTranslation from 'next-translate/useTranslation'
import React from 'react'


import clsx from 'clsx'
import customColors from '../../theme/palette'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
    button: {
        border: "none !important",
        padding: '8px 2rem',
        borderRadius: '20px',
        color: 'white !important',
        fontSize: '14px',
        fontWeight: "bold",
        marginRight: "5px",
        // width: "157px",
        hegiht: "41px",
        textAlign:'center',
        background: customColors.gradient.main
    }
}))
 
const CommentForm = ({ onSubmitComment, textareaCommentRef, doneSubmitting }) => {
    const { t } = useTranslation()
    const classes = useStyles()

    return (
        <form onSubmit={e => onSubmitComment(e)}
            className="comments-write" >
            <div style={{ display:'flex' }}>
                <div className="form-group" style={{ width: '70%' }}>
                    <input 
                        type="text"
                        rows={3}
                        cols={13}
                        ref={textareaCommentRef}
                        placeholder="ex: Superbe voiture"
                        // className="form-control editor"]
                        style={{ width:'100%' }}
                    />
                </div>
                
                <div style={{ marginLeft:'10px' }}>
                    <button
                        className={clsx(classes.button)}
                        disabled={!doneSubmitting}
                        type="submit">
                        {t('vehicles:send')}
                        {/* {t('vehicles:add_a_comment')} */}
                    </button>
                </div>
            </div>
        </form>
    )
}

export default CommentForm
