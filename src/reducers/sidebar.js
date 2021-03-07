const initialState = {
  sidebarShow: "responsive",
  asideShow: false,
  darkMode: false,
};

const sidebarReducer = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case "set":
      return { ...state, ...rest };
    default:
      return state;
  }
};

export default sidebarReducer;
