import React from 'react';
import { Card, Container, Divider, Grid, Header, Icon } from 'semantic-ui-react';
import dnd5e from '../api/dnd5e';
import StatBlockMonsterModel from '../api/StatBlockMonsterModel';
import * as Constants from '../Helpers/Constants';
import Player from './Player';
import SearchBar from './SearchBar';
import StatBlockActions from './StatBlockActions';
import StatBlockBase from './StatBlockBase';

class App extends React.Component {
    state = {
        statBlocks: [], searchOptions: [], players: {
            Rohkume: { name: 'Rohkume', portrait: 'half-orc-icon.png', AC: '17', speed: '30 ft.', iniative: 0, stats: [16, 13, 16, 12, 17, 9] },
            Faen: { name: 'Faen', portrait: 'elf-icon.png', AC: '11', speed: '35 ft.', iniative: 0, stats: [9, 13, 12, 13, 16, 16] },
            Ash: { name: 'Ash', portrait: 'dragonborn-icon.png', AC: '13', speed: '30 ft.', iniative: 0, stats: [17, 13, 13, 11, 9, 10] }
        },
        scrollCoverClass: 'scrollCover'
    };

    // Maybe move api access methods into the api class
    addMonster = async (monsterName) => {
        const response = await dnd5e.get(`/monsters/${monsterName}`);
        const monster = response.data;

        const statBlock = new StatBlockMonsterModel(this.getMonsterIndex(monster.index), monster);

        this.setState({ statBlocks: [{ id: statBlock.id, monster: statBlock }, ...this.state.statBlocks] }
            , () => localStorage.setItem(Constants.LocalStorageKey, JSON.stringify(this.state.statBlocks)));
    }

    getMonsterIndex = (monsterIndex) => {
        return monsterIndex + this.state.statBlocks.filter(x => x.monster.index === monsterIndex).length;
    }

    loadMonsters = async () => {
        const response = await dnd5e.get(`/monsters`);
        this.setState({ searchOptions: response.data.results.map((m) => { return { key: m.index, value: m.index, text: m.name } }) });
    }

    init = async () => {
        const existingMonsters = JSON.parse(localStorage.getItem(Constants.LocalStorageKey));

        if (process.env.NODE_ENV !== 'production') {
            if (!existingMonsters || existingMonsters.length === 0) {
                await this.addMonster('goblin');
            }
        }

        if (existingMonsters && existingMonsters.length > 0) {
            const assignedMonsters = [];

            for (var monster of existingMonsters) {
                const m = new StatBlockMonsterModel(monster.id);
                m.updateProperties(monster.monster);
                assignedMonsters.push({ id: monster.id, monster: m });
            }
            
            this.setState({ monsters: assignedMonsters })
        }
    }

    componentDidMount() {
        this.init();
        this.loadMonsters();
    }

    // This could probably be moved to a separate monster grid component
    statBlocks = (characters, includeActions = true) => {
        const grid = {
            c1: [],
            c2: [],
            c3: []
        };

        for (let i = 0; i < characters.length; i++) {
            const statBlock = (
                <StatBlockBase key={i} index={i} data={characters[i]} handleRemoveMonster={this.handleRemoveMonster} handleMonsterUpdate={this.handleMonsterUpdate} >
                    { includeActions ? <StatBlockActions data={characters[i]} /> : <></> }
                </StatBlockBase>
            )

            switch (i % 3) {
                case 0: grid.c1.push(statBlock); break;
                case 1: grid.c2.push(statBlock); break;
                case 2: grid.c3.push(statBlock); break;
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
            ...this.state.statBlocks.map((v) => { return { name: v.monster.name, iniative: v.monster.iniative, index: v.id } }),
            { name: players.Rohkume.name, iniative: players.Rohkume.iniative, index: players.Rohkume.name },
            { name: players.Faen.name, iniative: players.Faen.iniative, index: players.Faen.name },
            { name: players.Ash.name, iniative: players.Ash.iniative, index: players.Ash.name }
        ];

        characterList.sort((a, b) => b.iniative - a.iniative);

        return characterList.map((v, i) => {
            return (
                <Card className='iniativeCard' key={i} data-id={v.index} onMouseEnter={this.highlightCharacter} onMouseLeave={this.unhiglightCharacter}>
                    <Card.Content>
                        {v.name}: {v.iniative}
                    </Card.Content>
                </Card>
            )
        });
    }

    handleSearchSubmit = (monsterName) => {
        this.addMonster(monsterName);
    }

    handleRemoveMonster = (id) => {
        this.setState({ monsters: this.state.statBlocks.filter(x => x.id !== id) });
    }

    handleMonsterUpdate = (id, monster) => {
        const newMonsters = this.state.statBlocks.map(obj => {
            if (obj.id === id) {
                obj.monster = monster;
            }
            return obj;
        });

        this.setState({ monsters: newMonsters }, localStorage.setItem(Constants.LocalStorageKey, JSON.stringify(this.state.statBlocks)));
    }

    showTimeout;
    handleHideIniative = () => {
        this.setState({ scrollCoverClass: 'scrollCover hidden' });
        clearTimeout(this.showTimeout);
        this.showTimeout = setTimeout(() => {
            this.setState({ scrollCoverClass: 'scrollCover' });
        }, 500);
    }

    // TODO:
    // Make player cards look like monster cards
    // AC value changed from api. Maybe change how it's displayed
    // Make iniative editable
    // Add + button in bottom right with option to look up monster or add a custom player/monster (Maybe just do players first)
    // Have a section for players and a section for monsters
    // Maybe change the mouse events for changing the iniative for players
    // Make the skills & actions look better with a table
    // Add current condition effects to monster
    // maybe make descriptions of abilities tool tips
    // add tool tips for spells
    // Have some of them be able to be temprary additions (modifiers)
    // Maybe make it so it can be exported to a json file

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
                <div style={{ position: 'relative' }}>
                    <Container className='iniativeContainer' onScroll={this.handleHideIniative} onMouseMove={this.handleHideIniative}>
                        {this.iniativeOrder()}
                    </Container>
                    <div className={this.state.scrollCoverClass} />
                </div>
                <Divider />
                <SearchBar options={this.state.searchOptions} onSubmit={this.handleSearchSubmit} />
                <br />
                <Grid relaxed stackable padded columns={3}>
                    {this.statBlocks(this.state.statBlocks)}
                </Grid>
                <Icon className='addStatBlock back circle huge'></Icon>
                <Icon className='addStatBlock front plus circle huge'></Icon>
            </Container>
        )
    };
}

export default App;