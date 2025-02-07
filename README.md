### Nosc-AI test

#### Tech Stack
Frontend
- Vite
- React w/ TypeScript
- TailwindCss

Backend
- express w/ Typescript
- ioredis
- typeorm with postgre

#### Sample Usage Video URL
```

```

#### How to run

##### Backend
- install orbstack (recommended) or docker dekstop first and open when done installing
- `npm run dev`
##### Frontend 
- `npm run dev`

#### Notes
- this project using redis for store lock and take over request (admin)
- use "TTL" (time to live) redis to unlock appointment
- use "NX" to prevent duplicate lock

#### Difficulties Found
- First time using websocket, lot of experimenting and changing architecture
- Realtime display other user cursor, successfuly broadcasted the coordinate of another user, but when coordinate changes, there is always rerender and break the react hooks, still figure out how to serve coordinate change on client

#### Improvement Notes
- Realtime user cursor
- add Unit test to mock race condition
- end to end testing
- add proper auth on user
- add submit edit appointment
- add audit log when someone change appointment and store it on postgresql
