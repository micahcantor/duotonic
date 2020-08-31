import React from "react";
import Img from "gatsby-image";
export const QueueExample = ({ data }) => {

  const { selfless, prettyGirl } = data;

  return (
    <div className="rounded border-t-4 border-r-4 border-l-4 border-textColor">
      <div className="relative flex w-full border-b-2 border-textColor">
        <p className="text-lg uppercase tracking-wider font-mono p-3">Queue</p>
      </div>
      <div className="w-full min-h-0">
        <div className="flex p-3 text-gray-300 items-center border-b-2 border-textColor hover:border-primary ">
          <div className="flex w-full items-center">
            <SongInfo artist="Clairo" songName="Pretty Girl" imageFluid={prettyGirl.childImageSharp.fluid} />
          </div>
        </div>
        <div className="flex p-3 text-gray-300 items-center border-b-4 border-textColor hover:border-primary ">
          <SongInfo artist="The Strokes" songName="Selfless" imageFluid={selfless.childImageSharp.fluid} />
        </div>
      </div>
    </div>
  );
};

const SongInfo = ({ artist, songName, imageFluid }) => {
  return (
    <>
      <Img className="rounded w-20" fluid={imageFluid}></Img>
      <div className="flex flex-col md:flex-row lg:flex-col ml-3 font-normal text-textColor">
          <span id="name" className="text-textColor text-xl font-medium md:mr-2 lg:mr-none">{songName}</span>
          <span className="font-normal" id="artist">{artist}</span>
      </div>
    </>
  )
}
