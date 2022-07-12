import React from 'react';
import { Form, Dropdown, Button } from 'semantic-ui-react';

class SearchBar extends React.Component {
    state = { monsterName: '' };

    onChange = (e, { name, value }) => this.setState({ [name]: value });

    onSubmit = (ev) => {
        ev.preventDefault();
        this.props.onSubmit(this.state.monsterName);
    }

    render() {

        return (
            <div>
                <Form onSubmit={this.onSubmit}>
                    <Form.Field inline>
                        <Dropdown
                            placeholder='Add Monster'
                            clearable
                            search
                            selection
                            name='monsterName'
                            onChange={this.onChange}
                            options={this.props.options} />
                        <Button type='submit'>Add</Button>
                    </Form.Field>
                </Form>
            </div>
        )
    }
}

export default SearchBar;