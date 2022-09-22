import React, { useState, useEffect, useCallback } from 'react';
import { Card, Item, Table } from 'semantic-ui-react';
import ContentLine from './ContentLine';

const Player = ({ name, portrait, AC, speed, iniative, stats, updateIniative }) => {
    const [internalIniative, setIniative] = useState(iniative);
    const [snapshot, setSnapshot] = useState(internalIniative);
    const [startVal, setStartVal] = useState(0);

    const onStart = useCallback(
        (event) => {
            document.body.style.cursor = 'e-resize';
            setStartVal(event.clientX);
            setSnapshot(internalIniative);
        },
        [internalIniative]
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
            updateIniative(internalIniative, name);
        };

        document.addEventListener("mousemove", onUpdate);
        document.addEventListener("mouseup", onEnd);
        return () => {
            document.removeEventListener("mousemove", onUpdate);
            document.removeEventListener("mouseup", onEnd);
        };
    }, [startVal, setIniative, snapshot, updateIniative, internalIniative, name]);

    return (
        <Card style={{ width: '340px' }} data-id={name}>
            <Card.Content>
                <Item>
                    {/* Maybe use this later */}
                    {/* <div role="healthWheel" aria-valuenow="6" aria-valuemin="0" aria-valuemax="100" style={{ '--value': '50' }}> */}
                    <Item.Image src={portrait} floated='left' size='tiny' circular />
                    {/* </div> */}
                    <Item.Content>
                        <Item.Header as='h3' className='margin0'>{name}</Item.Header>
                        <Table className='monsterTable margin0' compact style={{ width: '70%', textAlign: 'left' }}>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell><ContentLine label='AC' value={AC} /></Table.Cell>
                                    <Table.Cell className='padRight'>
                                        <div className='draggable' onMouseDown={onStart}>
                                            <b>Iniative:</b> {internalIniative}
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell><ContentLine label='Speed' value={speed} /></Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell><ContentLine label='STR' value={~~stats[0]} /></Table.Cell>
                                    <Table.Cell><ContentLine label='DEX' value={~~stats[1]} /></Table.Cell>
                                    <Table.Cell><ContentLine label='CON' value={~~stats[2]} /></Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell><ContentLine label='INT' value={~~stats[3]} /></Table.Cell>
                                    <Table.Cell><ContentLine label='WIS' value={~~stats[4]} /></Table.Cell>
                                    <Table.Cell><ContentLine label='CHA' value={~~stats[5]} /></Table.Cell>
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