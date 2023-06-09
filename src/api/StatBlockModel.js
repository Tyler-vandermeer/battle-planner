
import { getModifierValue } from '../Helpers/Helpers'
import ContentLine from '../components/ContentLine';

export default class StatBlock {
    constructor(id, statBlock, type) {
        this.id = id;
        this.type = type;
        this.init(statBlock);
    }

    getSenses() {
        return this.senses ? this.senses.map((v) => `${v.name} ${v.value}`).join(', ') : '';
    }

    getMovement() {
        return this.movement ? this.movement.map((v) => <ContentLine key={v.name} label={v.name} value={v.value} />) : '';
    }

    init(statBlock) {
        this.name = statBlock?.name ?? '';
        this.desc = statBlock ? `${statBlock.size} ${statBlock.type} ${statBlock.subtype === undefined ? '' : `(${statBlock.subtype})`}${statBlock.alignment}` : '';
        this.hp = statBlock?.hit_points ?? 0;
        this.ac = statBlock?.armor_class[0].value ?? 0;
        this.iniative = Math.floor(Math.random() * 20 + 1) + getModifierValue(statBlock?.dexterity ?? 10);
        this.movement = statBlock ? this.getNameValueList(statBlock.speed) : '';
        this.setStatsArray(statBlock);
    }

    updateProperties(statBlockProps) {
        for (let key in statBlockProps)
            this[key] = statBlockProps[key];
        this.updateStatModifiers();
    }

    updateStatModifiers() {
        for (var stat of this.stats)
            stat.modifier = getModifierValue(stat.value);
    }

    setStatsArray(statBlock) {
        this.stats = [];
        for (var statName of ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']) {
            const value = statBlock ? statBlock[statName] : 10;
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
}