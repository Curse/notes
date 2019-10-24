
import React from 'react'
import {Link} from 'react-router-dom'

const SimpleRender = ({text}) => {
    const components = text.split(/(@\w+)/).map((a: string, i: number) =>
        a.startsWith("@") ? (
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
    );
    return components;
};

export default SimpleRender