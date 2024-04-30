Renders chat interface with chatbox, userlist on the right side, command panel to the right of it.

1. Users can send messages to eachother
   1. Messages are saved for one week, then deleted from the database
2. User can send game invites to eachother
   1. Game replays are saved into the database
      1. Replays consist of moves, which are being saved with the respective `gameID` and `playerID` and the type action and coordinates of the moves
   2. Games can be saved to continue them at a later time
   3. Games have a status field in the database where it will display either: `in progress`, `saved` or `replay`
   4. Invites will be possible through clicking on the name of the player from the playerlist, from where the command panel will be displayed with command options
