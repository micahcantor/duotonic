import React from "react"
import { graphql } from "gatsby"

import SEO from "../components/seo.js"
import Header from "../components/header.jsx"
import Footer from "../components/footer.jsx"
import { Hero, Sync, Chat, Pairing } from "../components/sections.jsx"

const IndexPage = ({ data }) => {
  return (
    <>
      <SEO title="Duotonic" />
      <div className="bg-bgDark text-textColor flex flex-col">
        <div className="container w-full h-full mx-auto pb-16">
          <Header showButton={true}/>
          <main className="flex flex-col flex-grow items-center w-full divide-textColor divide-y-8 space-y-8 pb-8 overflow-hidden">
            <Hero data={data}/>
            <Sync data={data}/>
            <Chat data={data}/>
            <Pairing data={data}/>
          </main>
          <Footer />
        </div>
      </div>
    </>
  )
}

export const query = graphql`{
  dancingDoodle: file(relativePath: {eq: "dancing-doodle.png"}) {
    childImageSharp {
      fluid(maxWidth: 2000, quality: 100) {
        ...GatsbyImageSharpFluid
      }
    }
  },
  textingDoodle: file(relativePath: {eq: "texting-doodle.png"}) {
    childImageSharp {
      fluid(maxWidth: 2000, quality: 100) {
        ...GatsbyImageSharpFluid
      }
    }
  },
  pairDoodle: file(relativePath: {eq: "pair-doodle.png"}) {
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
}`

export default IndexPage
