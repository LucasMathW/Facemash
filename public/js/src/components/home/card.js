import React from 'react'
import { Link } from 'react-router-dom'
import { post } from 'axios'
import Notify from 'handy-notification'
import $ from 'jquery'
import { connect } from 'react-redux'
import { facemash } from '../../store/actions/facemash-a'

@connect(store => {
  return {
    store
  }
})

export default class Card extends React.Component {

  state = {
    user: {},
    against: {},
    photo: '',
  }

  componentWillReceiveProps = ({ user, against, photo}) => {
    this.setState({ user, against, photo })
  }

  vote = async e => {
    e.preventDefault()
    $('.card_select').blur().addClass('a_disabled')

    console.log('STATE', this.state)

    let
      { user, against, photo } = this.state,
      { dispatch } = this.props,
      { data: { mssg } } = await post('/api/vote', { user, against, photo})

    $('.card_select').removeClass('a_disabled')
    Notify({ value: mssg })
    dispatch(facemash())
  }
  render(){
    let { user: { id, username } } = this.state
    console.log('STATE:', this.state)
    return (
      <div>
        <div className='card'>
          <img src={id ? `/users/${id}/avatar.jpg` : '/images/react.png'} />
          <Link to={`/profile/${username}`} className='card_username'>{username}</Link>
          <div className='card_links'>
            <a href='#' className='pri_btn card_select' onClick={this.vote} > Vote em {username}</a>
          </div>
        </div>
      </div>
    )
  }
}

