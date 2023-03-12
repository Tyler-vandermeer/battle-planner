
import { getModifierValue } from '../Helpers/Helpers'
import ContentLine from '../components/ContentLine';
import StatBlock from './StatBlockModel';

export default class StatBlockMonsterModel extends StatBlock {
    constructor(id, statBlock) {
        super(id, statBlock, 'monster');
        statBlock && this.init(statBlock);
    }

    getProficiencies() {
        const types = [...new Set(this.proficiencies.map(({ type }) => type))];
        const content = [];
        const filterByType = (v) => v.type === type;

        for (var type of types) {
            const proficiencies = this.proficiencies
                .filter(filterByType)
                .map((v) => `${v.name} ${v.value}`)
                .join(', ');
            content.push(<ContentLine key={type} label={type} value={proficiencies} />);
        }

        return content;
    }

    getSpecialAbilities(property) {
        return this.specialAbilities.map(v => <ContentLine key={v.name} className='description' label={v.name} value={v.desc} />)
    }

    getActions() {
        return this.actions.map(v => <ContentLine key={v.name} className='description' label={v.name} value={v.desc} />)
    }

    init(monster) {
        this.name = monster.name;
        this.desc = `${monster.size} ${monster.type} ${monster.subtype === undefined ? '' : `(${monster.subtype})`}${monster.alignment}`;
        this.hp = monster.hit_points;
        this.ac = monster.armor_class[0].value;
        this.iniative = Math.floor(Math.random() * 20 + 1) + getModifierValue(monster.dexterity);
        
        this.setStatsArray(monster);
        this.movement = this.getNameValueList(monster.speed);
    }

    setProficienciesList(monster) {
        this.proficiencies = [];
        for (let proficiency of monster.proficiencies) {
            let name = proficiency.proficiency.name.split(':');
            this.proficiencies.push({
                type: name[0],
                name: name[1],
                value: proficiency.value
            });
        }
    }

    getAbilities(actions) {
        if (actions === undefined)
            return [];

        const normalizedActions = []
        for (let ability of actions) {
            const action = {
                type: 'action',
                name: ability.name,
                desc: ability.desc,
                usage: ability.usage
            };

            if (ability.spellcasting !== undefined) {
                const spellcasting = ability.spellcasting;
                action.type = 'spellcasting';
                action.ability = spellcasting.ability.name;
                action.dc = spellcasting.dc;
                action.modifier = spellcasting.modifier;
                action.slots = this.getNameValueList(spellcasting.slots);
                action.spells = spellcasting.spells;
            }

            normalizedActions.push(action);
        }
        return normalizedActions;
    }
}