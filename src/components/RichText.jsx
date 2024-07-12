import { PortableText } from '@portabletext/react';
import React from 'react';
import { components } from "../utils/blockComponents";

const RichText = ({ content }) => {
    // @ts-ignore
    return (
        <PortableText
            value={content}
            components={components}
        />
    );
};

export default RichText;
