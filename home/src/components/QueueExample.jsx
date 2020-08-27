import React from "react";
import Img from "gatsby-image";
export const QueueExample = ({ data }) => {
  return (
    <div className="rounded border-t-4 border-r-4 border-l-4 border-textColor">
      <div className="relative flex w-full border-b-2 border-textColor bg-bgDark">
        <p className="text-lg uppercase tracking-wider font-mono p-3">Queue</p>
      </div>
      <div className="w-full min-h-0">
        <div className="flex p-3 text-gray-300 items-center bg-bgDark border-b-2 border-textColor hover:border-primary ">
          <div className="flex w-full items-center">
            <Img className="rounded w-20" fluid={data.prettyGirl.childImageSharp.fluid}></Img>
            <div className="flex flex-col md:flex-row lg:flex-col ml-3 font-normal bg-bgDark text-textColor">
                <span id="name" className="text-textColor text-xl font-medium md:mr-2 lg:mr-none">Pretty Girl</span>
                <span className="font-normal" id="artist">Clairo</span>
            </div>
          </div>
        </div>
        <div className="flex p-3 text-gray-300 items-center bg-bgDark border-b-4 border-textColor hover:border-primary ">
          <Img className="rounded w-20" fluid={data.selfless.childImageSharp.fluid}></Img>
          <div className="flex flex-col md:flex-row lg:flex-col ml-3 bg-bgDark text-textColor">
            <span id="name" className="text-textColor text-xl font-medium md:mr-2 lg:mr-none">Selfless</span>
            <span className="font-normal" id="artist">The Strokes</span>
          </div>
        </div>
      </div>
    </div>
  );
};
