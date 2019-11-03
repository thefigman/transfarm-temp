export const state = () => ({
  val: 1
})

export const mutations = {
  increment(state) {
    state.val++
  }
}