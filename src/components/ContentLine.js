import React from 'react';

const ContentLine = (props) => {
    return (
        <div><b>{props.label}:</b> {props.value}</div>
    )
}

export default ContentLine;