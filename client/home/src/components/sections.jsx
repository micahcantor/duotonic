import React from "react"
import Img from "gatsby-image"
import { QueueExample } from "./QueueExample"
import { ChatExample } from "./ChatExample"

export const Hero = ({ data }) => {
  return (
    <section className="flex flex-col lg:flex-row w-full mx-auto mt-5">
      <div className="flex flex-col w-full lg:w-1/2 mt-1 px-4 lg:px-none space-y-6">
        <span className="leading-tight text-4xl lg:text-6xl font-extrabold">
          Listen to Spotify <span className="text-primary">together.</span>
        </span>
        <span className="text-xl lg:text-2xl">
          Share your music and chat simultaneously with a friend or stranger.
        </span>
        <div></div>
        <a className="text-2xl font-semibold inline-block text-center rounded bg-primary hover:bg-primaryDark text-bgColor p-4"
          href="http://localhost:8080"> Start Listening
        </a>
        <span className="text-sm lg:text-normal mx-auto">Only available for Spotify Premium members</span>
      </div>
      <div className="w-full mx-auto md:w-2/3 lg:w-1/2 flex-none">
        <Img className="object-cover mt-4 lg:mt-none lg:-mt-6 lg:mb-2" fadeIn={false} fluid={data.dancingDoodle.childImageSharp.fluid}></Img>
      </div>
    </section>
  )
}

export const Sync = ({ data }) => {
  return (
    <section className="w-full bg-bgColor rounded-md shadow px-8 ">
      <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-none container mx-auto mt-3 mb-3">
        <div className="w-full md:w-1/2 space-y-2">
          <span className="text-3xl font-bold mb-1">Stay in Sync</span>
          <p className="text-2xl mr-2">
            When you add a track or update the playback on your device, Duotonic updates for
            everyone in your lobby, so you never get out of sync.
          </p>
        </div>
        <div className="w-full md:w-1/2 mx-auto flex-none">
          <QueueExample data={data}/>
        </div>
      </div>
    </section>
  )
}

export const Chat = ({ data }) => {
  return (
    <section className="w-full bg-bgColor rounded-md shadow px-8 h-full">
      <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-none container mx-auto mt-3 mb-3 h-full">
        <div className="w-full md:w-1/2 space-y-2">
          <span className="text-3xl font-bold mb-1">Group Chat</span>
          <p className="text-2xl mr-2">
            Discuss your favorite music, find new favorites, or just chat for fun — all in real time, directly in the site.
          </p>
          <div className="mx-auto md:pt-4 md:pr-8">
            <Img fadeIn={false} fluid={data.textingDoodle.childImageSharp.fluid}></Img>
          </div>
        </div>
        <div className="w-full md:w-1/2 mx-auto flex-none h-full">
          <ChatExample />
        </div>
      </div>
    </section>
  )
}

export const Pairing = ({ data }) => {
  return (
    <section className="w-full bg-bgColor rounded-md shadow px-8 h-full">
      <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-none container mx-auto mt-3 mb-3 h-full">
        <div className="w-full md:w-1/2 space-y-2">
          <span className="text-3xl font-bold mb-1">Listen with a friend or stranger</span>
          <p className="text-2xl mr-2">
            Connect with friends, or meet someone new on Duotonic. You can either send a link to a friend, 
            or wait in queue to be paired up with another random listener.
          </p>
        </div>
        <div className="w-full md:w-3/5 flex-none h-full">
          <Img fadeIn={false} fluid={data.pairDoodle.childImageSharp.fluid}></Img>
        </div>
      </div>
    </section>
  )
}
