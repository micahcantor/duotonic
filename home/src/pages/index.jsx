import React from "react"
import { graphql } from "gatsby"

import Header from "../components/header.jsx"
import { Hero, Sync } from "../components/sections.jsx"

const IndexPage = ({ data }) => {
  console.log(data)
  return (
    <div className="w-screen h-screen bg-bgDark text-textColor flex flex-col">
      <div className="container mx-auto">
        <Header />
        <div className="flex flex-col flex-grow items-center w-full divide-textColor divide-y-8 space-y-2 overflow-y-auto overflow-x-hidden">
          <Hero data={data}/>
          <Sync />
        </div>
      </div>
    </div>
  )
}

export const query = graphql`
  {
    fileName: file(relativePath: {eq: "dancing-doodle.png"}) {
      childImageSharp {
        fluid(maxWidth: 2000, quality: 100) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`

export default IndexPage
