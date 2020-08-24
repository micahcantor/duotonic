import React from "react"
import { graphql } from "gatsby"

import Header from "../components/header.jsx"
import { Hero, Sync } from "../components/sections.jsx"

const IndexPage = ({ data }) => {
  console.log(data)
  return (
    <div className="w-screen bg-bgDark text-textColor flex flex-col">
      <div className="container w-full h-full mx-auto">
        <Header />
        <div className="flex flex-col flex-grow items-center w-full divide-textColor divide-y-8 space-y-2 overflow-y-auto overflow-x-hidden">
          <Hero data={data}/>
          <Sync data={data}/>
        </div>
      </div>
    </div>
  )
}

export const query = graphql`
  {
    dancingDoodle: file(relativePath: {eq: "dancing-doodle.png"}) {
      childImageSharp {
        fluid(maxWidth: 2000, quality: 100) {
          ...GatsbyImageSharpFluid
        }
      }
    },
    prettyGirl: file(relativePath: {eq: "pretty-girl.jpeg"}) {
      childImageSharp {
        fluid(maxWidth: 2000, quality: 100) {
          ...GatsbyImageSharpFluid
        }
      }
    },
    selfless: file(relativePath: {eq: "selfless.jpeg"}) {
      childImageSharp {
        fluid(maxWidth: 2000, quality: 100) {
          ...GatsbyImageSharpFluid
        }
      }
    },
  }
`

export default IndexPage
