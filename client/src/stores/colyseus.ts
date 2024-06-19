import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as Colyseus from "colyseus.js";

export const useColyseusStore = defineStore('colyseus', () => {
  const client = new Colyseus.Client("ws://localhost:2567");
  const room = client
      .joinOrCreate("my_room")
      .then(function (room) {
          room.onMessage('__playground_message_types', (e) => {
              console.log('message ', e)
          })
        console.log("Connected to roomId: " + room.roomId);
      })
      .catch(function (error) {
        console.log("Couldn't connect.");
      });

  return { client, room }
})
