---
slug: "/privacy-policy"
date: "2020-08-31"
title: "Privacy Policy"
---

## I. Introduction

Duotonic is free, open source software. In keeping with the ideals of open source, this project does not attempt to invade user privacy by hoarding or selling user data, and does it's best to protect and anonymize that data. However, in order to function, Duotonic must deal with some user data, and the specifics of it's use will be outlined in this policy. Any and all collection of user data by Duotonic is subject to this policy.

This policy is subject to future changes and revision, and if there are significant changes, users will be informed on Duotonic's web site.

## II. Spotify Privacy Policy

Duotonic integrates heavily with Spotify's service by allowing you to stream music on your device or connect remotely to an instance of Spotify on another device. As such, by agreeing to this policy, you also agree to [Spotify's privacy policy](https://www.spotify.com/us/legal/privacy-policy/) in it's entirety, and to any changes that may be made to it after the writing of Duotonic's privacy policy.

## III. User Data

### Spotify API access

Duotonic does not offer any way for the user to login directly to our service. Therefore, the only interaction we have with user authentication is through Spotify's service. In order to use the web app, users must sign in to their Spotify _Premium_ account, through a process defined by the [OAuth 2.0 protocol](https://oauth.net/2/) for the authorization code flow.

Duotonic never has any access to the user's email or password (encrypted or not) used to login to their Spotify account in this process. The sign in event is handled entirely by Spotify, which in turn gives Duotonic an _access token_, a anonymous string of letters and numbers that acts functionally as a password to the Spotify API for that user. The exact way this API is used is defined in section IV.

The access token, along with a _refresh token_, which grants Duotonic a new access token after it expires every 60 minutes, is stored securely in Duotonic's database. The token is referenced when the user makes any action requiring the Spotify API.

### Other user data

The other types of user data handled by Duotonic relate to its chat messaging feature. If the user elects to use this feature, Duotonic will store the user's chosen username (which can be changed at any time) and any chat messages for the room they are in. This data is stored so that if the user refreshes or leaves the page, the data can be restored once they return. Additionally, if a new user enters the chat room, they can be supplied with the existing chat messages and the corresponding usernames of the user's who sent them.

## IV. Spotify API Scopes

When using the Spotify API (application programming interface), Duotonic can only access data and control parts of the user's Spotify account that fall within it's predefined scopes. Duotonic requires three scopes for all users:

- "user-read-private": Grants read access to the type of the user's account. Needed to search tracks on Spotify and verify the user is a _Premium_ user.
- "user-modify-playback-state": Grants write access to the user's playback state. Needed to control the user's playback in the app by adding songs to queue, skipping songs, changing volume, etc.
- "user-read-playback-state": Grants read access to the user's playback state. Needed to access a list of the user's available devices and verify information about their current playback.

Additionally, if the user access Duotonic on a modern desktop web browser (Chrome, Firefox, or Edge), Duotonic will stream music directly through the browser, rather than a remote connected device. For this, Duotonic requires one additional scope:

- "streaming": Grants access to play Spotify content through the web browser.

## V. Cookie Policy

Duotonic follows the guidelines for cookie use outlined by the EU under the GDPR directive. More information on the GDPR cookie policy can be found on the [official website](https://ec.europa.eu/info/cookies_en). The GDPR broadly categorizes cookies into those that are first-party (set by the website being visited) and third-party (set to function with other websites).

Duotonic integrates heavily with the Spotify platform, and as such users on Duotonic agree to any cookies set by Spotify as outlined in [Spotify's cookie policy](https://www.spotify.com/us/legal/cookies-policy/). The number and type of cookies set by the Spotify platform may change over time, so make sure to check their site for an updated description.

Additionally Duotonic requires the use of the following first-party cookies:

| Name         | Description                                                                        | Type          |
| ------------ | ---------------------------------------------------------------------------------- | ------------- |
| io           | Identification for web socket communication                                        | cookie        |
| sessionID    | User identifying token for accessing Duotonic's databse and the Spotify API        | cookie        |
| isAuthorized | Informs the client whether the user as been authorized to use the Spotify API yet. | local storage |

As this cookie is necessary the core function of the website, the user cannot opt out of the use of it. The sessionID may be stored _persistently_, (i.e not deleted when the user closes their browser) for a period of up to one year if the user chooses to elect the "remember this device" feature when authenticating with their Spotify account.

## VI. Cookie Management

Browser cookies can be cleared at any time by the user through the means provided by their particular browser. Additionally, all cookies will be cleared when the user closes their browser window if the "remember this device" option is not selected.
