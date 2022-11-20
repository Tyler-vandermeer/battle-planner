import React, { useState } from 'react';
import { Modal, Icon, Form, Button } from 'semantic-ui-react';

const MonsterModal = ({ open, toggleOpen, monster }) => {
    const [localMonster, setLocalMonster] = useState(monster);

    const onChangeProperty = (ev) => {
        const key = ev.target.dataset.key;
        setLocalMonster((p) => ({ ...p, [key]: ev.target.value }));
    }

    const onSaveChanges = (ev) => {
        ev.preventDefault();
        monster.updateProperties(localMonster);
        toggleOpen();
    }

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
                    <Form.Field>
                        <label htmlFor='name'>Name:</label>
                        <input id='name' type='text' data-key='name' value={localMonster.name} onChange={onChangeProperty} />
                    </Form.Field>

                    <Form.Field>
                        {/* Maybe make textarea */}
                        <label htmlFor='desc'>Description:</label>
                        <input id='desc' type='text' data-key='desc' value={localMonster.desc} onChange={onChangeProperty} />
                    </Form.Field>

                    <Form.Field>
                        <label htmlFor='maxHp'>Max HP:</label>
                        <input id='maxHp' type='number' data-key="hp" value={localMonster.hp} onChange={onChangeProperty} />
                    </Form.Field>

                    <Form.Field>
                        <label htmlFor='ac'>AC:</label>
                        <input id='ac' type='number' data-key="ac" value={localMonster.ac} onChange={onChangeProperty} />
                    </Form.Field>

                    <Button type='submit' onClick={onSaveChanges}>Save</Button>
                </Form>
            </Modal.Content>
        </Modal>
    );
};

export default MonsterModal;