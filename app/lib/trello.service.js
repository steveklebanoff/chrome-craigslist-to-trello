import _ from 'lodash'
import storage from 'local-storage'
import Api from './api'

export default {
  getBoardsDropdown(callback) {
    if (storage.get('boardsDropdown')) {
      return callback(storage.get('boardsDropdown'))
    }

    Api.getOrganizations()
    // transform organizations
    .then((orgs) => {
      var dropdown = {
        me: { name: 'Boards', boards: [] }
      }

      _.transform(orgs, (result, org, key) => {
        result[org.id] = { name: org.displayName, boards: [] }
      }, dropdown)

      return dropdown
    })
    // transform boards
    .then((dropdown) => {
      Api.getBoards()
      .then((boards) => {
        _.transform(boards, (result, board, key) => {
          dropdown[board.idOrganization || 'me'].boards.push({
            id: board.id,
            label: board.name
          })
        })
        
        storage.set('boardsDropdown', dropdown)
        return callback(dropdown)
      })
    })
  },

  getListDropdown(boardId) {
    // TODO
  }
}
