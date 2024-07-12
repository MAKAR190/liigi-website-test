'use client'
import React from 'react';
import {Rings} from "react-loader-spinner";

const Loader = ()=>{
    return (
        <div className="w-[99%] mx-auto h-full absolute top-0 left-0.5 bg-white z-10 flex justify-center items-center">
            <Rings
                visible={true}
                height="80"
                width="80"
                color="#4fa94d"
                ariaLabel="rings-loading"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </div>
    )
}
export default Loader;