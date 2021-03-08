
const notificationReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      if(state) {
        clearTimeout(state.timeoutID)
      }
      return action.data
    case 'RESET_NOTIFICATION':
      return null
    default:
      return state
  }
}

export const setNotification = (content, time) => {
  return async dispatch => {
    const timeoutID = setTimeout(() => {
      dispatch(resetNotification())
    }, time*1000)

    dispatch(
      {
        type: 'SET_NOTIFICATION',
        data: {
          content,
          timeoutID
        }
      }
    )
  }
}

export const resetNotification = () => {
  return {
    type: 'RESET_NOTIFICATION'
  }
}

export default notificationReducer

