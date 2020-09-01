module.exports = {
  siteMetadata: {
    title: `Duotonic`,
    description: `Listen to Spotify together. Connect with friends or wait in queue to be paired with a random stranger. Duotonic enables a new way to enjoy your music.`,
    author: `Micah Cantor and Sawyer Pollard`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `duotonic-app`,
        short_name: `duotonic `,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/icon.svg`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: "gatsby-plugin-postcss",
      options: {
        postCssPlugins: [require("tailwindcss")("./tailwind.config.js")],
      },
    },
    {
      resolve: `gatsby-plugin-purgecss`,
      options: { 
        tailwind: true,
        ignore: ['src/styles/modal_styles.css', 'src/styles/slider_styles.css', 'src/styles/tooltip_styles.css']
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
