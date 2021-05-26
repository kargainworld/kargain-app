import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import RemoveCircleOutline from '@material-ui/icons/RemoveCircleOutline'
import TableMUI from '../TableMUI'
import CommentsService from '../../../services/CommentsService'
import CommentModel from '../../../models/comment.model'
import { MessageContext } from '../../../context/MessageContext'
import TablePaginationActions from '../TablePaginationActions'
import { getTimeAgo } from '../../../libs/utils'

const columnsData = [
    {
        title: 'Avatar',
        filtering: false,
        grouping: false,
        searchable: true,
        sorting: true,
        // eslint-disable-next-line react/display-name
        render: CommentModel => {
            return <img
                alt=""
                title={CommentModel.getAuthor.getFullName}
                src={CommentModel.getAuthor.getAvatar}
                style={{
                    width: 40,
                    borderRadius: '50%'
                }}
            />
        }
    },
    {
        title: 'Text',
        filtering: false,
        grouping: false,
        searchable: true,
        sorting: true,
        width: 300,
        render: CommentModel => CommentModel.getMessage
    },
    {
        title: 'Création',
        render: CommentModel => {
            const date = CommentModel.getRaw?.updatedAt
            return getTimeAgo(date, 'fr')
        }
    }
]

const AdsTable = () => {

    const rowsLength = 60
    const router = useRouter()
    const { dispatchModalError, dispatchModal } = useContext(MessageContext)
    const columns = useMemo(() => columnsData, [])
    const [loading, setLoading] = useState(false)
    const [pageIndex, setPageIndex] = useState(0)
    const [resultFetch, setResultsFetch] = React.useState({
        rows: [],
        total: 0
    })

    const handleItemClick = async (e, CommentModel) => {
        await CommentsService.removeComment(CommentModel.getID)

        setResultsFetch({
            ...resultFetch,
            rows: resultFetch.rows.filter(CM => CM.getID !== CommentModel.getID)
        })

        dispatchModal({ msg: 'Comment deleted' })
    }

    const handleChangePageIndex = (pageIndex) => {
        setPageIndex(pageIndex)
    }

    const fetchData = React.useCallback(() => {
        setLoading(true)
        CommentsService.getCommentsWithComplaints({
            size: rowsLength,
            page: pageIndex
        })
            .then(res => {
                const rowsModel = res.map(row => new CommentModel(row))
                setResultsFetch({
                    rows: rowsModel
                })
                setLoading(false)
            })
            .catch(err => {
                dispatchModalError({ err })
            })
    }, [rowsLength, pageIndex])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <>
            <TableMUI
                loading={loading}
                data={resultFetch.rows}
                columns={columns}
                title="Comments Kargain"
                actions={[
                    {
                        icon: RemoveCircleOutline,
                        tooltip: 'Delete',
                        onClick: (e, CommentModel) => handleItemClick(e, CommentModel)
                    }
                ]}
            />

            {!loading && resultFetch.total && (
                <TablePaginationActions
                    count={resultFetch.total}
                    page={pageIndex}
                    rowsPerPage={rowsLength}
                    onChangePage={handleChangePageIndex}
                />
            )}

        </>
    )
}


export default AdsTable
