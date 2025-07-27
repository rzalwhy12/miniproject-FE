"use client"

import {store} from "@/lib/redux/store"
import { ReactNode } from "react"
import { Provider } from "react-redux";

interface IStoreProviderProps{
    children: ReactNode;
};

function StoreProvider(props:IStoreProviderProps){
    return <Provider store={store}>{props.children}</Provider>
}

export default StoreProvider;