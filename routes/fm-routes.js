const
  app = require('express').Router(),
  db = require('../config/db')

// GET USERS FOR FACEMASH
app.post('/users-for-facemash', async (req, res) => {
  let
    { id } = req.session,
    users = await db.query('SELECT id, username FROM users WHERE id <> ? ORDER BY RAND() LIMIT 2', [ id ])
  res.json(users)
})

// FOR VOTING USER IN THE FACEMASH
app.post('/vote', async (req, res) => {
  let { user, against, photo } = req.body
  // console.log('user, against, winner:', user, against, winner)
  // await db.query('UPDATE facemash_stats SET votes=votes+1, facemash_count=facemash_count+1 WHERE user=?', [ user.id ])
  // await db.query('UPDATE facemash_stats SET facemash_count=facemash_count+1 WHERE user=?', [ against.id ])

  const row1 = await db.query('SELECT * FROM  facemash_stats WHERE user=?', [user.id])
  const row2 = await db.query('SELECT * FROM  facemash_stats WHERE user=?', [against.id])

  let rA =  row1[0].rating
  let rB =  row2[0].rating

  console.log('rA', rA)
  console.log('rB', rB)

  const exA = 1 / (1 + Math.pow(10, ((rA - rB)/400)))
  console.log('axA', exA)
  const exB = 1 / (1 + Math.pow(10, ((rA - rB)/400)))
  console.log('axB', exB)

  if(photo === 'winner'){

    const k1 = row1[0].k
    console.log('K1', k1)
    rA = rA + k1 * (1 - exA)
    console.log('rA', rA)

    if(rA >= 0){
      await db.query(`UPDATE facemash_stats SET votes=votes+1, rating=${rA} WHERE user=${user.id}`)
    }else{
      await db.query('UPDATE facemash_stats SET votes=votes+1, rating=0 WHERE user=?', [ user.id ])
    }

    if(rA > 2400) {
      await db.query('UPDATE facemash_stats SET k=10 WHERE user=?', [user.id])
    }else if(rA <= 2300){
      await db.query('UPDATE facemash_stats SET k=40 WHERE user=?', [user.id])
    }else{
      await db.query('UPDATE facemash_stats SET k=20 WHERE user=?', [user.id])
    }

    const k2 = row2[0].k
    console.log('k2', k2)
    rB = rB + k2 * (0 - exB)
    console.log('rB', rB)

    if(rB >= 0){
      await db.query(`UPDATE facemash_stats SET votes=votes+1, rating=${rB} WHERE user=${against.id}`)
    }else{
      await db.query(`UPDATE facemash_stats SET votes=votes+1, rating=0 WHERE user=${against.id}`)
    }

    if(rB > 2400) {
      await db.query('UPDATE facemash_stats SET k=10 WHERE user=?', [against.id])
    }else if(rB <= 2300){
      await db.query('UPDATE facemash_stats SET k=40 WHERE user=?', [against.id])
    }else{
      await db.query('UPDATE facemash_stats SET k=20 WHERE user=?', [against.id])
    }

    res.json({ mssg: `You voted ${user.username}!!` })

  } else {

    const k1 = row1[0].k
    console.log('K1', k1)
    rA = rA + k1 * (0.5 - exA)
    console.log('rA', rA)

    if(rA >= 0){
      await db.query(`UPDATE facemash_stats SET votes=votes+1, rating=${rA} WHERE user=${user.id}`)
    }else{
      await db.query(`UPDATE facemash_stats SET votes=votes+1, rating=0 WHERE user=${user.id}`)
    }

    if(rA > 2400) {
      await db.query('UPDATE facemash_stats SET k=10 WHERE user=?', [user.id])
    }else if(rA <= 2300){
      await db.query('UPDATE facemash_stats SET k=40 WHERE user=?', [user.id])
    }else{
      await db.query('UPDATE facemash_stats SET k=20 WHERE user=?', [user.id])
    }

    const k2 = row2[0].k
    console.log('k2', k2)
    rB = rB + k2 * (0.5 - exB)
    console.log('rB', rB)

    if(rB >= 0){
      await db.query(`UPDATE facemash_stats SET votes=votes+1, rating=${rB} WHERE user=${against.id}`)
    }else{
      await db.query(`UPDATE facemash_stats SET votes=votes+1, rating=0 WHERE user=${against.id}`)
    }

    if(rB > 2400) {
      await db.query('UPDATE facemash_stats SET k=10 WHERE user=?', [against.id])
    }else if(rB <= 2300){
      await db.query('UPDATE facemash_stats SET k=40 WHERE user=?', [against.id])
    }else{
      await db.query('UPDATE facemash_stats SET k=20 WHERE user=?', [against.id])
    }

    res.json({mssg:'Tie'})

  }
})

// GET FAMCEMASH STATS OF A USER ON THE PROFILE PAGE
app.post('/user-facemash-details', async (req, res) => {
  let
    { username } = req.body,
    ranking,
    [{ facemash_count, rating, votes }] = await db.query('SELECT facemash_count, rating, votes FROM facemash_stats WHERE username=? LIMIT 1', [ username ]),
    [{ greater }] = await db.query('SELECT COUNT(votes) AS greater FROM rating WHERE votes > ?', [ votes ])

  ranking = greater == 0 ? 1 : greater

  res.json({
    facemash_count,
    rating,
    ranking,
    votes
  })
})

// GET TOP FACEMASH USERS
app.post('/get-top-users', async (req, res) => {
  let
    { id } = req.session,
    users = await db.query('SELECT stats_id, votes, user, username, FROM facemash_stats WHERE user <> ? ORDER BY votes DESC', [ id ])
  res.json(users)
})

module.exports = app
