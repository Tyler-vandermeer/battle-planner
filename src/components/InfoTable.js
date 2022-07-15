import React from 'react';
import { Table } from 'semantic-ui-react';
import ContentLine from './ContentLine';

const InfoTable = (props)=> {
    const buildRows = () => {
        return props.rows.map((r, i) => {
            const tds = r.map((td, j) => {
                return <Table.Cell key={j}><ContentLine label={td.label} value={td.value} /></Table.Cell>
            });

            return (
                <Table.Row key={i}>
                    {tds}
                </Table.Row>
            )
        });
    }

    return (
        <Table className='monsterTable'>
            <Table.Body>
                {buildRows()}
            </Table.Body>
        </Table>
    )
}

export default InfoTable;