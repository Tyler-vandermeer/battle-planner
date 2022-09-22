import React, { useState, useEffect } from 'react';
import { Card, Divider, Header, Icon, Table, Progress, Button, Form } from 'semantic-ui-react';
import Collapsible from 'react-collapsible';
import ContentLine from './ContentLine';
import { getModifierValue } from '../Helpers/Helpers'

const getMonsterCharacteristics = (monster) => {
    return `${monster.size} ${monster.type} ${monster.subtype === undefined ? '' : `(${monster.subtype})`}${monster.alignment}`;
}

const getProficiencies = (monster) => {
    const proficiencies = monster.proficiencies;
    if (proficiencies !== undefined) {
        return proficiencies.map((e) => `${e.proficiency.name.replace('Skill:', '')} +${e.value}`).join(', ');
    }
    return '';
}

const getSenses = (monster) => {
    const senses = monster.senses;
    if (senses !== undefined) {
        return Object.entries(senses).map(([k, v]) => `${k} ${v}`).join(', ');
    }
    return '';
}

const getSpecialAbilities = (monster) => {
    const abilities = monster.special_abilities;
    if (abilities !== undefined) {
        return abilities.map(e => <div className="description" key={e.name}><b>{e.name}: </b>{e.desc}</div>);
    }
    return '';
}

const getActions = (monster) => {
    const actions = monster.actions;
    if (actions !== undefined) {
        return actions.map(e => <div className="description" key={e.name}><b>{e.name}: </b>{e.desc}</div>);
    }
    return '';
}

const getMovementValues = (monster) => {
    const content = [];
    for (let k in monster.speed) {
        content.push(<ContentLine key={k} label={k} value={monster.speed[k]} />);
    }
    return content;
}

// const getModifierValue = (value) => Math.floor((value - 10) / 2);

const getModifierString = (value) => {
    const mod = getModifierValue(value)
    return `${value} (${mod > 0 ? '+' : ''}${mod})`
}

const Monster = (props) => {
    const monster = props.data.monster;

    const [currentHealth, setCurrentHealth] = useState(monster.hit_points);
    useEffect(() => { setCurrentHealth(monster.hit_points) }, [monster.hit_points]);

    const initialDescription = getMonsterCharacteristics(monster);

    const [edit, setEdit] = useState(false);
    const [description, setDescription] = useState(initialDescription);
    useEffect(() => { setDescription(initialDescription) }, [initialDescription]);

    const [rotate, setRotate] = useState(false);

    const movementValues = getMovementValues(monster);
    const proficiencies = getProficiencies(monster);
    const senses = getSenses(monster);
    const specialAbilities = getSpecialAbilities(monster);
    const actions = getActions(monster);

    const modifiers = {
        str: getModifierString(monster.strength),
        dex: getModifierString(monster.dexterity),
        con: getModifierString(monster.constitution),
        int: getModifierString(monster.intelligence),
        wis: getModifierString(monster.wisdom),
        cha: getModifierString(monster.charisma)
    }

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
            return Math.min(Math.max(newValue, 0), monster.hit_points);;
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
                                    <Progress value={currentHealth} total={monster.hit_points} progress='ratio' color='green' />
                                    <Button onClick={handleHealthChange} value={1}>+</Button>
                                </div>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>
                                <ContentLine label="AC" value={monster.armor_class} />
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
                            <Table.Cell>
                                <ContentLine label="STR" value={modifiers.str} />
                            </Table.Cell>
                            <Table.Cell>
                                <ContentLine label="DEX" value={modifiers.dex} />
                            </Table.Cell>
                            <Table.Cell>
                                <ContentLine label="CON" value={modifiers.con} />
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>
                                <ContentLine label="INT" value={modifiers.int} />
                            </Table.Cell>
                            <Table.Cell>
                                <ContentLine label="WIS" value={modifiers.wis} />
                            </Table.Cell>
                            <Table.Cell>
                                <ContentLine label="CHA" value={modifiers.cha} />
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </Card.Content>
            <Collapsible trigger={<Icon onClick={onExpandClick} className={rotate ? 'rotate' : ''} size='large' link name='angle down' />}>
                <Card.Content>
                    <ContentLine label="Skills" value={proficiencies} />
                    <ContentLine label="Senses" value={senses} />
                    <ContentLine label="Languages" value={monster.languages} />
                    <ContentLine label="Challenge" value={`${monster.challenge_rating} (${monster.xp} XP)`} />
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