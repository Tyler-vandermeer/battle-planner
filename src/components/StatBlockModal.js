import React, { useState, useEffect } from 'react';
import { Modal, Icon, Form, Button, Grid } from 'semantic-ui-react';
import { isNullOrEmpty } from '../Helpers/Helpers'

const StatBlockModal = ({ open, toggleOpen, statBlock, save }) => {
    const [localStatBlock, setLocalStatBlock] = useState(statBlock);

    // TODO add way to modify speed

    const onChangeProperty = (ev) => {
        const key = ev.target.dataset.key;
        const index = ev.target.dataset.index;
        const value = ev.target.value;

        setLocalStatBlock((p) => {
            if (index !== undefined && index !== null) {
                p[key][index].value = value;
            } else {
                p[key] = value;
            }

            return ({ ...p });
        });
    }

    useEffect(() => {
        setLocalStatBlock(statBlock);
    }, [statBlock]);

    const onSaveChanges = (ev) => {
        ev.preventDefault();
        statBlock.updateProperties(localStatBlock);
        save(statBlock);
        toggleOpen();
    }

    const stats = localStatBlock.stats.map((v, i) => {
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
            <Modal.Header>{isNullOrEmpty(localStatBlock.name) ? 'New Stat Block' : localStatBlock.name}</Modal.Header>
            <Modal.Content>
                <Form>
                    <Grid columns={2}>
                        <Grid.Row>
                            <Grid.Column>
                                <Form.Field>
                                    <label htmlFor='name'>Name:</label>
                                    <input id='name' type='text' data-key='name' value={localStatBlock?.name} onChange={onChangeProperty} />
                                </Form.Field>
                            </Grid.Column>
                            <Grid.Column>
                                <Form.Field>
                                    <label htmlFor='desc'>Description:</label>
                                    <Form.TextArea type='textarea' data-key='desc' value={localStatBlock.desc} onChange={onChangeProperty} />
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Grid columns={3}>
                        <Grid.Row>
                            <Grid.Column>
                                <Form.Field>
                                    <label htmlFor='maxHp'>Max HP:</label>
                                    <input id='maxHp' type='number' data-key="hp" value={localStatBlock.hp} onChange={onChangeProperty} />
                                </Form.Field>
                            </Grid.Column>
                            <Grid.Column>
                                <Form.Field>
                                    <label htmlFor='ac'>AC:</label>
                                    <input id='ac' type='number' data-key="ac" value={localStatBlock.ac} onChange={onChangeProperty} />
                                </Form.Field>
                            </Grid.Column>
                            <Grid.Column>
                                <Form.Field>
                                    <label htmlFor='iniative'>Iniative:</label>
                                    <input id='iniative' type='number' data-key="iniative" value={localStatBlock.iniative} onChange={onChangeProperty} />
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

export default StatBlockModal;