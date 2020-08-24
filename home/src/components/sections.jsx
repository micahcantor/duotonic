import React from "react"
import Img from "gatsby-image"

export const Hero = ({ data }) => {
  return (
    <section className="flex w-full mx-auto mt-5">
      <div className="flex flex-col w-1/2 mt-1 space-y-6">
        <span className="leading-tight text-6xl font-extrabold">
          Listen to Spotify <span className="text-primary">together.</span>
        </span>
        <span className="text-2xl">
          {" "}
          Share your music and chat simultaneously with a friend or stranger.{" "}
        </span>
        <a className="text-2xl font-semibold inline-block text-center rounded bg-primary hover:bg-primaryDark text-bgColor p-4"
          href="http://localhost:8080"> Start Listening
        </a>
      </div>
      <div className="w-1/2 flex-none">
        <Img className="object-cover -mt-6 mb-2" fadeIn={false} fluid={data.dancingDoodle.childImageSharp.fluid}></Img>
      </div>
    </section>
  )
}

export const Sync = ({ data }) => {
  console.log(data)
  return (
    <section className="w-full bg-bgColor rounded-md shadow px-8 ">
      <div className="flex justify-between container mx-auto mt-3 mb-3">
        <div className="w-1/2 space-y-2">
          <span className="text-3xl font-bold mb-1">Stay in sync</span>
          <p className="text-2xl">
            When you add a track or update the playback on your device, Duotonic updates for
            everyone in your lobby, so you never get out of sync.
          </p>
        </div>
        <div className="w-1/3 mx-auto flex-none">
          <QueueExample data={data}/>
        </div>
      </div>
    </section>
  )
}

const QueueExample = ({ data }) => {
  return (
    <div className="rounded border-t-4 border-r-4 border-l-4 border-textColor">
      <div className="relative flex w-full border-b-2 border-textColor bg-bgDark">
        <p className="text-lg uppercase tracking-wider font-mono p-3">Queue</p>
        <button type="button" className="md:hidden absolute inset-y-0 right-0 mt-2 mr-3 w-8 h-8">
            <svg className="stroke-current hover:text-primary" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" viewBox="0 0 24 24">
              <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
            </svg>
        </button>
      </div>
      <div className="w-full min-h-0">
        <div className="flex p-3 text-gray-300 items-center bg-bgDark border-b-2 border-textColor hover:border-primary ">
            <div className="flex w-full items-center">
              <Img className="w-20" fluid={data.prettyGirl.childImageSharp.fluid}></Img>
              <div className="flex flex-col md:flex-row lg:flex-col ml-3 font-light bg-bgDark text-textColor"><span id="name" className="text-textColor md:mr-2 lg:mr-none">Pretty Girl</span><span id="artist">Clairo</span><span id="album"></span><span id="uri" className="hidden">spotify:track:0KyAGiNGUytG5JLxJu4F6l</span><span id="runtime" className="hidden">178352</span></div>
            </div>
        </div>
        <div className="flex p-3 text-gray-300 items-center bg-bgDark border-b-4 border-textColor hover:border-primary ">
            <Img className="w-20" fluid={data.selfless.childImageSharp.fluid}></Img>
            <div className="flex flex-col md:flex-row lg:flex-col ml-3 font-light bg-bgDark text-textColor">
              <span id="name" className="text-textColor md:mr-2 lg:mr-none">Selfless</span>
              <span id="artist">The Strokes</span>
            </div>
        </div>
      </div>
    </div>
  )
}
