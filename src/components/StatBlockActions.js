import React, { useState } from 'react';
import Collapsible from 'react-collapsible';
import { Card, Divider, Header, Icon } from 'semantic-ui-react';
import ContentLine from './ContentLine';

const StatBlockActions = (props) => {
    const statBlock = props.data.statBlock;

    const [rotate, setRotate] = useState(false);

    const proficiencies = statBlock?.getProficiencies() ?? '';
    const senses = statBlock?.getSenses() ?? '';
    const specialAbilities = statBlock?.getSpecialAbilities() ?? '';
    const actions = statBlock?.getActions() ?? '';

    const onExpandClick = (ev) => setRotate(p => !p);

    return (
        <div>
            <Collapsible trigger={<Icon onClick={onExpandClick} className={rotate ? 'rotate' : ''} size='large' link name='angle down' />}>
                <Card.Content>
                    <ContentLine label="Skills" value={proficiencies} />
                    <ContentLine label="Senses" value={senses} />
                    <ContentLine label="Languages" value={statBlock.languages} />
                    <ContentLine label="Challenge" value={`${statBlock.challengeRating} (${statBlock.xp} XP)`} />
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
