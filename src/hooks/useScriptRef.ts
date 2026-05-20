import { useEffect, useRef } from 'react';


export default function useScriptRef() {
  const scripted = useRef(true);

  useEffect(() => {
    return () => {
      scripted.current = false;
    };
  }, []);

  return scripted;
}
