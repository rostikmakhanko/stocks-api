import React from 'react'

interface LabelProps {
    text: string | number
}

export const Label: React.FC<LabelProps> = React.memo((props) => {
    return (
        <h1>{props.text}</h1>
    )
})


