import React from 'react';
import { Container, Header, Grid, Card, Divider } from 'semantic-ui-react';
import Monster from './Monster';
import SearchBar from './SearchBar';
import dnd5e from '../api/dnd5e';
import Player from './Player';
import MonsterModel from '../api/MonsterModel';

class App extends React.Component {
    state = {
        monsters: [], searchOptions: [], players: {
            Rohkume: { name: 'Rohkume', portrait: 'half-orc-icon.png', AC: '17', speed: '30 ft.', iniative: 0, stats: [16, 13, 16, 12, 17, 9] },
            Faen: { name: 'Faen', portrait: 'elf-icon.png', AC: '11', speed: '35 ft.', iniative: 0, stats: [9, 13, 12, 13, 16, 16] },
            Ash: { name: 'Ash', portrait: 'dragonborn-icon.png', AC: '13', speed: '30 ft.', iniative: 0, stats: [17, 13, 13, 11, 9, 10] }
        }
    };

    addMonster = async (monsterName) => {
        const response = await dnd5e.get(`/monsters/${monsterName}`);
        const monster = response.data;

        const monsterModel = new MonsterModel(this.getMonsterIndex(monster.index), monster);
        
        this.setState({ monsters: [{ id: monsterModel.id, monster: monsterModel }, ...this.state.monsters] });
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
        if (process.env.NODE_ENV !== 'production')
            this.init();
        this.loadMonsters();
    }

    // This coul probably be moved to a separate monster grid component
    monsters = () => {
        const grid = {
            c1: [],
            c2: [],
            c3: []
        };

        for (let i = 0; i < this.state.monsters.length; i++) {
            const monster = <Monster key={i} index={i} data={this.state.monsters[i]} handleRemoveMonster={this.handleRemoveMonster} />;
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

    updatePlayerIniative = (value, name) => {
        const players = this.state.players;
        players[name].iniative = value;
        this.setState({ players: players });
    }

    highlightCharacter = (ev) => {
        const elements = document.querySelectorAll(`[data-id="${ev.currentTarget.dataset.id}"]`);
        elements.forEach((e) => {
            e.classList.add('highlight');
        });
    }

    unhiglightCharacter = (ev) => {
        const elements = document.querySelectorAll(`[data-id="${ev.currentTarget.dataset.id}"]`);
        elements.forEach((e) => {
            e.classList.remove('highlight');
        });
    }

    iniativeOrder = () => {
        const players = this.state.players;
        var characterList = [
            ...this.state.monsters.map((v) => { return { name: v.monster.name, iniative: v.monster.iniative, index: v.id } }),
            { name: players.Rohkume.name, iniative: players.Rohkume.iniative, index: players.Rohkume.name },
            { name: players.Faen.name, iniative: players.Faen.iniative, index: players.Faen.name },
            { name: players.Ash.name, iniative: players.Ash.iniative, index: players.Ash.name }
        ];

        characterList.sort((a, b) => b.iniative - a.iniative);

        return characterList.map((v, i) => {
            return (
                <Card key={i} data-id={v.index} onMouseEnter={this.highlightCharacter} onMouseLeave={this.unhiglightCharacter}>
                    <Card.Content>
                        <Card.Header>{v.name}: {v.iniative}</Card.Header>
                    </Card.Content>
                </Card>
            )
        });
    }

    handleSearchSubmit = (monsterName) => {
        this.addMonster(monsterName);
    }

    handleRemoveMonster = (id) => {
        this.setState({ monsters: this.state.monsters.filter(x => x.id !== id) });
    }

    // TODO:
    // Move iniative order to be a row above the search and make it have scrollable overflow x
    // on hover for side bar will highlight the player/monster it represents
    // Make the skills & actions look better with a table
    // Add top section that will hold PCs
    // Add current condition effects to monster
    // maybe make descriptions of abilities tool tips
    // add tool tips for spells
    // Add component for editable field for changing stats
    // Have some of them be able to be temprary additions (modifiers)
    // Add desc tooltip for the monster
    // Make it save data to local storage so it remembers where you left off (need to save monster names, health, modifiers, initiative)
    // Maybe make it so it can be exported to a json file
    // Maybe change the mouse events for changing the iniative for players

    render() {
        return (
            <Container textAlign='center' fluid>
                <Header as='h2'>Battle Tracker</Header>
                <Card.Group centered>
                    <Player {...this.state.players.Rohkume} updateIniative={this.updatePlayerIniative} />
                    <Player {...this.state.players.Faen} updateIniative={this.updatePlayerIniative} />
                    <Player {...this.state.players.Ash} updateIniative={this.updatePlayerIniative} />
                </Card.Group>
                <Divider />
                <SearchBar options={this.state.searchOptions} onSubmit={this.handleSearchSubmit} />
                <br />
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={14}>
                            <Grid relaxed stackable padded columns={3}>
                                {this.monsters()}
                            </Grid>
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Container style={{ paddingTop: '1rem' }}>
                                {this.iniativeOrder()}
                            </Container>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        )
    };
}

export default App;