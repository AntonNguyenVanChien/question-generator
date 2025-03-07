export const state = () => ({
  activeTabHome: 0,
})

export const mutations = {
  SET_ACTIVE_TAB_HOME(state, activeTabHome) {
    state.activeTabHome = activeTabHome
  },
}
