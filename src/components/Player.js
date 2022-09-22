import React, { useState, useEffect, useCallback } from 'react';
import { Card, Item, Table } from 'semantic-ui-react';
import ContentLine from './ContentLine';

const Player = (props) => {
    const [iniative, setIniative] = useState(0);
    const [snapshot, setSnapshot] = useState(iniative);
    const [startVal, setStartVal] = useState(0);

    const onStart = useCallback(
        (event) => {
            document.body.style.cursor = 'e-resize';
            setStartVal(event.clientX);
            setSnapshot(iniative);
        },
        [iniative]
    );

    useEffect(() => {
        const onUpdate = (event) => {
            event.preventDefault();
            if (startVal) {
                setIniative(Math.max(0, Math.min(20, snapshot + event.clientX - startVal)));
            }
        };

        const onEnd = () => {
            document.body.style.cursor = 'auto';
            setStartVal(0);
        };

        document.addEventListener("mousemove", onUpdate);
        document.addEventListener("mouseup", onEnd);
        return () => {
            document.removeEventListener("mousemove", onUpdate);
            document.removeEventListener("mouseup", onEnd);
        };
    }, [startVal, setIniative, snapshot]);

    return (
        <Card style={{ width: '340px' }}>
            <Card.Content>
                <Item>
                    {/* Maybe use this later */}
                    {/* <div role="healthWheel" aria-valuenow="6" aria-valuemin="0" aria-valuemax="100" style={{ '--value': '50' }}> */}
                    <Item.Image src={props.portrait} floated='left' size='tiny' circular />
                    {/* </div> */}
                    <Item.Content>
                        <Item.Header as='h3' className='margin0'>{props.name}</Item.Header>
                        <Table className='monsterTable margin0' compact style={{ width: '70%', textAlign: 'left' }}>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell><ContentLine label='AC' value={props.AC} /></Table.Cell>
                                    <Table.Cell className='padRight'>
                                        <div className='draggable' onMouseDown={onStart}>
                                            <b>Iniative:</b> {iniative}
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell><ContentLine label='Speed' value={props.speed} /></Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell><ContentLine label='STR' value={props.stats[0]} /></Table.Cell>
                                    <Table.Cell><ContentLine label='DEX' value={props.stats[1]} /></Table.Cell>
                                    <Table.Cell><ContentLine label='CON' value={props.stats[2]} /></Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell><ContentLine label='INT' value={props.stats[3]} /></Table.Cell>
                                    <Table.Cell><ContentLine label='WIS' value={props.stats[4]} /></Table.Cell>
                                    <Table.Cell><ContentLine label='CHA' value={props.stats[5]} /></Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </Item.Content>
                </Item>
            </Card.Content>
        </Card>
    )
}

export default Player;