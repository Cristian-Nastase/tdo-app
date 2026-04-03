export const state = {
    inMenu: false,
    currentList: null,
    loading: true,
};

export const setStorageState = function() {
    const sessionState = JSON.stringify(state);
    sessionStorage.setItem("state", sessionState);
}

const getStorageState = function () {
    const sessionState = JSON.parse(sessionStorage.getItem("state"));
    
    if(!sessionState)
        throw new Error("Fresh session");
    
    Object.assign(state, sessionState);
}

window.addEventListener("load", function() {
    try {
        getStorageState();
    }
    catch {
        console.log("Welcome to TDO!");
    }
});