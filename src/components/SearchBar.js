import React from 'react';
import { Form, Dropdown, Button } from 'semantic-ui-react';

const SearchBar = (props) => {
    return (
        <div>
            <Form>
                <Form.Field inline>
                    <Dropdown
                        placeholder='Add Monster'
                        clearable
                        search
                        selection
                        options={props.options} />
                    <Button type='submit'>Add</Button>
                </Form.Field>
            </Form>
        </div>
    )
}

export default SearchBar;