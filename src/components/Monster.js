import React, { useState, useEffect } from 'react';
import { Card, Divider, Header, Icon, Table, Progress, Button, Form } from 'semantic-ui-react';
import Collapsible from 'react-collapsible';
import ContentLine from './ContentLine';

const Monster = (props) => {
    const monster = props.data.monster;

    const [currentHealth, setCurrentHealth] = useState(monster.hp);
    useEffect(() => { setCurrentHealth(monster.hp) }, [monster.hp]);

    const initialDescription = monster.desc;

    const [edit, setEdit] = useState(false);
    const [description, setDescription] = useState(initialDescription);
    useEffect(() => { setDescription(initialDescription) }, [initialDescription]);

    const [rotate, setRotate] = useState(false);

    const movementValues = monster.getMovement();
    const proficiencies = monster.getProficiencies();
    const senses = monster.getSenses();
    const specialAbilities = monster.getSpecialAbilities();
    const actions = monster.getActions();

    const statCells = monster.stats.map((v) => {
        return (
            <Table.Cell key={v.name}>
                <ContentLine label={v.name} value={`${v.value} (${v.modifier > 0 ? '+' : ''}${v.modifier})`} />
            </Table.Cell>
        )
    });

    const onClickEdit = (ev) => setEdit(previous => !previous);

    const onClickX = (ev) => {
        props.handleRemoveMonster(props.data.id)
    }

    const handleDescriptionChange = (ev) => {
        setDescription(p => ev.target.value);
    }

    const handleHealthChange = (ev) => {
        setCurrentHealth((previous) => {
            const newValue = previous + ~~ev.target.value;
            return Math.min(Math.max(newValue, 0), monster.hp);;
        });
    }

    const onExpandClick = (ev) => setRotate(p => !p);

    return (
        <Card className='monsterCard' data-id={props.data.id}>
            <Icon className='absRight' style={{ top: '0.15em' }} onClick={onClickX} link name='cancel' />
            <Card.Content>
                <Card.Header>{monster.name}</Card.Header>
                <Card.Meta>
                    <div className={edit ? 'hide' : 'monsterMeta'}>
                        <pre className='margin0'>{description}</pre>
                    </div>
                    <Icon onClick={onClickEdit} className='absRight' style={{ right: '0.4em' }} link name='edit outline' />
                </Card.Meta>
                <Form onSubmit={(ev) => ev.preventDefault()} className={edit ? 'editArea' : 'hide'}>
                    <Form.TextArea onChange={handleDescriptionChange} value={description} />
                </Form>
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
                <Table unstackable className='monsterTable'>
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
            <Collapsible trigger={<Icon onClick={onExpandClick} className={rotate ? 'rotate' : ''} size='large' link name='angle down' />}>
                <Card.Content>
                    <ContentLine label="Skills" value={proficiencies} />
                    <ContentLine label="Senses" value={senses} />
                    <ContentLine label="Languages" value={monster.languages} />
                    <ContentLine label="Challenge" value={`${monster.challengeRating} (${monster.xp} XP)`} />
                </Card.Content>
                <Card.Content>
                    {specialAbilities}
                    <Header as='h4'>Actions</Header>
                    <Divider />
                    {actions}
                </Card.Content>
            </Collapsible>
        </Card>
    )
}

export default Monster;