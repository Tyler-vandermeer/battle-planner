import React, { useEffect, useState } from 'react';
import { Button, Card, Icon, Progress, Table } from 'semantic-ui-react';
import ContentLine from './ContentLine';
import MonsterModal from './MonsterModal';

const StatBlockBase = (props) => {
    const monster = props.data.monster;

    const [currentHealth, setCurrentHealth] = useState(monster.currentHealth ?? monster.hp);
    useEffect(() => { setCurrentHealth(monster.currentHealth ?? monster.hp) }, [monster.currentHealth, monster.hp]);

    const [edit, setEdit] = useState(false);

    const movementValues = monster.getMovement();

    const statCells = monster.stats.map((v) => {
        return (
            <Table.Cell key={v.name}>
                <ContentLine label={v.name} value={`${v.value} (${v.modifier > 0 ? '+' : ''}${v.modifier})`} />
            </Table.Cell>
        )
    });

    const onClickEdit = (ev) => {
        // if edit is true monster modal is currently open and the monster has been updated
        if (edit)
            props.handleMonsterUpdate(props.data.id, monster);

        setEdit(previous => !previous);
    }

    const onClickX = (ev) => {
        props.handleRemoveMonster(props.data.id)
    }

    const handleHealthChange = (ev) => {
        setCurrentHealth((previous) => {
            const newValue = previous + ~~ev.target.value;

            monster.currentHealth = Math.min(Math.max(newValue, 0), monster.hp);

            props.handleMonsterUpdate(props.data.id, monster);

            return monster.currentHealth;
        });
    }

    return (
        <Card className='monsterCard' data-id={props.data.id}>
            <Icon className='absRight' style={{ top: '0.15em' }} onClick={onClickX} link name='cancel' />
            <Icon onClick={onClickEdit} className='absLeft' link name='edit outline' />
            <Card.Content>
                <Card.Header>{monster.name}</Card.Header>
                <Card.Meta>
                    <pre className='margin0'>{monster.desc}</pre>
                </Card.Meta>
            </Card.Content>
            <Card.Content>
                <Table unstackable className='monsterTable'>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell colSpan='3'>
                                <div className='healthBar'>
                                    <Button onClick={handleHealthChange} value={-1}>-</Button>
                                    <Progress value={currentHealth} total={monster.hp} progress='ratio' color='green' />
                                    <Button onClick={handleHealthChange} value={1}>+</Button>
                                </div>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>
                                <ContentLine label="AC" value={monster.ac} />
                            </Table.Cell>
                            <Table.Cell>
                                <ContentLine label="Iniative" value={monster.iniative} />
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
            <MonsterModal open={edit} toggleOpen={onClickEdit} monster={monster} />
        </Card>
    )
}

export default StatBlockBase;