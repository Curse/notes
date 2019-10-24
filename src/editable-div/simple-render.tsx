
import React from 'react'
import {Link} from 'react-router-dom'

const SimpleRender = ({text}) => {
    const labelRegex = /@\[(\w+)]/
    const components = text.split(/(@\[\w+]+\(\w+\))/).map((a: string, i: number) => {
        if (a.startsWith("@")) {
            a = `@${a.match(labelRegex)[1]}`
        }
        return a.startsWith("@") ? (
        // @ts-ignore
        <Link
            contentEditable={false}
            to={"/notes/p/" + a.slice(1)}
            onFocus={e => e.stopPropagation()}
            key={i}
        >
            {a}
        </Link>
        ) : (
        a
        )
    }
    );
    return components;
};

export default SimpleRender