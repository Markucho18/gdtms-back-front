import { useState } from "react";

export function useVisible (initialValue){

    const [visible, setVisible] = useState(initialValue);

    const handleVisible = ()=> setVisible(!visible);

    return {visible, handleVisible}
}