import React from "react"
import { connect } from "react-redux";
import * as userStatusSelectors from "../user-status/selectors"
import styled from "styled-components";
import {Link} from "react-router-dom";
import {getLocation} from 'connected-react-router'

interface withSameFlag {
    samePage: boolean
}

const Outer = styled.div<withSameFlag>`
  opacity: ${({samePage}) => samePage ? 1 : 0.7};
  transition: opacity 100ms;
  order: ${({samePage}) => samePage ? -1 : 1};
  &:hover {
    opacity: 1;
  }
`

const Label = styled.div`
  opacity: 0;
  font-size: 12px;
  padding: 5px;
  transition: translate 100ms, opacity 100ms;
  position:absolute;
  bottom: calc(100% + 4px);
  left: 50%;
  background-color: white;
  border: 3px solid ${({theme})=>theme.highlight}
  transform: translate(-50%, 0);
  pointer-events: none;
  color: ${({theme})=>theme.black};
  text-decoration:none;
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 100%;
    width: 5px;
    height: 5px;
    background-color: #fff;
    border: 3px solid ${({theme})=>theme.highlight};
    border-left: none;
    border-top: none;
    transform: translate(-50%, -2px) rotate(45deg);
  }
`

const Wrap = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  
  &:hover ${Label}{ 
        opacity: 1;
  }
`

const Avatar = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  overflow: hidden;
`

const UserBadge = ({className, user, currentLocation}) => {
    const samePage = user.location === currentLocation.pathname
    const label = user.location.replace(/^\/p\//, '').replace(/\/$/, '')
    return (
    <Outer className={className} title={user.displayName} samePage={samePage}>
        <Link to={`${process.env.PUBLIC_URL}${user.location}`}>
            <Wrap>
                <Label className='label'>
                    {label}
                </Label>
                <Avatar src={user.avatar}/>
            </Wrap>
        </Link>
    </Outer>
)}

const mapStateToProps = (state, ownProps) => {
    const getUserById = userStatusSelectors.makeGetUserById(ownProps.userId)
    return {
        user: getUserById(state),
        currentLocation: getLocation(state),
    }
}

export default connect(mapStateToProps)(UserBadge)