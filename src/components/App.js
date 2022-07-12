import React from 'react';
import { Container, Header, Grid } from 'semantic-ui-react';
import Monster from './Monster';
import SearchBar from './SearchBar';
import dnd5e from '../api/dnd5e';

class App extends React.Component {
    state = { monsters: [], searchOptions: [] };

    getMonsterData = async (monsterName) => {
        const response = await dnd5e.get(`/monsters/${monsterName}`);
        this.setState({ monsters: [response.data, ...this.state.monsters] });
    }

    loadMonsters = async () => {
        const response = await dnd5e.get(`/monsters`);
        this.setState({ searchOptions: response.data.results.map((m) => { return { key: m.index, value: m.index, text: m.name } }) });
    }

    componentDidMount() {
        this.getMonsterData('goblin');
        this.getMonsterData('goblin');
        this.getMonsterData('goblin');
        this.getMonsterData('goblin');
        this.getMonsterData('goblin');
        this.loadMonsters();
    }

    monsters = () => {
        return this.state.monsters.map((m, i) => { return <Grid.Column key={i}><Monster monster={m} /></Grid.Column> });
    }

    // TODO:
    // Add the ability to add custom descriptors to monsters
    // Add ability to modify amount of health
    // Add current condition effects to monster

    render() {
        return (
            <div>
                <Container textAlign='center' fluid>
                    <Header as='h2'>Battle Planner</Header>
                    <SearchBar options={this.state.searchOptions} />
                    <Grid relaxed padded columns={4}>
                        {this.monsters()}
                    </Grid>
                </Container>
            </div>
        )
    };
}

export default App;