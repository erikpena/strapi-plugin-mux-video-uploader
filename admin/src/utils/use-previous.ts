import React from 'react';

const usePrevious = function (value:any) {
  const ref = React.useRef();

  React.useEffect(() => { ref.current = value; });
  
  return ref.current;
}

export default usePrevious;
