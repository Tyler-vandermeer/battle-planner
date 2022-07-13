import React from 'react';
import { Card, Divider, Header, Table } from 'semantic-ui-react';
import ContentLine from './ContentLine';

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

const Monster = (props) => {
    return (
        <Card>
            <Card.Content>
                <Card.Header>{props.monster.name}</Card.Header>
                <Card.Meta>{getMonsterCharacteristics(props.monster)}</Card.Meta>
            </Card.Content>
            <Card.Content>
                <Table className='monsterTable'>
                    <Table.Row>
                        <Table.Cell>
                            <ContentLine label="AC" value={props.monster.armor_class} />
                        </Table.Cell>
                        <Table.Cell>
                            <ContentLine label="HP" value={props.monster.hit_points} />
                        </Table.Cell>
                        <Table.Cell>
                            <ContentLine label="Speed" value={props.monster.speed?.walk} />
                        </Table.Cell>
                    </Table.Row>
                </Table>
            </Card.Content>
            <Card.Content>
                <Table className='monsterTable'>
                    <Table.Row>
                        <Table.Cell>
                            <ContentLine label="STR" value={props.monster.strength} />
                        </Table.Cell>
                        <Table.Cell>
                            <ContentLine label="DEX" value={props.monster.dexterity} />
                        </Table.Cell>
                        <Table.Cell>
                            <ContentLine label="CON" value={props.monster.constitution} />
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            <ContentLine label="INT" value={props.monster.intelligence} />
                        </Table.Cell>
                        <Table.Cell>
                            <ContentLine label="WIS" value={props.monster.wisdom} />
                        </Table.Cell>
                        <Table.Cell>
                            <ContentLine label="CHA" value={props.monster.charisma} />
                        </Table.Cell>
                    </Table.Row>
                </Table>
            </Card.Content>
            <Card.Content>
                <ContentLine label="Skills" value={getProficiencies(props.monster)} />
                <ContentLine label="Senses" value={getSenses(props.monster)} />
                <ContentLine label="Languages" value={props.monster.languages} />
                <ContentLine label="Challenge" value={`${props.monster.challenge_rating} (${props.monster.xp} XP)`} />
            </Card.Content>
            <Card.Content>
                {getSpecialAbilities(props.monster)}
                <Header as='h4'>Actions</Header>
                <Divider />
                {getActions(props.monster)}
            </Card.Content>
        </Card>
    )
}

export default Monster;