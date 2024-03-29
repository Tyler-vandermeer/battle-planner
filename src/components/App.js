import React from 'react';
import { Card, Container, Divider, Grid, Header, Icon } from 'semantic-ui-react';
import dnd5e from '../api/dnd5e';
import StatBlockMonsterModel from '../api/StatBlockMonsterModel';
import StatBlockModel from '../api/StatBlockModel';
import * as Constants from '../Helpers/Constants';
import SearchBar from './SearchBar';
import StatBlockActions from './StatBlockActions';
import StatBlockBase from './StatBlockBase';
import StatBlockModal from './StatBlockModal';

class App extends React.Component {
    state = {
        statBlocks: [], searchOptions: [],
        scrollCoverClass: 'scrollCover',
        selectedStatBlock: new StatBlockModel(-1, null, 'new'), editOpen: false
    };

    // Maybe move api access methods into the api class
    addMonster = async (monsterName) => {
        const response = await dnd5e.get(`/monsters/${monsterName}`);
        const monster = response.data;

        const statBlock = new StatBlockMonsterModel(this.getStatBlockId(), monster);
        this.addStatBlock(statBlock);
    }

    addStatBlock = (statBlock) => {
        this.setState({ statBlocks: [{ id: statBlock.id, statBlock: statBlock }, ...this.state.statBlocks] }
            , this.updateLocalStorage);
    }

    updateLocalStorage = () => {
        localStorage.setItem(Constants.LocalStorageKey, JSON.stringify(this.state.statBlocks))
    }

    getStatBlockId = () => {
        let ids = this.state.statBlocks.map(v => v.id);
        let newId = Math.max(...ids) + 1;
        return ids.length === 0 ? 0 : newId;
    }

    loadMonsters = async () => {
        const response = await dnd5e.get(`/monsters`);
        this.setState({ searchOptions: response.data.results.map((m) => { return { key: m.index, value: m.index, text: m.name } }) });
    }

    init = async () => {
        const existingStatBlocks = JSON.parse(localStorage.getItem(Constants.LocalStorageKey));

        if (process.env.NODE_ENV !== 'production') {
            if (!existingStatBlocks || existingStatBlocks.length === 0) {
                await this.addMonster('goblin');
            }
        }

        if (existingStatBlocks && existingStatBlocks.length > 0) {
            const assignedStatBlocks = [];

            for (var statBlock of existingStatBlocks) {
                // Add check for stat Block Type
                const sb = new StatBlockMonsterModel(statBlock.id);
                sb.updateProperties(statBlock.statBlock);
                assignedStatBlocks.push({ id: statBlock.id, statBlock: sb });
            }

            this.setState({ statBlocks: assignedStatBlocks });
        }
    }

    componentDidMount() {
        this.init();
        this.loadMonsters();
    }

    // This could probably be moved to a separate stat block grid component
    statBlocks = (statBlocks) => {
        //Add logic to order by the statblock type
        const grid = {
            c1: [],
            c2: [],
            c3: []
        };

        for (let i = 0; i < statBlocks.length; i++) {
            const statBlock = (
                <StatBlockBase key={i} index={i} data={statBlocks[i]} handleRemoveStatBlock={this.handleRemoveStatBlock} handleStatBlockUpdate={this.handleStatBlockUpdate} onEdit={this.handleClickEdit} onDuplicate={this.handleClickDuplicate} >
                    {statBlocks[i].statBlock.type === Constants.StatBlockTypes.monster ? <StatBlockActions data={statBlocks[i]} /> : <></>}
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
        var characterList = [...this.state.statBlocks.map((v) => { return { name: v.statBlock.name, iniative: v.statBlock.iniative, index: v.id } })];

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

    handleRemoveStatBlock = (id) => {
        this.setState({ statBlocks: this.state.statBlocks.filter(x => x.id !== id) }, this.updateLocalStorage);
    }

    handleStatBlockUpdate = (id, statBlock) => {
        const newStatBlocks = this.state.statBlocks.map(obj => {
            if (obj.id === id) {
                obj.statBlock = statBlock;
            }
            return obj;
        });

        this.setState({ statBlocks: newStatBlocks }, localStorage.setItem(Constants.LocalStorageKey, JSON.stringify(this.state.statBlocks)));
    }

    showTimeout;
    handleHideIniative = () => {
        this.setState({ scrollCoverClass: 'scrollCover hidden' });
        clearTimeout(this.showTimeout);
        this.showTimeout = setTimeout(() => {
            this.setState({ scrollCoverClass: 'scrollCover' });
        }, 500);
    }

    handleClickEdit = (statBlock) => {
        this.setState({ selectedStatBlock: statBlock }, this.toggleModal());
    }

    handleClickDuplicate = (statBlock) => {
        const newId = this.getStatBlockId();
        
        const newStatBlock =
            statBlock.type === Constants.StatBlockTypes.monster
                ? new StatBlockMonsterModel(newId)
                : new StatBlockModel(newId);

        newStatBlock.updateProperties(statBlock);
        newStatBlock.id = newId;

        this.addStatBlock(newStatBlock);
    }

    toggleModal = () => {
        this.setState({ editOpen: !this.state.editOpen });
    }

    handleAddStatBlock = (ev) => {
        this.setState({ selectedStatBlock: new StatBlockModel(-1, null, Constants.StatBlockTypes.default) }, this.toggleModal());
    }

    handleSaveStatBlock = (statBlock) => {
        if (statBlock.id === -1) {
            let id = this.getStatBlockId();
            statBlock.id = id;
            this.addStatBlock(statBlock);
        } else {
            this.updateLocalStorage();
        }
    }

    // TODO:
    // Look into why custom blocks hp is a string
    // add a roll initiative button. Both for individual or all stat blocks
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
                <div onClick={this.handleAddStatBlock}>
                    <Icon className='addStatBlock back circle huge'></Icon>
                    <Icon className='addStatBlock front plus circle huge'></Icon>
                </div>
                <StatBlockModal open={this.state.editOpen} toggleOpen={this.toggleModal} statBlock={this.state.selectedStatBlock} save={this.handleSaveStatBlock} />
            </Container>
        )
    };
}

export default App;