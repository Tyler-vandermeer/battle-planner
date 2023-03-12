import React, { useState } from 'react';
import Collapsible from 'react-collapsible';
import { Card, Divider, Header, Icon } from 'semantic-ui-react';
import ContentLine from './ContentLine';

const StatBlockActions = (props) => {
    const monster = props.data.monster;

    const [rotate, setRotate] = useState(false);

    const proficiencies = monster?.getProficiencies() ?? '';
    const senses = monster?.getSenses() ?? '';
    const specialAbilities = monster?.getSpecialAbilities() ?? '';
    const actions = monster?.getActions() ?? '';

    const onExpandClick = (ev) => setRotate(p => !p);

    return (
        <div>
            <Collapsible trigger={<Icon onClick={onExpandClick} className={rotate ? 'rotate' : ''} size='large' link name='angle down' />}>
                <Card.Content>
                    <ContentLine label="Skills" value={proficiencies} />
                    <ContentLine label="Senses" value={senses} />
                    <ContentLine label="Languages" value={monster.languages} />
                    <ContentLine label="Challenge" value={`${monster.challengeRating} (${monster.xp} XP)`} />
                </Card.Content>
                <Card.Content>
                    {specialAbilities}
                    <Header as='h4'>Actions</Header>
                    <Divider />
                    {actions}
                </Card.Content>
            </Collapsible>
        </div>
    )
}

export default StatBlockActions;
