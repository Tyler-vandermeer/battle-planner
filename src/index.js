import react from 'react';
import { createRoot } from 'react-dom/client';

const getMonsterData = async (monsterName) => {
    const response = await fetch(`https://www.dnd5eapi.co/api/monsters/${monsterName}`);
    return await response.json();
}

class App extends react.Component {
    state = { monster: {} };

    componentDidMount() {
        getMonsterData('goblin')
            .then((res) => {
                this.setState({ monster: res }, () => { console.log(this.state); });
            })
            .catch((err) => { console.log(err); });
    }

    getMonsterCharacteristics() {
        const monster = this.state.monster;
        return `${monster.size} ${monster.type} (${monster.subtype}), ${monster.alignment}`;
    }

    getProficiencies() {
        const proficiencies = this.state.monster.proficiencies;
        if (proficiencies !== undefined) {
            return proficiencies.map((e) => `${e.proficiency.name.replace('Skill:', '')} +${e.value}`).join(', ');
        }
        return '';
    }

    getSenses() {
        const senses = this.state.monster.senses;
        if (senses !== undefined) {
            return Object.entries(senses).map(([k, v]) => `${k} ${v}`).join(', ');
        }
        return '';
    }

    getSpecialAbilities() {
        const abilities = this.state.monster.special_abilities;
        if (abilities !== undefined) {
            return abilities.map(e => <div className="description" key={e.name}><b>{e.name}: </b>{e.desc}</div>);
        }
        return '';
    }

    getActions() {
        const actions = this.state.monster.actions;
        if (actions !== undefined) {
            return actions.map(e => <div className="description" key={e.name}><b>{e.name}: </b>{e.desc}</div>);
        }
        return '';
    }

    render() {
        return (
            <div className='ui container'>
                <div className="ui cards">
                    <div className="card">
                        <div className="content">
                            <div className="header">{this.state.monster.name}</div>
                            <div className="meta">{this.getMonsterCharacteristics()}</div>
                        </div>
                        <div className='content'>
                            <div className="description"><b>Armor Class:</b> {this.state.monster.armor_class}</div>
                            <div className="description"><b>Hit Points:</b> {this.state.monster.hit_points}</div>
                            <div className="description"><b>Speed:</b> {this.state.monster.speed?.walk}</div>
                        </div>
                        <div className='content'>
                            <div className="description"><b>STR: </b>{this.state.monster.strength}</div>
                            <div className="description"><b>DEX: </b>{this.state.monster.dexterity}</div>
                            <div className="description"><b>CON: </b>{this.state.monster.constitution}</div>
                            <div className="description"><b>INT: </b>{this.state.monster.intelligence}</div>
                            <div className="description"><b>WIS: </b>{this.state.monster.wisdom}</div>
                            <div className="description"><b>CHA: </b>{this.state.monster.charisma}</div>
                        </div>
                        <div className='content'>
                            <div className="description"><b>Skills: </b>{this.getProficiencies()}</div>
                            <div className="description"><b>Senses: </b>{this.getSenses()}</div>
                            <div className="description"><b>Languages: </b>{this.state.monster.languages}</div>
                            <div className="description"><b>Challenge: </b>{this.state.monster.challenge_rating} ({this.state.monster.xp} XP)</div>
                        </div>
                        <div className='content'>
                            {this.getSpecialAbilities()}
                            <h4 className='ui header'>Actions</h4>
                            <div className="ui divider"></div>
                            {this.getActions()}
                        </div>
                    </div>
                </div>
            </div>
        )
    };
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);