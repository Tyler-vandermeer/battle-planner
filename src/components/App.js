import React from 'react';
import { Container, Header, Grid } from 'semantic-ui-react';
import Monster from './Monster';
import SearchBar from './SearchBar';
import dnd5e from '../api/dnd5e';

class App extends React.Component {
    state = { monsters: [], searchOptions: [] };

    addMonster = async (monsterName) => {
        const response = await dnd5e.get(`/monsters/${monsterName}`);
        this.setState({ monsters: [{ id: this.getMonsterIndex(response.data.index), monster: response.data}, ...this.state.monsters] });
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
        // await this.addMonster('goblin');
        // await this.addMonster('goblin');
        // await this.addMonster('goblin');
        // await this.addMonster('goblin');
    }

    componentDidMount() {
        this.init();
        this.loadMonsters();
    }

    monsters = () => {
        return this.state.monsters.map((m, i) => { return <Grid.Column key={i}><Monster key={i} data={m} handleRemoveMonster={this.handleRemoveMonster} /></Grid.Column> });
    }

    handleSearchSubmit = (monsterName) => {
        this.addMonster(monsterName);
    }

    handleRemoveMonster = (id) => {
        this.setState({ monsters: this.state.monsters.filter(x => x.id !== id)});
    }

    // TODO:
    // Add component for editable field for changing stats
    // Have some of them be able to be temprary additions (modifiers)
    // Add the ability to add custom descriptors to monsters
    // Add current condition effects to monster
    // maybe make descriptions of abilities tool tips

    render() {
        return (
            <div>
                <Container textAlign='center' fluid>
                    <Header as='h2'>Battle Tracker</Header>
                    <SearchBar options={this.state.searchOptions} onSubmit={this.handleSearchSubmit} />
                    <Grid relaxed padded columns={3}>
                        {this.monsters()}
                    </Grid>
                </Container>
            </div>
        )
    };
}

export default App;