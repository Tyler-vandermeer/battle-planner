import React from 'react';
import { Card, Divider, Header, Icon } from 'semantic-ui-react';
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

const Monster = (props) => {
    const monster = props.data.monster;

    const onXClick = (ev) => {
        props.handleRemoveMonster(props.data.id)
    }

    const statRows = {
        r1: [
            [
                { label: 'AC', value: monster.armor_class },
                { label: 'HP', value: monster.hit_points },
                { label: 'Speed', value: monster.speed?.walk }
            ]
        ],
        r2: [
            [
                { label: 'STR', value: monster.strength },
                { label: 'DEX', value: monster.dexterity },
                { label: 'CON', value: monster.constitution },
            ],
            [
                { label: 'INT', value: monster.intelligence },
                { label: 'WIS', value: monster.wisdom },
                { label: 'CHA', value: monster.charisma },
            ]
        ]
    }

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
                <InfoTable rows={statRows.r1} />
            </Card.Content>
            <Card.Content>
                <InfoTable rows={statRows.r2} />
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