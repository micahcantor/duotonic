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
          href={process.env.GATSBY_APP_URL}> Start Listening
        </a>
        <span className="text-sm lg:text-normal mx-auto">Only available for Spotify Premium members</span>
      </div>
      <div className="w-full mx-auto md:w-2/3 lg:w-1/2 flex-none">
        <Img className="object-cover mt-4 lg:mt-none lg:-mt-6 lg:mb-2" fadeIn={false} fluid={data.dancingDoodle.childImageSharp.fluid}></Img>
      </div>
    </section>
  )
}

const ContentSection = ({ children }) => {
  return (
    <section className="w-full bg-bgColor rounded-md shadow px-8 ">
      <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-none container mx-auto mt-3 mb-3">
        {children}
      </div>
    </section>
  )
}

const ContentSectionLeft = ({ title, paragraph, children }) => {
  return (
    <div className="w-full md:w-1/2 space-y-2">
      <span className="text-3xl font-bold mb-1">{title}</span>
      <p className="text-2xl mr-2 md:mr-4">
        {paragraph}
      </p>
      {children}
    </div>
  )
}

export const Sync = ({ data }) => {
  return (
    <ContentSection>
      <ContentSectionLeft title="Stay in Sync" paragraph={`When you add a track or update the playback on your 
          device, Duotonic updates for everyone in your lobby, so you never get out of sync.`}>
      </ContentSectionLeft>
      <div className="w-full md:w-1/2 mx-auto flex-none">
        <QueueExample data={data}/>
      </div>
    </ContentSection>
  )
}

export const Chat = ({ data }) => {
  return (
    <ContentSection>
      <ContentSectionLeft title="Group Chat" paragraph={`Discuss your favorite music, find new favorites, 
        or just chat for fun — all in real time, directly in the site.`}>
          <div className="mx-auto md:pt-4 md:pr-8">
          <Img fadeIn={false} fluid={data.textingDoodle.childImageSharp.fluid}></Img>
        </div>
      </ContentSectionLeft>
      <div className="w-full md:w-1/2 mx-auto flex-none h-full">
        <ChatExample />
      </div>
    </ContentSection>
  )
}

export const Pairing = ({ data }) => {
  return (
    <ContentSection>
      <ContentSectionLeft title="Listen with a friend or stranger" paragraph={`Connect with friends, or meet someone new on 
          Duotonic. You can either send a link to a friend, or wait in queue to be paired up with another random listener.`}>
      </ContentSectionLeft>
      <div className="w-full md:w-3/5 flex-none h-full">
        <Img fadeIn={false} fluid={data.pairDoodle.childImageSharp.fluid}></Img>
      </div>
    </ContentSection>
  )
}

export const OpenSource = () => {
  return (
    <ContentSection>
      <ContentSectionLeft title="Free and Open Source" paragraph={`Duotonic is a free service on top of Spotify Premium,
        and all of it's code can be found online.`}>
      </ContentSectionLeft>
      <div className="w-full md:w-1/2 mx-auto flex items-center justify-center">
        <a href="https://github.com/micahcantor/duotonic" className="inline-flex justify-center items-center px-6 py-3 space-x-4 rounded-md bg-textColor">
          <svg className="w-16 h-16 text-white fill-current mr-2 md:mr-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          <span className="text-3xl md:text-4xl text-bgColor font-bold leading-tight">View code on GitHub</span>
        </a>
      </div>
    </ContentSection>
  )
}
