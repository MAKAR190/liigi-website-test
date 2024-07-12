'use client'
import ReactPlayer from "react-player";
import { RotatingLines } from 'react-loader-spinner'
import {useState,useEffect} from "react";
const Player = ({url, preview}:any) => {
    const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth < 950);
    useEffect(() => {
        if(typeof window !== "undefined") {
            setIsMobile(window.innerWidth < 950);
        }
    }, [isMobile]);
    return (
        <div className="video_container w-full h-full">
            <div className="max-w-3xl min-[1980px]:max-w-5xl mx-auto h-full">
                <div className="player__wrapper w-full h-full">
                    <ReactPlayer
                        className="player hover:drop-shadow-2xl duration-[0.2s]"
                        url={url}
                        width="100%"
                        controls
                        height="100%"
                        fallback={<div className="bg-black w-full h-full flex justify-center items-center">
                            <RotatingLines
                                visible={true}
                                width="96"
                                strokeWidth="5"
                                animationDuration="0.75"
                                ariaLabel="rotating-lines-loading"
                            />
                        </div>}
                        playIcon={<svg className="hover:scale-110 duration-[0.1s] group md:max-w-[80px] md:max-h-[80px] xl:max-w-full xl:max-h-full lg:max-w-full lg:max-h-full sm:max-w-[50px] sm:max-h-[50px]" width="100" height="100" viewBox="0 0 298 298" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_142_2802)">
                                <rect width="298" height="298" rx="149" fill="white"/>
                                <path className="group-hover:fill-secondary duration-[0.2s] fill-primary" d="M149 298C66.7147 298 0 231.285 0 149C0 66.7147 66.7147 0 149 0C231.285 0 298 66.7147 298 149C298 231.285 231.285 298 149 298ZM111.75 74.6118V223.388L223.5 149L111.75 74.6118Z" />
                            </g>
                            <defs>
                                <clipPath id="clip0_142_2802">
                                    <rect width="298" height="298" rx="149" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                        }
                        light={preview} // if not light mode, the playing is false (if no preview)
                        pip={true}
                        playing={!isMobile}
                        muted={true}
                    />
                    {/*<Control />*/}
                </div>
            </div>
        </div>
    )
}

export default Player;