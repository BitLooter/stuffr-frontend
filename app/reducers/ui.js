/* Reducers to manage UI state */

import { handleActions } from 'redux-actions'
import Immutable from 'seamless-immutable'

import * as models from '../models'

const DIALOG_CLOSED = Symbol.for('ui.DIALOG_CLOSED')
const DIALOG_NEW = Symbol.for('ui.DIALOG_NEW')
const DIALOG_EDIT = Symbol.for('ui.DIALOG_EDIT')

const placeholderThing = Immutable(models.createThing({name: 'PLACEHOLDER'}))
const placeholderInventory = Immutable(models.createInventory({name: 'PLACEHOLDER'}))
const emptyThing = Immutable(models.createThing())
const emptyInventory = Immutable(models.createInventory())
const noUser = Immutable({authenticated: false, currentInventory: null})

function openThingEditorReducer (state, action) {
  // If no payload, it's a new thing, otherwise edit thing in payload
  const thing = action.payload || emptyThing
  const mode = action.payload ? DIALOG_EDIT : DIALOG_NEW
  let newState = state.setIn(['thingDialog', 'mode'], mode)
  newState = newState.setIn(['thingDialog', 'thing'], Immutable(thing))
  return newState
}

function closeThingEditorReducer (state, action) {
  return state.setIn(['thingDialog', 'mode'], DIALOG_CLOSED)
}

function openInventoryEditorReducer (state, action) {
  // If no payload, it's a new inventory, otherwise edit inventory in payload
  const inventory = action.payload || emptyInventory
  const mode = action.payload ? DIALOG_EDIT : DIALOG_NEW
  let newState = state.setIn(['inventoryDialog', 'mode'], mode)
  newState = newState.setIn(['inventoryDialog', 'inventory'], Immutable(inventory))
  return newState
}

function closeInventoryEditorReducer (state, action) {
  return state.setIn(['inventoryDialog', 'mode'], DIALOG_CLOSED)
}

function setCurrentInventoryReducer (state, action) {
  return state.set('currentInventory', action.payload.index)
}

function authorizationRequiredReducer (state, action) {
  return state.set('authenticated', false)
}

function userAuthenticatedReducer (state, action) {
  return state.set('authenticated', true)
}

function userLoginErrorReducer (state, action) {
  // TODO: make login/register errors more user-friendly
  return state.set('loginDialogError', action.payload.message)
}

function userRegisterErrorReducer (state, action) {
  return state.set('registerDialogError', action.payload.message)
}

function purgeUserReducer (state, action) {
  return state.merge(noUser)
}

const reducer = handleActions({
  OPEN_THING_EDITOR: openThingEditorReducer,
  CLOSE_THING_EDITOR: closeThingEditorReducer,
  // TODO: Don't wait for submit to finish
  SUBMIT_THING__FINISH: closeThingEditorReducer,
  OPEN_INVENTORY_EDITOR: openInventoryEditorReducer,
  CLOSE_INVENTORY_EDITOR: closeInventoryEditorReducer,
  SUBMIT_INVENTORY__FINISH: closeInventoryEditorReducer,
  LOAD_INVENTORY__FINISH: setCurrentInventoryReducer,
  AUTHORIZATION_REQUIRED: authorizationRequiredReducer,
  LOGIN_USER__FINISH: userAuthenticatedReducer,
  LOGIN_USER__ERROR: userLoginErrorReducer,
  REGISTER_USER__FINISH: userAuthenticatedReducer,
  REGISTER_USER__ERROR: userRegisterErrorReducer,
  PURGE_USER: purgeUserReducer
}, Immutable({
  authenticated: true,
  currentInventory: null,
  thingDialog: {
    mode: DIALOG_CLOSED,
    thing: placeholderThing
  },
  inventoryDialog: {
    mode: DIALOG_CLOSED,
    inventory: placeholderInventory
  },
  loginDialogError: undefined,
  registerDialogError: undefined
}, {deep: true}
))

export default reducer
