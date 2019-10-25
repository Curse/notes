import React from "react"
import { connect } from "react-redux";
import * as userStatusSelectors from "../user-status/selectors"
import UserBadge from './user-badge'
import styled from "styled-components";

const Wrap = styled.div`
  display: flex;
  padding: 3px;
`

const StyledBadge = styled(UserBadge)`
  width: 20px;
  margin-right: 3px;
`

const UserStatus = ({className, userIds}) => (
    <Wrap className={className}>
        {userIds.map(user => <StyledBadge userId={user} key={user} />)}
    </Wrap>
)

const mapStateToProps = (state) => ({
    userIds: userStatusSelectors.getUserIds(state)
})

export default connect(mapStateToProps)(UserStatus)