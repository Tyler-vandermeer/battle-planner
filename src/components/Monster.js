import React from 'react';
import ContentLine from './ContentLine';

const getMonsterCharacteristics = (monster) => {
    return `${monster.size} ${monster.type} (${monster.subtype}), ${monster.alignment}`;
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
        <div className="ui cards">
            <div className="card">
                <div className="content">
                    <div className="header">{props.monster.name}</div>
                    <div className="meta">{getMonsterCharacteristics(props.monster)}</div>
                </div>
                <div className='content'>
                    <ContentLine label="Armor Class" value={props.monster.armor_class} />
                    <ContentLine label="Hit Points" value={props.monster.hit_points} />
                    <ContentLine label="Speed" value={props.monster.speed?.walk} />
                </div>
                <div className='content'>
                    <ContentLine label="STR" value={props.monster.strength} />
                    <ContentLine label="DEX" value={props.monster.dexterity} />
                    <ContentLine label="CON" value={props.monster.constitution} />
                    <ContentLine label="INT" value={props.monster.intelligence} />
                    <ContentLine label="WIS" value={props.monster.wisdom} />
                    <ContentLine label="CHA" value={props.monster.charisma} />
                </div>
                <div className='content'>
                    <ContentLine label="Skills" value={getProficiencies(props.monster)} />
                    <ContentLine label="Senses" value={getSenses(props.monster)} />
                    <ContentLine label="Languages" value={props.monster.languages} />
                    <ContentLine label="Challenge" value={`${props.monster.challenge_rating} (${props.monster.xp} XP)`} />
                </div>
                <div className='content'>
                    {getSpecialAbilities(props.monster)}
                    <h4 className='ui header'>Actions</h4>
                    <div className="ui divider"></div>
                    {getActions(props.monster)}
                </div>
            </div>
        </div>
    )
}

export default Monster;