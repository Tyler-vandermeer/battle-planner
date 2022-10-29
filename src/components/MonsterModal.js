import React, { useState } from 'react';
import { Modal, Icon, Form, Button } from 'semantic-ui-react';

const MonsterModal = ({ open, setOpen, monster, updateMonster }) => {
    const [localMonster, setLocalMonster] = useState(monster);

    const onMaxHpChange = (ev) => {
        setLocalMonster((p) => ({ ...p, hp: ev.target.value }));
    };

    const onSaveChanges = (ev) => {
        ev.preventDefault();
        // console.log(localMonster, monster);

        updateMonster(p => ({ ...p, ...localMonster }));
        // setOpen();
    }

    return (
        <Modal
            open={open}
            onClose={setOpen}
            closeOnDimmerClick={true}
            closeOnEscape={true}
        >
            <Icon className='absRight' style={{ top: '0.15em' }} onClick={() => setOpen()} link name='cancel' />
            <Modal.Header>{localMonster.name}</Modal.Header>
            <Modal.Content>
                <Form>
                    <Form.Field>
                        <label htmlFor='maxHp'>Max HP:</label>
                        <input id='maxHp' type='number' value={localMonster.hp} onChange={onMaxHpChange} />
                    </Form.Field>

                    <Button type='submit' onClick={onSaveChanges}>Save</Button>
                </Form>
            </Modal.Content>
        </Modal>
    );
};

export default MonsterModal;