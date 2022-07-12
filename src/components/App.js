import React from 'react';
import Monster from './Monster';
import dnd5e from '../api/dnd5e';

class App extends React.Component {
    state = { monsters: [] };

    getMonsterData = async (monsterName) => {
        const response = await dnd5e.get(`/monsters/${monsterName}`);
        this.setState({ monsters: [response.data, ...this.state.monsters]  });
    }

    componentDidMount() {
        this.getMonsterData('goblin');
        this.getMonsterData('goblin');
        this.getMonsterData('goblin');
        this.getMonsterData('goblin');
        this.getMonsterData('goblin');
    }

    monsters = () => {
        return this.state.monsters.map((m, i) => { return <Monster key={i} monster={m}/>});
    }

    render() {
        return (
            <div className='ui container'>
                <div className='ui stackable grid container'>
                    {this.monsters()}
                </div>
            </div>
        )
    };
}

export default App;