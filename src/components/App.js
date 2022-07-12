import React from 'react';
import { Container, Header, Grid, Card } from 'semantic-ui-react';
import Monster from './Monster';
import dnd5e from '../api/dnd5e';

class App extends React.Component {
    state = { monsters: [] };

    getMonsterData = async (monsterName) => {
        const response = await dnd5e.get(`/monsters/${monsterName}`);
        this.setState({ monsters: [response.data, ...this.state.monsters] });
    }

    componentDidMount() {
        this.getMonsterData('goblin');
        this.getMonsterData('goblin');
        this.getMonsterData('goblin');
        this.getMonsterData('goblin');
        this.getMonsterData('goblin');
    }

    monsters = () => {
        return this.state.monsters.map((m, i) => { return <Grid.Column key={i}><Monster monster={m} /></Grid.Column> });
    }

    render() {
        return (
            <div style={{ marginTop: 10}}>
                <Container textAlign='center' fluid>
                    <Header as='h2'>Battle Planner</Header>
                    <Grid relaxed padded columns={4}>
                    {/* <Card.Group> */}
                        {this.monsters()}

                    {/* </Card.Group> */}
                    </Grid>
                </Container>
            </div>
        )
    };
}

export default App;