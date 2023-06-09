import React, { useEffect, useState } from 'react';
import { Button, Card, Icon, Progress, Table } from 'semantic-ui-react';
import ContentLine from './ContentLine';

const StatBlockBase = (props) => {
    const statBlock = props.data.statBlock;

    const [currentHealth, setCurrentHealth] = useState(statBlock.currentHealth ?? statBlock.hp);
    useEffect(() => { setCurrentHealth(statBlock.currentHealth ?? statBlock.hp) }, [statBlock.currentHealth, statBlock.hp]);

    const movementValues = statBlock.getMovement();

    const statCells = statBlock.stats.map((v) => {
        return (
            <Table.Cell key={v.name}>
                <ContentLine label={v.name} value={`${v.value} (${v.modifier > 0 ? '+' : ''}${v.modifier})`} />
            </Table.Cell>
        )
    });

    const onClickX = (ev) => {
        props.handleRemoveStatBlock(props.data.id)
    }

    const handleHealthChange = (ev) => {
        setCurrentHealth((previous) => {
            const newValue = previous + ~~ev.target.value;

            statBlock.currentHealth = Math.min(Math.max(newValue, 0), statBlock.hp);

            props.handleStatBlockUpdate(props.data.id, statBlock);

            return statBlock.currentHealth;
        });
    }

    return (
        <Card className='statBlockCard' data-id={props.data.id}>
            <Icon className='absRight' style={{ top: '0.15em' }} onClick={onClickX} link name='cancel' />
            <Card.Content>
                <Card.Header>{statBlock.name}</Card.Header>
                <Card.Meta>
                    <pre className='margin0'>{statBlock.desc}</pre>
                </Card.Meta>
            </Card.Content>
            <Card.Content>
                <Table unstackable className='statBlockTable'>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell colSpan='3'>
                                <div className='healthBar'>
                                    <Button onClick={handleHealthChange} value={-1}>-</Button>
                                    <Progress value={currentHealth} total={statBlock.hp} progress='ratio' color='green' />
                                    <Button onClick={handleHealthChange} value={1}>+</Button>
                                </div>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>
                                <ContentLine label="AC" value={statBlock.ac} />
                            </Table.Cell>
                            <Table.Cell>
                                <ContentLine label="Iniative" value={statBlock.iniative} />
                            </Table.Cell>
                            <Table.Cell>
                                {movementValues}
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </Card.Content>
            <Card.Content>
                <Table unstackable className='statBlockTable'>
                    <Table.Body>
                        <Table.Row>
                            {statCells.slice(0, 3)}
                        </Table.Row>
                        <Table.Row>
                            {statCells.slice(3)}
                        </Table.Row>
                    </Table.Body>
                </Table>
            </Card.Content>
            {props.children}
        </Card>
    )
}

export default StatBlockBase;