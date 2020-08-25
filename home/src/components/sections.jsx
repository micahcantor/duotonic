import React from "react"
import Img from "gatsby-image"
import { QueueExample } from "./QueueExample"
import { ChatExample } from "./ChatExample"

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
        <div className="w-1/2 mx-auto flex-none">
          <QueueExample data={data}/>
        </div>
      </div>
    </section>
  )
}

export const Chat = () => {
  return (
    <section className="w-full bg-bgColor rounded-md shadow px-8 h-full">
      <div className="flex justify-between container mx-auto mt-3 mb-3 h-full">
        <div className="w-1/2 space-y-2">
          <span className="text-3xl font-bold mb-1">Chat it up</span>
          <p className="text-2xl">
            Discuss your favorite music, find new favorites, or just chat for fun -- all in real time directly in the site.
          </p>
        </div>
        <div className="w-1/2 mx-auto flex-none h-full">
          <ChatExample />
        </div>
      </div>
    </section>
  )
}
