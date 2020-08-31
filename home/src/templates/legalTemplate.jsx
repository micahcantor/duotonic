import React from "react"
import { graphql } from "gatsby"
import Header from "../components/header.jsx"
import Footer from "../components/footer.jsx"

export default function Template({ data }) {
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark
  return (
    <div className="bg-bgDark text-textColor">
      <div className="w-full h-full container mx-auto pb-8">
        <Header showButton={false}/>
        <main className="w-full overflow-hidden px-4 pb-4">
          <h1 className="text-4xl text-primary">{frontmatter.title}</h1>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </main>
        <Footer />
      </div>
    </div>
  )
}
export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
      }
    }
  }
`