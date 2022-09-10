import React from 'react';
import { Container, Header, Grid } from 'semantic-ui-react';
import Monster from './Monster';
import SearchBar from './SearchBar';
import dnd5e from '../api/dnd5e';

class App extends React.Component {
    state = { monsters: [], searchOptions: [] };

    addMonster = async (monsterName) => {
        const response = await dnd5e.get(`/monsters/${monsterName}`);
        this.setState({ monsters: [{ id: this.getMonsterIndex(response.data.index), monster: response.data }, ...this.state.monsters] });
    }

    getMonsterIndex = (monsterIndex) => {
        return monsterIndex + this.state.monsters.filter(x => x.monster.index === monsterIndex).length;
    }

    loadMonsters = async () => {
        const response = await dnd5e.get(`/monsters`);
        this.setState({ searchOptions: response.data.results.map((m) => { return { key: m.index, value: m.index, text: m.name } }) });
    }

    init = async () => {
        await this.addMonster('aboleth');
        await this.addMonster('goblin');
        await this.addMonster('goblin');
        await this.addMonster('goblin');
        await this.addMonster('goblin');
    }

    componentDidMount() {
        if (process.env.NODE_ENV !== 'production')
            this.init();
        this.loadMonsters();
    }

    monsters = () => {
        const grid = {
            c1: [],
            c2: [],
            c3: []
        };
        
        for(let i = 0; i < this.state.monsters.length; i++) {
            const monster = <Monster key={i} data={this.state.monsters[i]} handleRemoveMonster={this.handleRemoveMonster} />;
            switch (i % 3) {
                case 0: grid.c1.push(monster); break;
                case 1: grid.c2.push(monster); break;
                case 2: grid.c3.push(monster); break;
                default: break;
            }
        }

        return (
            <Grid.Row>
                <Grid.Column>{grid.c1}</Grid.Column>
                <Grid.Column>{grid.c2}</Grid.Column>
                <Grid.Column>{grid.c3}</Grid.Column>
            </Grid.Row>
        )
    }

    handleSearchSubmit = (monsterName) => {
        this.addMonster(monsterName);
    }

    handleRemoveMonster = (id) => {
        this.setState({ monsters: this.state.monsters.filter(x => x.id !== id) });
    }

    // TODO:
    // Make the skills & actions look better with a table
    // Add top section that will hold PCs
    // Add current condition effects to monster
    // maybe make descriptions of abilities tool tips
    // add tool tips for spells
    // Add component for editable field for changing stats
    // Have some of them be able to be temprary additions (modifiers)
    // Add desc tooltip for the monster
    // Make it save data to local storage so it remembers where you left off
    // Maybe make it so it can be exported to a json file

    render() {
        return (
            <div>
                <Container textAlign='center' fluid>
                    <Header as='h2'>Battle Tracker</Header>
                    <SearchBar options={this.state.searchOptions} onSubmit={this.handleSearchSubmit} />
                    <Grid relaxed stackable padded columns={3}>
                        {this.monsters()}
                    </Grid>
                </Container>
            </div>
        )
    };
}

export default App;