
import { getModifierValue } from '../Helpers/Helpers'

export default class MonsterModel {
    constructor(id, monster) {
        this.id = id;

        this.init(monster);
    }

    init(monster) {
        this.name = monster.name;
        this.desc = `${monster.size} ${monster.type} ${monster.subtype === undefined ? '' : `(${monster.subtype})`}${monster.alignment}`;
        this.hp = monster.hit_points;
        this.ac = monster.armor_class;
        this.languages = monster.languages;
        this.xp = monster.xp;
        this.conditionImmunities = monster.condition_immunities;
        this.damageImmunities = monster.damage_immunities;
        this.damageResistances = monster.damage_resistances;
        this.damageVulnerabilities = monster.damage_vulnerabilities;

        this.setStatsArray(monster);
        this.movement = this.getNameValueList(monster.speed);
        this.senses = this.getNameValueList(monster.senses);
        this.setProficienciesList(monster);
        this.specialAbilities = this.getActions(monster.special_abilities);
        // do something about spells
        this.actions = this.getActions(monster.actions);
        this.legendaryActions = this.getActions(monster.legendary_actions);
        this.reactions = this.getActions(monster.reactions);
    }

    setStatsArray(monster) {
        this.stats = [];
        for (var statName of ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']) {
            const value = monster[statName];
            this.stats.push({
                name: statName,
                value: value,
                modifier: getModifierValue(value)
            });
        }
    }

    getNameValueList(property) {
        const nameValues = [];
        for (let k in property) {
            console.log(k, property[k]);
            nameValues.push({ name: k, value: `${property[k]}` });
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

    getActions(actions) {
        if (actions === undefined)
            return [];

        const normalizedActions = []
        for (let ability of actions) {
            normalizedActions.push({
                name: ability.name,
                desc: ability.desc,
                usage: ability.usage
            });
        }
        return normalizedActions;
    }
}