import React from 'react';
import { Card, Divider, Header } from 'semantic-ui-react';
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
                <ContentLine label="Armor Class" value={props.monster.armor_class} />
                <ContentLine label="Hit Points" value={props.monster.hit_points} />
                <ContentLine label="Speed" value={props.monster.speed?.walk} />
            </Card.Content>
            <Card.Content>
                <ContentLine label="STR" value={props.monster.strength} />
                <ContentLine label="DEX" value={props.monster.dexterity} />
                <ContentLine label="CON" value={props.monster.constitution} />
                <ContentLine label="INT" value={props.monster.intelligence} />
                <ContentLine label="WIS" value={props.monster.wisdom} />
                <ContentLine label="CHA" value={props.monster.charisma} />
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