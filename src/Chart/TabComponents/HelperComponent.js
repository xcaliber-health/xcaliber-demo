import React from 'react';

const NotesBlock = (props) => {    
  return (
    <pre>
        {props.plainText}
    </pre>
  );
};

export default NotesBlock;