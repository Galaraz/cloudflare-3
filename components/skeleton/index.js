import React from 'react';

export default function Skeleton(props)  {    
    return (
        <div className={`skeleton-root ${ props.className && props.className }`} style={{ width: props.width, height: props.height }}></div>        
    );    
}