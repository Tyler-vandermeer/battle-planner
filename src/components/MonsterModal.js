import React, { useState } from 'react';
import { Modal, Icon, Form, Button, Grid } from 'semantic-ui-react';

const MonsterModal = ({ open, toggleOpen, monster }) => {
    const [localMonster, setLocalMonster] = useState(monster);

    const onChangeProperty = (ev) => {
        const key = ev.target.dataset.key;
        const index = ev.target.dataset.index;
        const value = ev.target.value;

        setLocalMonster((p) => {
            if (index !== undefined && index !== null) {
                p[key][index].value = value;
            } else {
                p[key] = value;
            }

            return ({ ...p });
        });
    }

    const onSaveChanges = (ev) => {
        ev.preventDefault();
        monster.updateProperties(localMonster);
        toggleOpen();
    }

    const stats = localMonster.stats.map((v, i) => {
        return (
            <Grid.Column key={i}>
                <Form.Field>
                    <label htmlFor={v.name}>{v.name}:</label>
                    <input id={v.name} type='number' data-key='stats' data-index={i} value={v.value} onChange={onChangeProperty} />
                </Form.Field>
            </Grid.Column>
        );
    });

    return (
        <Modal
            open={open}
            onClose={toggleOpen}
            closeOnDimmerClick={true}
            closeOnEscape={true}
        >
            <Icon className='absRight' style={{ top: '0.15em' }} onClick={() => toggleOpen()} link name='cancel' />
            <Modal.Header>{localMonster.name}</Modal.Header>
            <Modal.Content>
                <Form>
                    <Grid columns={2}>
                        <Grid.Row>
                            <Grid.Column>
                                <Form.Field>
                                    <label htmlFor='name'>Name:</label>
                                    <input id='name' type='text' data-key='name' value={localMonster.name} onChange={onChangeProperty} />
                                </Form.Field>
                            </Grid.Column>
                            <Grid.Column>
                                <Form.Field>
                                    <label htmlFor='desc'>Description:</label>
                                    <Form.TextArea type='textarea' data-key='desc' value={localMonster.desc} onChange={onChangeProperty} />
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Form.Field>
                                    <label htmlFor='maxHp'>Max HP:</label>
                                    <input id='maxHp' type='number' data-key="hp" value={localMonster.hp} onChange={onChangeProperty} />
                                </Form.Field>
                            </Grid.Column>
                            <Grid.Column>
                                <Form.Field>
                                    <label htmlFor='ac'>AC:</label>
                                    <input id='ac' type='number' data-key="ac" value={localMonster.ac} onChange={onChangeProperty} />
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

                    <Grid columns={3}>
                        <Grid.Row>
                            {stats.slice(0, 3)}
                        </Grid.Row>
                        <Grid.Row>
                            {stats.slice(3)}
                        </Grid.Row>
                    </Grid>

                    <br />

                    <Button type='submit' onClick={onSaveChanges}>Save</Button>
                </Form>
            </Modal.Content>
        </Modal>
    );
};

export default MonsterModal;