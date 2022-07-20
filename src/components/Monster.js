import React, { useState, useEffect } from 'react';
import { Card, Divider, Header, Icon, Table, Progress, Button, Input, Form } from 'semantic-ui-react';
import ContentLine from './ContentLine';
import InfoTable from './InfoTable';

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
    for(let k in monster.speed) {
        content.push(<ContentLine key={k} label={k} value={monster.speed[k]} />);
    }
    return content;
}

const Monster = (props) => {
    const [currentHealth, setCurrentHealth] = useState(props.data.monster.hit_points);
    useEffect(() => { setCurrentHealth(props.data.monster.hit_points) }, [props.data.monster.hit_points]);

    const monster = props.data.monster;

    const onXClick = (ev) => {
        props.handleRemoveMonster(props.data.id)
    }

    const getModifierValue = (value) => Math.floor((value - 10) / 2);

    const getModifierString = (value) =>{
        const mod = getModifierValue(value)
        return `${value} (${mod > 0 ? '+' : ''}${mod})`
    }

    const handleHealthChange = (ev) => {
        setCurrentHealth((previous) => {
            const newValue = previous + ~~ev.target.value;
            return newValue > monster.hit_points ? monster.hit_points : newValue;
        });
    }

    const rollIniative = () => Math.floor(Math.random() * 20 + 1) + getModifierValue(monster.dexterity);

    // const statRows = {
    //     r1: [
    //         [
    //             { label: 'AC', value: monster.armor_class },
    //             { label: 'HP', value: monster.hit_points },
    //             { label: 'Speed', value: monster.speed?.walk }
    //         ]
    //     ],
    //     r2: [
    //         [
    //             { label: 'STR', value: monster.strength },
    //             { label: 'DEX', value: monster.dexterity },
    //             { label: 'CON', value: monster.constitution },
    //         ],
    //         [
    //             { label: 'INT', value: monster.intelligence },
    //             { label: 'WIS', value: monster.wisdom },
    //             { label: 'CHA', value: monster.charisma },
    //         ]
    //     ]
    // }

    return (
        <Card>
            <Card.Content>
                <Card.Header>
                    {monster.name}
                    <Icon onClick={onXClick} link size='small' name='cancel' />
                </Card.Header>
                <Card.Meta>{getMonsterCharacteristics(monster)}</Card.Meta>
            </Card.Content>
            <Card.Content>
                <Table className='monsterTable'>
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
                                <ContentLine label="Iniative" value={rollIniative()} />
                            </Table.Cell>
                            <Table.Cell>
                                {getMovementValues(monster)}
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </Card.Content>
            <Card.Content>
                <Table className='monsterTable'>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>
                                <ContentLine label="STR" value={getModifierString(monster.strength)} />
                            </Table.Cell>
                            <Table.Cell>
                                <ContentLine label="DEX" value={getModifierString(monster.dexterity)} />
                            </Table.Cell>
                            <Table.Cell>
                                <ContentLine label="CON" value={getModifierString(monster.constitution)} />
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>
                                <ContentLine label="INT" value={getModifierString(monster.intelligence)} />
                            </Table.Cell>
                            <Table.Cell>
                                <ContentLine label="WIS" value={getModifierString(monster.wisdom)} />
                            </Table.Cell>
                            <Table.Cell>
                                <ContentLine label="CHA" value={getModifierString(monster.charisma)} />
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </Card.Content>
            <Card.Content>
                <ContentLine label="Skills" value={getProficiencies(monster)} />
                <ContentLine label="Senses" value={getSenses(monster)} />
                <ContentLine label="Languages" value={monster.languages} />
                <ContentLine label="Challenge" value={`${monster.challenge_rating} (${monster.xp} XP)`} />
            </Card.Content>
            <Card.Content>
                {getSpecialAbilities(monster)}
                <Header as='h4'>Actions</Header>
                <Divider />
                {getActions(monster)}
            </Card.Content>
        </Card>
    )
}

export default Monster;