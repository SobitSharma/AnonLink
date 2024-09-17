import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import useStore from "../../Store/Store";
import { useNavigate } from "react-router-dom";
import CopyToClipboard from "react-copy-to-clipboard";

const Home = () => {
  const [toggleChangedflag, setToggleChangeFlag] = useState(true);
  const { isAuthenticated, user, isLoading } = useAuth0();
  const updateUserMessages = useStore((state) => state.updateUserMessages);
  const updateUserDetails = useStore((state) => state.updateUserDetails);
  const userMessages = useStore((state) => state.userMessages);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [showNotification, setshowNotification] = useState(false);
  const [loading, setloading] = useState(false);
  const userInfo = useStore((state) => state.userInfo);
  const [copyStatus, setCopyStatus] = useState(false);
  const navigate = useNavigate();
  const [toggleValue, setToggleValue] = useState(
    userInfo.isAcceptingMessages || undefined
  );

  function HandleNotifications(message) {
    setNotificationMessage(message);
    setshowNotification(true);
    setTimeout(() => setshowNotification(false), 2000);
  }

  function OnCopyChange() {
    setCopyStatus(true);
    setTimeout(() => {
      setCopyStatus(false);
    }, 2000);
  }

  function HandleDelete(id) {
    fetch(`/v1/delete/${id}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status == 200) {
          updateUserMessages(result.messages);
          HandleNotifications("Message Deleted SuccessFully")
        } else {
          HandleNotifications("Some Error Occurred While Deleting the Messages")
        }
      });
  }

  function Refresh() {
    fetch("/v1/getmessages", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        if (response.status == 200) {
          updateUserMessages(response.messages);
          HandleNotifications("Messages Refreshed SuccessFully")
        } else {
          HandleNotifications("Some Error Occurred while refreshing the Messages")
        }
      });
  }


  function OnToggleChange() {
    if (!loading) {
      return;
    }
    fetch(`/v1/update/${toggleValue}`, {
      method: "PUT",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status == 200) {
          HandleNotifications("Status Updated SucessFully")
        } else {
          HandleNotifications("Some Error Occurred while updating the status")
        }
      });
  }

  function HandleLogout(){
    fetch('/v1/logout', {
      method:'GET',
      credentials:'include'
    }).then((response)=>response.json())
    .then((response)=>{
      if(response.status == 200){
        navigate('/')
      }
      else{
        HandleNotifications("Some Error Occurred While Logging Out")
      }
    })
  }

  useEffect(() => {
    if (isAuthenticated) {
      const userDetails = { name: user.name, email: user.email };
      fetch("/v1/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
        credentials: "include",
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.status == 200) {
            let uniqueId = `http://localhost:5173/sendmessages/${response.user?.uniqueId}`;
            const responseFromApi = {
              username: response.user?.username,
              email: response.user?.email,
              uniqueId: uniqueId,
              isAcceptingMessages: response.user?.isAcceptingMessages,
            };
            const messages = response.user?.messages;
            updateUserMessages(messages);
            updateUserDetails(responseFromApi);
            setToggleValue(responseFromApi.isAcceptingMessages);
            setloading(true);
          } else {
            alert("Some Error has been Occurred");
            navigate("/");
          }
        });
    }
  }, [isLoading]);

  useEffect(OnToggleChange, [toggleChangedflag]);

  if (loading) {
    return (
      <div>
        <div className="min-h-screen bg-base-200">
          <div className="navbar bg-primary text-white px-10">
            <div className="flex-1">
              <span className="text-xl font-bold">Welcome To AnonLink</span>
            </div>
            <div className="flex-none">
              <span className="mr-4">Welcome, {userInfo.username}</span>
              <button className="btn btn-sm btn-outline" onClick={HandleLogout}>Logout</button>
            </div>
          </div>
          {
            showNotification &&
          <div role="alert" className="alert text">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-info h-6 w-6 shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>{notificationMessage}</span>
          </div>
          }
          <div className="container mx-auto mt-10 p-5">
            <h1 className="text-3xl font-bold">User Dashboard</h1>
            <div className="my-4">
              <p className="font-medium p-2">Copy Your Unique Link</p>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={userInfo.uniqueId}
                  className="input input-bordered w-full max-w-md"
                  readOnly
                />
                <CopyToClipboard text={userInfo.uniqueId} onCopy={OnCopyChange}>
                  <button className="btn btn-primary">Copy</button>
                </CopyToClipboard>
                <p className="p-2 text-red-500">
                  {copyStatus ? "Link Copied" : ""}
                </p>
              </div>
            </div>

            <div className="my-4 flex items-center">
              <span className="font-medium mr-2">Accept Messages:</span>

              <input
                type="checkbox"
                className="toggle"
                defaultChecked={toggleValue}
                onChange={() => {
                  setToggleValue((prev) => !prev);
                  setToggleChangeFlag((prev) => !prev);
                }}
              />
            </div>
            <button
              className="btn btn-outline btn-accent p-4"
              onClick={Refresh}
            >
              Refresh
            </button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
              {userMessages.map((message, index) => (
                <div key={index} className="card bg-white shadow-md p-5">
                  <p className="font-semibold text-lg">{message.message}</p>
                  <p className="text-sm text-gray-500">
                    {message.timeStamp || "Time"}
                  </p>
                  <div className="mt-3 text-right">
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => HandleDelete(message._id)}
                    >
                      X
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner text-primary text-4xl"></span>
      </div>
    );
  }
};

export default Home;
