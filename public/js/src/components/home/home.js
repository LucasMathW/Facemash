import React from 'react'
import { connect } from 'react-redux'
import Title from '../others/title'
import { FadeIn } from 'animate-components'
import Card from './card'
import { facemash } from '../../store/actions/facemash-a'

import { post } from 'axios'
import Notify from 'handy-notification'

@connect(store => {
  return {
    facemash: store.Facemash
  }
})

export default class Home extends React.Component {

  componentDidMount = () => {
    this.props.dispatch(facemash())
  }

  refresh_users = e => {
    e.preventDefault()
    this.props.dispatch(facemash())
  }

  vote_tie = async (users) => {

    const user = users[0]
    const against = users[1]
    const photo = 'tie'

    const tieVote = {user, against, photo}

    console.log('TIE VOTE DATE =>', tieVote)

    await post('/api/vote', tieVote)

    Notify({ value: 'Tie'})

    this.props.dispatch(facemash())

  }


  render(){
    let { users } = this.props.facemash

    return (
      <div class='home' >

        <Title value='Home' />

        <FadeIn duration='300ms' >
          <div className='facemash' >

            <div className='fm_header'>
              <span>Whome do you wanna vote?</span>
            </div>

            <div className='fm_main'>
              <Card user={users[0]} against={users[1]} photo='winner' />
              <span className='fm_or'>ou</span>
              <Card user={users[1]} against={users[0]} photo='winner' />
            </div>

            <div className='fm_bottom'>
              <a href='#' className='refresh pri_btn' onClick={() => this.vote_tie(users)} > Tie </a>
            </div>

            <div className='fm_bottom'>
              <a href='#' className='refresh pri_btn' onClick={this.refresh_users} >Refresh users</a>
            </div>

          </div>
        </FadeIn>

      </div>
    )
  }
}
