
import { getModifierValue } from '../Helpers/Helpers'
import ContentLine from '../components/ContentLine';

export default class MonsterModel {
    constructor(id, monster) {
        this.id = id;
        this.init(monster);
    }

    getSenses() {
        return this.senses.map((v) => `${v.name} ${v.value}`).join(', ');
    }

    getMovement() {
        return this.movement.map((v) => <ContentLine key={v.name} label={v.name} value={v.value} />);
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
        this.ac = monster.armor_class;
        this.iniative = Math.floor(Math.random() * 20 + 1) + getModifierValue(monster.dexterity);
        this.languages = monster.languages;
        this.xp = monster.xp;
        this.conditionImmunities = monster.condition_immunities;
        this.damageImmunities = monster.damage_immunities;
        this.damageResistances = monster.damage_resistances;
        this.damageVulnerabilities = monster.damage_vulnerabilities;
        this.challengeRating = monster.challenge_rating;

        this.setStatsArray(monster);
        this.movement = this.getNameValueList(monster.speed);
        this.senses = this.getNameValueList(monster.senses);
        this.setProficienciesList(monster);
        this.specialAbilities = this.getAbilities(monster.special_abilities);
        this.actions = this.getAbilities(monster.actions);
        this.legendaryActions = this.getAbilities(monster.legendary_actions);
        this.reactions = this.getAbilities(monster.reactions);
    }

    updateProperties(monsterProps) {
        for (let key in monsterProps)
            this[key] = monsterProps[key];
        this.updateStatModifiers();
    }

    updateStatModifiers() {
        for (var stat of this.stats)
            stat.modifier = getModifierValue(stat.value);
    }

    setStatsArray(monster) {
        this.stats = [];
        for (var statName of ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']) {
            const value = monster[statName];
            this.stats.push({
                name: statName.slice(0, 3).toUpperCase(),
                value: value,
                modifier: getModifierValue(value)
            });
        }
    }

    getNameValueList(property, isValueNumber = false) {
        const nameValues = [];
        for (let k in property) {
            nameValues.push({ name: k, value: isValueNumber ? property[k] : `${property[k]}` });
        }
        return nameValues;
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