
export const setNotification = (message) => {
  return async dispatch => {
    const timeoutID = setTimeout(() => {
      dispatch(resetNotification())
    }, 5000)
    dispatch ({
      type: 'SET_NOTIFICATION',
      data: {
        content: message.content,
        type: message.type,
        timeoutID
      }
    })
  }
}

export const resetNotification = () => {
  return ({
    type: 'RESET_NOTIFICATION'
  })
}


const notificationReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      if (state) {
        clearTimeout(state.timeoutID)
      }
      return action.data
    case 'RESET_NOTIFICATION':
      return null
    default:
      return state
  }
}

export default notificationReducer