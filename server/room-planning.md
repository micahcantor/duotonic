# Rooms Design Doc

A room is the unit that holds shared information about the playback state of users that are listening together.

## Initializing Rooms
Rooms can be initialized in two ways:

1. Two users are paired from the random pairing queue. 
    - Room ID is generated and returned to both users.
    - User IDs are added to the room.
2. A user requests a share-able link.
    - Room ID is generated and returned from the /rooms/share-link endpoint.
    - The user that first requested the link is added to the room.
    - ID is appended as a query term to the share URL, which can then be distributed by the user.
    - When a client opens the link with valid authorization, their user ID is added to the room.

In both cases, the room ID will be used as the unique ID for a new web socket. This socket will be created on the server, and each of the users in the room will subscribe to it.

## Room Object Structure
Rooms hold a list of the users inside it, the current playback state, and a history of the chat messages.
``` js
{
    user_ids: [],
    chat: [],
    playback : {
        isPaused: bool,
        elapsed_ms: int,
        currentSong: {
            ...
        },
        queue: []
    }
}
```
It's extremely important that the user IDs and other room information remain separate, as the list of user IDs must never be sent to the client, as this would make it trivially easy to take over someone's spotify playback.

## Changes to Playback State
Whenever a user sends a request containing a room ID query parameter that affects the shared playback state:

1. Update the altered state in the respective room object.
2. Broadcast the new playback state to all users in the room, excluding the user who sent the request.
3. Clients will listen for these events and update their own local state accordingly.