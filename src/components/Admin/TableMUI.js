import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import {Tooltip, Typography} from '@material-ui/core';



const Actions = ({ actions, row }) => actions.map(({ icon: Icon, onClick, isFreeAction, tooltip }) =>
  isFreeAction
    ? null
    : (
      <Tooltip title={tooltip} placement="top">
        <div style={{ marginRight: 10, cursor: 'pointer' }}>
          <Icon onClick={(event) => onClick(event, row.model)} />
        </div>
      </Tooltip>
    )
)

const convertToDataGrid = (_columns, _rows, actions) => {
    const columns = _columns.map(({ title, render, width }) => ({
      ...(width ? { width } : {}),
      title,
      field: title,
      renderCell: ({ row }) => render(row.model)
    }))

    const rows = _rows.map(row => ({
      model: row,
      id: parseInt(Math.random().toString().substring(2))
    }))

    const actionsColumn = {
        title: 'Actions',
        field: 'Actions',
        width: 120,
        renderCell: ({ row }) =>  <Actions actions={actions} row={row} />
    }

    return {
        columns: [actionsColumn, ...columns],
        rows
    }
}

export default function DataTable({ columns: cols, data, title, actions, ...props }) {
  const { rows, columns } = convertToDataGrid(cols, data, actions)

    return (
      <div>
        {title && <Typography variant="h2">{title}</Typography>}
        <div style={{ height: 'calc(100vh - 130px)', width: '100%' }}>
          <DataGrid rows={rows} columns={columns} pageSize={5} autoPageSize />
        </div>
      </div>
    );
}
