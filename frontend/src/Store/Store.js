import {create} from "zustand"

const useStore = create((set)=>({
    userMessages:[],
    userInfo:{},
    updateUserMessages:(message)=>
        set((state)=>({userMessages:[...message]})),
    
    clearUserMessages : ()=>set(()=>({userMessages:[]})),
    updateUserDetails: (props)=>set(()=>({
        userInfo:{
            email:props.email,username:props.username,uniqueId:props.uniqueId,isAcceptingMessages:props.isAcceptingMessages
        }
    }))
}))

export default useStore