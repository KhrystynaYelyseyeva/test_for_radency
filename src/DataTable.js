import React, { memo } from 'react';
import { propTypes, defaultProps } from './propTypes';
import styled from 'styled-components';
const shortid = require('shortid');

const Table = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
`;

const TableCell = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const TableCellWithError = styled.td`
  background: #f68888;
`;

const TableHeader = styled.th`
  border: 1px solid #ddd;
  padding: 12px 8px;
  text-align: left;
  background-color: #4CAF50;
  color: white;
`;

const DataTable = memo(({ data, headers }) => {
    return (
        <Table>
            <thead>
                <tr>
                    {headers.map(head => (
                        <TableHeader key={shortid.generate()}>
                            {head}
                        </TableHeader>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map( dataRow => (
                    <tr key={dataRow.ID}>
                        {Object.entries(dataRow).map(([dataKey,value]) =>
                            <React.Fragment key={shortid.generate()}>
                                {/error/g.test(dataKey) ?
                                    (
                                        <TableCellWithError>
                                            {value}
                                        </TableCellWithError>
                                    ) : (
                                        <TableCell>
                                            {value}
                                        </TableCell>
                                    )
                                }
                            </React.Fragment>
                        )}
                    </tr>
                ))}
            </tbody>
        </Table>
    );
});

DataTable.propTypes = propTypes;
DataTable.defaultProps = defaultProps;

export default DataTable;