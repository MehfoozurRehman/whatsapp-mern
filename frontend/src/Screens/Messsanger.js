import React, { useState, useEffect } from "react";
import {
  Menu,
  MessageSquare,
  Search,
  X,
  Mic,
  Paperclip,
  Smile,
  Image,
  Check,
  PlayCircle,
} from "react-feather";
import userPic from "../Assets/userPic.jpg";
import Avatar from "../Components/Avatar";
import IconBtn from "../Components/IconBtn";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import imageToBase64 from "image-to-base64/browser";
import imageCompression from "browser-image-compression";

export default function Messsanger({ messages, rooms, axios, userName }) {
  const [roomName, setRoomName] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomImage, setNewRoomImage] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [searchQuesryRooms, setSearchQuesryRooms] = useState("");
  const [searchQuesryMessages, setSearchQuesryMessages] = useState("");
  const [lastMessage, setLastMessage] = useState("");
  const [newMessagefocus, setNewMessagefocus] = useState(false);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [openMic, setOpenMic] = useState(false);
  const [createRoom, setCreateRoom] = useState(false);
  const [searchBar, setSearchBar] = useState(false);
  const [roomSelected, setRoomSelected] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [roomImage, setRoomImage] = useState("");
  const [second, setSecond] = useState("00");
  const [minute, setMinute] = useState("00");
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [counter, setCounter] = useState(0);
  const { transcript, resetTranscript } = useSpeechRecognition();

  const date = new Date();
  const options = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const timeString = date.toLocaleString("en-PK", options);

  useEffect(() => {
    let intervalId;

    if (isTimerActive) {
      intervalId = setInterval(() => {
        const secondCounter = counter % 60;
        const minuteCounter = Math.floor(counter / 60);

        const computedSecond =
          String(secondCounter).length === 1
            ? `0${secondCounter}`
            : secondCounter;
        const computedMinute =
          String(minuteCounter).length === 1
            ? `0${minuteCounter}`
            : minuteCounter;

        setSecond(computedSecond);
        setMinute(computedMinute);

        setCounter((counter) => counter + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isTimerActive, counter]);

  function handleRoomCreation(e) {
    // e.prventDefault();

    axios.post("/v1/createRoom", {
      name: newRoomName,
      roomImage: newRoomImage,
      date: timeString,
      lastMessage: "lastMessage",
    });
  }

  function handleMessageCreation(e) {
    axios.post("/v1/createMessage", {
      message: newMessage,
      timestamp: timeString,
      user: userName,
      room: roomName,
    });
    // e.preventDefault();
  }

  function handleEmojiClick(event, emojiObject) {
    setNewMessage(emojiObject);
  }
  return (
    <div className="messanger">
      <div className="messanger__sidebar">
        <div
          className="messanger__sidebar__header"
          style={{ borderTopLeftRadius: 10 }}
        >
          <Avatar userPic={userPic} />
          <div className="messanger__sidebar__header__btn">
            {createRoom ? (
              <form style={{ display: "flex" }} encType="multipart/form-data">
                <div
                  className="messanger__sidebar__search__box messanger__sidebar__search__box__reverse"
                  style={{ marginRight: "0em", maxWidth: "200px" }}
                >
                  <input
                    value={newRoomName}
                    type="text"
                    placeholder="Room name"
                    className="messanger__sidebar__search__input__field"
                    onChange={(e) => {
                      setNewRoomName(e.target.value);
                    }}
                  />
                </div>
                <div className="messanger__icon__btn messanger__sidebar__search__input__btn">
                  <input
                    type="file"
                    name="roomImage"
                    accept="image/*"
                    onChange={async (e) => {
                      const options = {
                        maxSizeMB: 0.02,
                        maxWidthOrHeight: 300,
                        useWebWorker: true,
                      };
                      try {
                        const compressedFile = await imageCompression(
                          e.target.files[0],
                          options
                        );
                        imageToBase64(URL.createObjectURL(compressedFile))
                          .then((response) => {
                            setNewRoomImage(response);
                            // console.log(response);
                          })
                          .catch((error) => {
                            console.log(error);
                          });
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                  />
                  <Image color="currentColor" size={20} />
                </div>
                <button
                  style={{ display: "none" }}
                  type="submit"
                  onClick={handleRoomCreation}
                >
                  Creat Room
                </button>
              </form>
            ) : null}
            {createRoom ? (
              <IconBtn
                icon={<X color="currentColor" size={20} />}
                type="button"
                onPress={() => {
                  if (createRoom) {
                    setCreateRoom(false);
                  }
                }}
              />
            ) : (
              <IconBtn
                icon={<MessageSquare color="currentColor" size={20} />}
                type="button"
                onPress={() => {
                  if (!createRoom) {
                    setCreateRoom(true);
                  }
                }}
              />
            )}
            <IconBtn
              icon={<Menu color="currentColor" size={20} />}
              onPress={() => {}}
            />
          </div>
        </div>
        <div className="messanger__sidebar__search">
          <div className="messanger__sidebar__search__box">
            <Search color="currentColor" size={20} />
            <input
              type="text"
              value={searchQuesryRooms}
              placeholder="Search Rooms"
              className="messanger__sidebar__search__input__field"
              onChange={(e) => {
                setSearchQuesryRooms(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="messanger__sidebar__rooms">
          {rooms
            .filter((room) => room.name.includes(searchQuesryRooms))
            .map((room) => (
              <div className="messanger__sidebar__room" key={room._id}>
                <input
                  type="radio"
                  name="messanger__sidebar__room"
                  id="messanger__sidebar__room"
                  onChange={() => {
                    setRoomName(room.name);
                    setRoomSelected(true);
                    setRoomImage(room.roomImage);
                  }}
                />
                <div className="messanger__sidebar__room__content">
                  <Avatar userPic={"data:image/png;base64," + room.roomImage} />
                  <div className="messanger__sidebar__room__right">
                    <div className="messanger__sidebar__room__top">
                      <div className="messanger__sidebar__room__left__name">
                        {room.name}
                      </div>

                      <div className="messanger__sidebar__room__timestamp">
                        {room.date}
                      </div>
                    </div>
                    <div className="messanger__sidebar__room__left__last__message">
                      {room.lastMessage}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      {roomSelected ? (
        <div className="messanger__chat__box">
          <div
            className="messanger__sidebar__header"
            style={{ borderTopRightRadius: 10 }}
          >
            <div style={{ display: "flex" }}>
              <Avatar userPic={"data:image/png;base64," + roomImage} />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "1em",
                  justifyContent: "space-between",
                }}
              >
                <div className="messanger__sidebar__room__left__name">
                  {roomName}
                </div>
                <div className="messanger__sidebar__room__timestamp">
                  online
                </div>
              </div>
            </div>
            <div className="messanger__sidebar__header__btn">
              {searchBar ? (
                <div className="messanger__sidebar__search__box messanger__sidebar__search__box__reverse">
                  <Search color="currentColor" size={20} />
                  <input
                    value={searchQuesryMessages}
                    type="text"
                    placeholder="Search Messages"
                    className="messanger__sidebar__search__input__field"
                    onChange={(e) => {
                      setSearchQuesryMessages(e.target.value);
                    }}
                  />
                </div>
              ) : null}
              {searchBar ? (
                <IconBtn
                  icon={<X color="currentColor" size={20} />}
                  onPress={() => {
                    if (searchBar) {
                      setSearchBar(false);
                    }
                  }}
                />
              ) : (
                <IconBtn
                  icon={<Search color="currentColor" size={20} />}
                  onPress={() => {
                    if (!searchBar) {
                      setSearchBar(true);
                    }
                  }}
                />
              )}
              <IconBtn
                icon={<Menu color="currentColor" size={20} />}
                onPress={() => {}}
              />
            </div>
          </div>
          <div className="messanger__chat__box__main">
            {messages
              .filter(
                (message) =>
                  message.message.includes(searchQuesryMessages) &&
                  message.room === roomName
              )
              .map((message) => (
                <div
                  key={message._id}
                  className={
                    message.user === userName
                      ? "messanger__chat__box__main__message__row message__recieved"
                      : "messanger__chat__box__main__message__row "
                  }
                >
                  <div className="messanger__chat__box__main__message ">
                    <div className="messanger__chat__box__main__message__user">
                      {message.user}
                    </div>
                    <div className="messanger__chat__box__main__message__content">
                      {message.message}
                    </div>
                    <div className="messanger__chat__box__main__message__timestamp">
                      {message.timestamp}
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div
            className="messanger__sidebar__header"
            style={{ borderBottomRightRadius: 10 }}
          >
            <div className="messanger__sidebar__header__btn">
              {openEmojiPicker ? (
                <IconBtn
                  icon={<X color="currentColor" size={20} />}
                  onPress={() => {
                    if (openEmojiPicker) {
                      setOpenEmojiPicker(false);
                    }
                  }}
                />
              ) : (
                <IconBtn
                  icon={<Smile color="currentColor" size={20} />}
                  onPress={() => {
                    if (!openEmojiPicker) {
                      setOpenEmojiPicker(true);
                    }
                  }}
                />
              )}

              {openEmojiPicker ? (
                <div className="emoji__picker">
                  <Picker
                    theme="dark"
                    autoFocus={true}
                    color="#056162"
                    onSelect={(e) => {
                      setNewMessage(newMessage + e.native);
                    }}
                  />
                </div>
              ) : null}

              <IconBtn
                icon={<Paperclip color="currentColor" size={20} />}
                onPress={() => {}}
              />
            </div>
            <form
              className="messanger__sidebar__search__box messanger__sidebar__search__box__reverse"
              style={{ marginRight: "0em" }}
            >
              <input
                value={newMessage}
                type="text"
                placeholder="Type a message"
                className="messanger__sidebar__search__input__field"
                onChange={(e) => {
                  setNewMessage(e.target.value);
                }}
              />
              <button
                style={{ display: "none" }}
                type="submit"
                onClick={handleMessageCreation}
              >
                Send Message
              </button>
            </form>
            <div className="messanger__sidebar__header__btn">
              {openMic ? (
                <>
                  <IconBtn
                    icon={<X color="currentColor" size={20} />}
                    onPress={() => {
                      if (openMic) {
                        setOpenMic(false);
                        setIsTimerActive(false);
                      }
                      SpeechRecognition.stopListening();
                    }}
                  />
                  <div className="messanger__sidebar__header__btn__time__recoded__box">
                    <PlayCircle color="white" size={15} />
                    <div className="messanger__sidebar__header__btn__time__recoded">
                      <span className="minute">{minute}</span>
                      <span>:</span>
                      <span className="second">{second}</span>
                    </div>
                  </div>
                  <IconBtn
                    icon={<Check color="currentColor" size={20} />}
                    onPress={() => {
                      // if (openMic) {
                      //   setOpenMic(false);
                      // }
                    }}
                  />
                </>
              ) : (
                <IconBtn
                  icon={<Mic color="currentColor" size={20} />}
                  onPress={() => {
                    setCounter(0);
                    setIsTimerActive(true);
                    // SpeechRecognition.startListening();
                    if (!openMic) {
                      setOpenMic(true);
                    }
                    // if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
                    //   console.log(
                    //     "Browser not supported & return some useful info."
                    //   );
                    // } else {
                    //   setNewMessage(transcript);
                    // }
                    // SpeechRecognition.startListening({
                    //   continuous: true,
                    // });
                  }}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="messanger__chat__box__not__selected">
          <svg
            id="bcc78b6a-42d3-482d-a166-e03269f3a1e1"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1188 795.33"
          >
            <defs>
              <linearGradient
                id="b951b20a-1330-40a2-8498-70064fea6747"
                x1="600"
                y1="847.66"
                x2="600"
                y2="99"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#056162" />
                <stop offset="1" stopColor="#3f3d56" />
              </linearGradient>
              <linearGradient
                id="a09f8209-a7b7-4999-9a81-8afbf160c3ae"
                x1="661.47"
                y1="455.58"
                x2="661.47"
                y2="52.33"
                gradientTransform="translate(168)"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="gray" stopOpacity="0.25" />
                <stop offset="0.54" stopColor="gray" stopOpacity="0.12" />
                <stop offset="1" stopColor="gray" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <title>dreamer</title>
            <path
              d="M1142.29,408.43q-7-9.82-14.87-19a278.6,278.6,0,0,0-96.83-72.77,273.46,273.46,0,0,0-31.27-11.93q-11.1-3.48-22.58-6L962.3,295.9a278.45,278.45,0,0,0-209.12,49q-10.77-1.31-21.8-1.75c-.28-.77-.57-1.54-.87-2.32q-3.68-9.74-7.89-19.2a374.37,374.37,0,0,0-62.4-96.88c-1.18-1.32-2.36-2.64-3.56-3.94a378,378,0,0,0-56.56-50.57A373.18,373.18,0,0,0,380.86,99h-.53q-8.76,0-17.41.41l-22.27,1.68c-1.83.19-3.66.39-5.48.62h0l-22.51,3.4q-8.94,1.62-17.73,3.69A375.19,375.19,0,0,0,91.8,234.85q-9.48,11.43-18,23.63c-2.71,3.86-5.35,7.75-7.9,11.71-1.23,1.9-2.44,3.8-3.64,5.72Q56.32,285.42,51,295.3q-5.67,10.47-10.68,21.32a1.42,1.42,0,0,0-.08.18,370.54,370.54,0,0,0-24.73,72.49h0q-2.27,9.84-4,19.86-.68,3.84-1.26,7.7l-.12.86c-1,7-1.89,14-2.54,21.13l-.87.08c.07.21.14.42.19.64a6.45,6.45,0,0,0,.58.31c-.08.91-.15,1.82-.22,2.72A8.61,8.61,0,0,1,7.08,445Q6,459,6,473.34A372.42,372.42,0,0,0,48.54,646.8l.39.74A375.84,375.84,0,0,0,168.57,782,372,372,0,0,0,300.7,839.17l8.27,1.69q17.14,3.32,34.83,5,18,1.74,36.53,1.75a376.28,376.28,0,0,0,51.33-3.5H872.05l3.58.55a277.83,277.83,0,0,0,266.66-436.28Z"
              transform="translate(-6 -52.33)"
              fill="url(#b951b20a-1330-40a2-8498-70064fea6747)"
            />
            <path
              d="M995,613.28h0c-.05-3.27-.16-6.5-.34-9.74q-.32-6.1-.89-12.15a274.18,274.18,0,0,0-5.43-34c-.11-.5-.23-1-.35-1.51q-3-12.95-7.17-25.43Q978,522.07,974.67,514h0q-1.18-2.91-2.44-5.75a271.5,271.5,0,0,0-13-26h0l-.63-1.1c-1.45-2.52-3-5-4.48-7.51h0l-.61-1c-.29-.47-.58-.87-.83-1.32l0-.06q-2.94-4.67-6.06-9.19a276.24,276.24,0,0,0-21.3-27.1h0a277.85,277.85,0,0,0-37.09-34.58s0,0,0,0c-3.33-2.55-6.7-5.05-10.15-7.47,0,0,0,0,0,0a273.4,273.4,0,0,0-124.78-47.88q-10.77-1.31-21.8-1.75c-1.81-.08-3.62-.13-5.43-.16-2-.06-4-.07-6-.07a278.73,278.73,0,0,0-35.12,2.22,274.07,274.07,0,0,0-57.06,13.62A275.22,275.22,0,0,0,390,222a271.16,271.16,0,0,0-29.36,1.57c-1.08.09-2.16.22-3.24.35a273.83,273.83,0,0,0-39.17,7.55c-3.82-6.28-7.89-12.43-12.2-18.38S297.34,201.5,292.66,196q-6-7-12.38-13.62a5.55,5.55,0,0,0-.42-.42,273.79,273.79,0,0,0-20.94-19.36c-3.9-3.26-7.89-6.42-12-9.44q-7.71-5.76-15.83-10.94-5.7-3.66-11.58-7A376.23,376.23,0,0,0,91.8,234.85q-9.48,11.43-18,23.63c-2.71,3.86-5.35,7.75-7.9,11.71-1.23,1.9-2.44,3.8-3.64,5.72Q56.32,285.42,51,295.3q-5.67,10.47-10.68,21.32a1.42,1.42,0,0,0-.08.18,370.54,370.54,0,0,0-24.73,72.49h0q-2.27,9.84-4,19.86-.68,3.84-1.26,7.7l-.12.86c-1,7-1.89,14-2.54,21.13l-.87.08c.07.21.14.42.19.64a6.45,6.45,0,0,0,.58.31c-.08.91-.15,1.82-.22,2.72A8.61,8.61,0,0,1,7.08,445Q6,459,6,473.34A372.42,372.42,0,0,0,48.54,646.8c.33.05.67.1,1,.13h0a276.23,276.23,0,0,0,105.21-7.46q4.68,7.72,9.86,15.1,3.83,5.48,7.92,10.74A276.34,276.34,0,0,0,255.68,737c1.41.8,2.84,1.57,4.27,2.34A270.73,270.73,0,0,0,300,756.88q8,2.79,16.31,5.09c.31.08.62.18.93.25a272.89,272.89,0,0,0,53.13,9q9.72.71,19.62.71a278,278,0,0,0,44.34-3.56,271.65,271.65,0,0,0,27.18-5.87h0q10.5-2.81,20.65-6.43,2.85,4.89,5.89,9.64A271.45,271.45,0,0,0,511,796.67q6.29,7.38,13.11,14.29a276,276,0,0,0,39.45,33.2H872.05l3.58.55A277.57,277.57,0,0,0,915.9,811,274.3,274.3,0,0,0,991,664.69q1.37-8,2.27-16.06A277.48,277.48,0,0,0,995,618C995,616.4,995,614.84,995,613.28Z"
              transform="translate(-6 -52.33)"
              fill="#056162"
              opacity="0.3"
            />
            <path
              d="M1194,569.87A278.29,278.29,0,0,1,1054.29,811H512.83q-1-7.15-1.81-14.29c-.43-3.56-.83-7.11-1.21-10.67-.66-6.18-1.24-12.41-1.69-18.69-2.4-33.62-1-68,12.4-98.09A118.7,118.7,0,0,1,526.2,658a124.72,124.72,0,0,1,10.45-15.37,139.73,139.73,0,0,1,11-12.23A166.74,166.74,0,0,1,564.36,616c2.81-2.13,5.7-4.2,8.64-6.19l.54-.36c15.07-10.14,31.65-18.44,48.35-25.52l3.46-1.44.9-.37c1.63-.68,3.26-1.33,4.89-2l.65-.26Q645,574.6,658.4,570.1q22.76-7.67,46.17-13.19,5.82-1.38,11.68-2.61,5.67-1.21,11.37-2.28,12.61-2.4,25.32-4.16c.88-.12,1.75-.24,2.63-.34l5.54-.73,1-.12c1.59-.2,3.19-.38,4.79-.56,6.53-.75,13.07-1.39,19.61-2,0,0,0,0,0,0,.26,0,.51,0,.76-.09h.06q10.39-.88,20.8-1.64l4.86-.36,4-.28q11.88-.84,23.76-1.68c6.42-.49,12.83-1,19.24-1.57,1.09-.09,2.17-.18,3.26-.29l2.21-.21a4.07,4.07,0,0,0,.6-.06h.28l3.71-.37a1.66,1.66,0,0,1,.22,0h0c1.07-.1,2.12-.21,3.18-.33,8.5-.88,17-1.92,25.44-3.19l2.58-.38a363.89,363.89,0,0,0,43.37-9.38q4.88-1.39,9.7-2.94,5.53-1.79,11-3.8l1.54-.57c2.54-1,5.06-2,7.56-3h0c3.64-1.5,7.24-3.11,10.78-4.8l.46-.21q6.32-3,12.4-6.44c1.88-1.06,3.75-2.16,5.59-3.29a177.11,177.11,0,0,0,26.26-19.32c.62-.56,1.23-1.11,1.83-1.67l.2-.18a273.09,273.09,0,0,0,22.42-24c9.94-11.68,19.56-23.69,30.53-34.38q4.8-4.68,10-9c4-3.3,8.08-6.41,12.32-9.33l.63-.44a181.25,181.25,0,0,1,19.36-11.57q7.85,9.17,14.87,19A276.44,276.44,0,0,1,1194,569.87Z"
              transform="translate(-6 -52.33)"
              fill="#056162"
            />
            <path
              d="M1194,569.87A278.29,278.29,0,0,1,1054.29,811H512.83q-1-7.15-1.81-14.29c-.43-3.56-.83-7.11-1.21-10.67-.66-6.18-1.24-12.41-1.69-18.69-2.4-33.62-1-68,12.4-98.09A118.7,118.7,0,0,1,526.2,658a124.72,124.72,0,0,1,10.45-15.37,139.73,139.73,0,0,1,11-12.23A166.74,166.74,0,0,1,564.36,616c2.81-2.13,5.7-4.2,8.64-6.19l.54-.36c15.07-10.14,31.65-18.44,48.35-25.52l3.46-1.44.9-.37c1.63-.68,3.26-1.33,4.89-2l.65-.26Q645,574.6,658.4,570.1q22.76-7.67,46.17-13.19,5.82-1.38,11.68-2.61,5.67-1.21,11.37-2.28,12.61-2.4,25.32-4.16c.88-.12,1.75-.24,2.63-.34l5.54-.73,1-.12c1.59-.2,3.19-.38,4.79-.56,6.53-.75,13.07-1.39,19.61-2,0,0,0,0,0,0,.26,0,.51,0,.76-.09h.06q10.39-.88,20.8-1.64l4.86-.36,4-.28q11.88-.84,23.76-1.68c6.42-.49,12.83-1,19.24-1.57,1.09-.09,2.17-.18,3.26-.29l2.21-.21a4.07,4.07,0,0,0,.6-.06h.28l3.71-.37a1.66,1.66,0,0,1,.22,0h0c1.07-.1,2.12-.21,3.18-.33,8.5-.88,17-1.92,25.44-3.19l2.58-.38a363.89,363.89,0,0,0,43.37-9.38q4.88-1.39,9.7-2.94,5.53-1.79,11-3.8l1.54-.57c2.54-1,5.06-2,7.56-3h0c3.64-1.5,7.24-3.11,10.78-4.8l.46-.21q6.32-3,12.4-6.44c1.88-1.06,3.75-2.16,5.59-3.29a177.11,177.11,0,0,0,26.26-19.32c.62-.56,1.23-1.11,1.83-1.67l.2-.18a273.09,273.09,0,0,0,22.42-24c9.94-11.68,19.56-23.69,30.53-34.38q4.8-4.68,10-9c4-3.3,8.08-6.41,12.32-9.33l.63-.44a181.25,181.25,0,0,1,19.36-11.57q7.85,9.17,14.87,19A276.44,276.44,0,0,1,1194,569.87Z"
              transform="translate(-6 -52.33)"
              opacity="0.2"
            />
            <ellipse
              cx="197.29"
              cy="504.78"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="197.29"
              cy="496.12"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="197.29"
              cy="487.46"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="197.29"
              cy="478.8"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="197.29"
              cy="470.14"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="197.29"
              cy="461.48"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="197.29"
              cy="452.82"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <path
              d="M223.55,445.88a26.3,26.3,0,0,0,2-3l-14.22-2.33,15.38.11a26,26,0,0,0,.49-20.54l-20.64,10.7,19-14a25.93,25.93,0,1,0-42.83,29,25.91,25.91,0,0,0-3,4.73l18.47,9.59-19.69-6.61a25.93,25.93,0,0,0,4.18,24.35,25.93,25.93,0,1,0,40.76,0,25.92,25.92,0,0,0,0-32.06Z"
              transform="translate(-6 -52.33)"
              fill="#056162"
            />
            <path
              d="M177.24,461.91a25.85,25.85,0,0,0,5.55,16,25.93,25.93,0,1,0,40.76,0C227,473.53,177.24,459,177.24,461.91Z"
              transform="translate(-6 -52.33)"
              opacity="0.03"
            />
            <ellipse
              cx="254.29"
              cy="527.78"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="254.29"
              cy="519.12"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="254.29"
              cy="510.46"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="254.29"
              cy="501.8"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="254.29"
              cy="493.14"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="254.29"
              cy="484.48"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="254.29"
              cy="475.82"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <path
              d="M280.55,468.88a26.3,26.3,0,0,0,2-3l-14.22-2.33,15.38.11a26,26,0,0,0,.49-20.54l-20.64,10.7,19-14a25.93,25.93,0,1,0-42.83,29,25.91,25.91,0,0,0-3,4.73l18.47,9.59-19.69-6.61a25.93,25.93,0,0,0,4.18,24.35,25.93,25.93,0,1,0,40.76,0,25.92,25.92,0,0,0,0-32.06Z"
              transform="translate(-6 -52.33)"
              fill="#056162"
            />
            <path
              d="M234.24,484.91a25.85,25.85,0,0,0,5.55,16,25.93,25.93,0,1,0,40.76,0C284,496.53,234.24,482,234.24,484.91Z"
              transform="translate(-6 -52.33)"
              opacity="0.03"
            />
            <ellipse
              cx="621.29"
              cy="548.78"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="621.29"
              cy="540.12"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="621.29"
              cy="531.46"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="621.29"
              cy="522.8"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="621.29"
              cy="514.14"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="621.29"
              cy="505.48"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="621.29"
              cy="496.82"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <path
              d="M647.55,489.88a26.3,26.3,0,0,0,2-3l-14.22-2.33,15.38.11a26,26,0,0,0,.49-20.54l-20.64,10.7,19-14a25.93,25.93,0,1,0-42.83,29,25.91,25.91,0,0,0-3,4.73l18.47,9.59-19.69-6.61a25.93,25.93,0,0,0,4.18,24.35,25.93,25.93,0,1,0,40.76,0,25.92,25.92,0,0,0,0-32.06Z"
              transform="translate(-6 -52.33)"
              fill="#056162"
            />
            <path
              d="M601.24,505.91a25.85,25.85,0,0,0,5.55,16,25.93,25.93,0,1,0,40.76,0C651,517.53,601.24,503,601.24,505.91Z"
              transform="translate(-6 -52.33)"
              opacity="0.03"
            />
            <ellipse
              cx="678.29"
              cy="583.78"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="678.29"
              cy="575.12"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="678.29"
              cy="566.46"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="678.29"
              cy="557.8"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="678.29"
              cy="549.14"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="678.29"
              cy="540.48"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="678.29"
              cy="531.82"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <path
              d="M704.55,524.88a26.3,26.3,0,0,0,2-3l-14.22-2.33,15.38.11a26,26,0,0,0,.49-20.54l-20.64,10.7,19-14a25.93,25.93,0,1,0-42.83,29,25.91,25.91,0,0,0-3,4.73l18.47,9.59-19.69-6.61a25.93,25.93,0,0,0,4.18,24.35,25.93,25.93,0,1,0,40.76,0,25.92,25.92,0,0,0,0-32.06Z"
              transform="translate(-6 -52.33)"
              fill="#056162"
            />
            <path
              d="M658.24,540.91a25.85,25.85,0,0,0,5.55,16,25.93,25.93,0,1,0,40.76,0C708,552.53,658.24,538,658.24,540.91Z"
              transform="translate(-6 -52.33)"
              opacity="0.03"
            />
            <ellipse
              cx="736.29"
              cy="628.78"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="736.29"
              cy="620.12"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="736.29"
              cy="611.46"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="736.29"
              cy="602.8"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="736.29"
              cy="594.14"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="736.29"
              cy="585.48"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="736.29"
              cy="576.82"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <path
              d="M762.55,569.88a26.3,26.3,0,0,0,2-3l-14.22-2.33,15.38.11a26,26,0,0,0,.49-20.54l-20.64,10.7,19-14a25.93,25.93,0,1,0-42.83,29,25.91,25.91,0,0,0-3,4.73l18.47,9.59-19.69-6.61a25.93,25.93,0,0,0,4.18,24.35,25.93,25.93,0,1,0,40.76,0,25.92,25.92,0,0,0,0-32.06Z"
              transform="translate(-6 -52.33)"
              fill="#056162"
            />
            <path
              d="M716.24,585.91a25.85,25.85,0,0,0,5.55,16,25.93,25.93,0,1,0,40.76,0C766,597.53,716.24,583,716.24,585.91Z"
              transform="translate(-6 -52.33)"
              opacity="0.03"
            />
            <ellipse
              cx="781.29"
              cy="550.78"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="781.29"
              cy="542.12"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="781.29"
              cy="533.46"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="781.29"
              cy="524.8"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="781.29"
              cy="516.14"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="781.29"
              cy="507.48"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="781.29"
              cy="498.82"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <path
              d="M807.55,491.88a26.3,26.3,0,0,0,2-3l-14.22-2.33,15.38.11a26,26,0,0,0,.49-20.54l-20.64,10.7,19-14a25.93,25.93,0,1,0-42.83,29,25.91,25.91,0,0,0-3,4.73l18.47,9.59-19.69-6.61a25.93,25.93,0,0,0,4.18,24.35,25.93,25.93,0,1,0,40.76,0,25.92,25.92,0,0,0,0-32.06Z"
              transform="translate(-6 -52.33)"
              fill="#056162"
            />
            <path
              d="M761.24,507.91a25.85,25.85,0,0,0,5.55,16,25.93,25.93,0,1,0,40.76,0C811,519.53,761.24,505,761.24,507.91Z"
              transform="translate(-6 -52.33)"
              opacity="0.03"
            />
            <ellipse
              cx="1112.29"
              cy="441.78"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="1112.29"
              cy="433.12"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="1112.29"
              cy="424.46"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="1112.29"
              cy="415.8"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="1112.29"
              cy="407.14"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="1112.29"
              cy="398.48"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <ellipse
              cx="1112.29"
              cy="389.82"
              rx="5.41"
              ry="7.09"
              fill="#3f3d56"
            />
            <path
              d="M1144.1,431c0,.39,0,.8,0,1.18s0,.51,0,.76,0,.38,0,.57,0,.31,0,.46-.07.55-.11.83c0,.11,0,.22,0,.34,0,.3-.1.57-.16.86a4.91,4.91,0,0,1-.1.5c-.07.37-.16.72-.26,1.08s-.19.73-.3,1.07a21.41,21.41,0,0,1-.89,2.44c-.16.4-.33.78-.52,1.16s-.34.69-.52,1-.29.54-.44.8-.3.5-.47.75-.12.2-.19.31-.28.43-.42.63-.09.13-.15.2c-.17.26-.36.52-.56.77a26.1,26.1,0,0,1-3.31,3.59c-.26.24-.52.46-.79.68l-.09.07-.71.57-.38.27c-.23.18-.48.35-.72.51a24.37,24.37,0,0,1-3.58,2.05,8.94,8.94,0,0,1-1,.43c-.32.14-.64.27-1,.38s-.41.17-.62.23l-.36.13-1,.28-1,.27a2.57,2.57,0,0,1-.38.08l-.85.18c-.62.13-1.24.24-1.87.31h-.1c-.22,0-.45.06-.67.07a6.83,6.83,0,0,1-.78.06l-.51,0c-.35,0-.71,0-1.07,0s-.7,0-1,0l-.39,0a6.48,6.48,0,0,1-.77-.06,4.62,4.62,0,0,1-.64-.06h0c-.65-.07-1.29-.15-1.92-.28-.34-.06-.67-.14-1-.22a.59.59,0,0,1-.22-.05,26.17,26.17,0,0,1-4.1-1.33,22.52,22.52,0,0,1-2.1-1c-.32-.17-.65-.35-1-.54l-.7-.43c-.46-.28-.91-.59-1.35-.91-.18-.13-.36-.26-.54-.41a3.8,3.8,0,0,1-.38-.29c-.19-.16-.38-.3-.57-.47a.47.47,0,0,1-.15-.13c-.25-.2-.49-.43-.73-.64a25.91,25.91,0,0,1-2.29-2.4c-.24-.28-.47-.57-.69-.85s-.32-.42-.46-.63-.24-.33-.35-.49-.31-.45-.46-.69-.37-.6-.55-.9c-.36-.6-.69-1.22-1-1.85-.14-.29-.27-.57-.39-.87-.23-.5-.44-1-.63-1.57-.14-.36-.26-.73-.37-1.1s-.24-.8-.34-1.21a.08.08,0,0,1,0-.05c-.09-.36-.18-.73-.25-1.08s-.13-.62-.17-.93-.1-.56-.14-.84a1.5,1.5,0,0,1,0-.22c-.06-.33-.09-.68-.12-1s-.07-.78-.08-1.16,0-.79,0-1.19a25.85,25.85,0,0,1,5.55-16c-.44-.56-.86-1.13-1.24-1.72-.13-.19-.25-.37-.36-.56s-.33-.54-.48-.81-.37-.64-.55-1a.41.41,0,0,1-.05-.09,22.28,22.28,0,0,1-.94-2c-.1-.24-.19-.47-.28-.7-.25-.67-.47-1.34-.67-2a23.08,23.08,0,0,1-.55-2.39c-.05-.24-.09-.49-.12-.73a.11.11,0,0,1,0-.06c0-.24-.08-.47-.11-.71-.07-.57-.12-1.16-.15-1.75,0-.17,0-.33,0-.5,0-.32,0-.63,0-.94a26,26,0,0,1,1.37-8.31l19.69,6.61-18.47-9.61a26.17,26.17,0,0,1,3-4.72,26,26,0,0,1-3.48-26.2,279.07,279.07,0,0,1,33.11,32.75q7.85,9.17,14.87,19a25.55,25.55,0,0,1-3.66,6.41l-.08.1A25.79,25.79,0,0,1,1144.1,431Z"
              transform="translate(-6 -52.33)"
              fill="#056162"
            />
            <path
              d="M1092.24,398.91a25.85,25.85,0,0,0,5.55,16,25.93,25.93,0,1,0,40.76,0C1142,410.53,1092.24,396,1092.24,398.91Z"
              transform="translate(-6 -52.33)"
              opacity="0.03"
            />
            <path
              d="M660.22,224.79Q643,230.55,625.4,235.1q15.61-7.31,31.26-14.25C657.86,222.15,659,223.47,660.22,224.79Z"
              transform="translate(-6 -52.33)"
              fill="#056162"
              opacity="0.3"
            />
            <path
              d="M362.92,99.42q8.65-.42,17.41-.41h.53c-7.12,4.69-14.28,9.19-21.49,13.41-1.81,1-3.62,2.1-5.44,3.11q-2.06,1.17-4.12,2.29-16.24,8.85-32.7,17.21-12.5,6.34-25.09,12.38-16.45,7.88-33.1,15.19C232,174.39,204.84,185,177.4,194.11q34.75-21,69.55-41Q271.6,139,296.31,125.31q2.69-1.5,5.37-3,18.06-10,36.18-19.74l2.79-1.51Z"
              transform="translate(-6 -52.33)"
              fill="#056162"
              opacity="0.3"
            />
            <path
              d="M722.62,321.67q4.21,9.46,7.89,19.2c-1.52.73-3,1.44-4.56,2.16-35.17,16.41-70.72,31.21-106.55,44.07q32.73-21.33,65.48-41.92Q703.74,333.31,722.62,321.67Z"
              transform="translate(-6 -52.33)"
              fill="#056162"
              opacity="0.3"
            />
            <path
              d="M734.83,811c-.18-24.58-3.56-48.81-13.35-70.74A118.7,118.7,0,0,0,715.8,729a124.6,124.6,0,0,0-10.29-15.16,133.22,133.22,0,0,0-9.43-10.71A171.54,171.54,0,0,0,669,680.79c-16.25-11-34.28-19.86-52.35-27.32a518,518,0,0,0-69-23q-4.18-1.06-8.39-2.08c-.87-.22-1.74-.42-2.62-.63l-2.83-.65h0c-1.62-.38-3.22-.73-4.84-1.09q-7.24-1.59-14.52-3-12.61-2.4-25.32-4.16c-18.32-2.52-36.76-4.09-55.21-5.44l-8.89-.64h0q-11.88-.84-23.76-1.68c-7.93-.6-15.85-1.23-23.76-2L375.6,609l-3.71-.37c-3.28-.34-6.57-.68-9.85-1.06q-9.51-1.08-19-2.49-10.55-1.57-21.06-3.7l-1.15-.24c-1.86-.38-3.72-.79-5.57-1.2-1.1-.24-2.19-.49-3.28-.75q-10.08-2.37-20-5.36a260.19,260.19,0,0,1-27.17-9.87q-4.43-1.89-8.76-4l-1.18-.59a185.54,185.54,0,0,1-45.1-30.31l-1.13-1-2.4-2.3c-1.41-1.37-2.79-2.78-4.15-4.19s-2.63-2.75-3.93-4.15c-7.55-8.17-14.61-16.83-21.83-25.34-6.25-7.35-12.61-14.58-19.51-21.32-1.27-1.24-2.56-2.44-3.87-3.63A169.64,169.64,0,0,0,133.94,472c-.94-.65-1.89-1.28-2.84-1.9q-5.62-3.72-11.53-7c-3.85-2.14-7.79-4.14-11.79-6q-8-3.72-16.27-6.69a204.16,204.16,0,0,0-28.61-7.93,206.59,206.59,0,0,0-42.69-4.18h0c-4.22.05-8.44.22-12.63.55l-.87.08c.07.21.14.42.19.64a6.45,6.45,0,0,0,.58.31c-.08.91-.15,1.82-.22,2.72A8.61,8.61,0,0,1,7.08,445Q6,459,6,473.34A372.42,372.42,0,0,0,48.54,646.8l.39.74A375.84,375.84,0,0,0,168.57,782,372,372,0,0,0,300.7,839.17l8.27,1.69q17.14,3.32,34.83,5,18,1.74,36.53,1.75a376.28,376.28,0,0,0,51.33-3.5H733.42C734.34,833.15,734.91,822,734.83,811Z"
              transform="translate(-6 -52.33)"
              fill="#3f3d56"
            />
            <path
              d="M580.05,178.47a18.21,18.21,0,0,0-10.55,1.15,15.54,15.54,0,0,1-12.65,0,17.76,17.76,0,0,0-14.89.29,9.3,9.3,0,0,1-4.29,1.07c-6,0-11.06-6.08-12.1-14.1a11.45,11.45,0,0,0,3-3.25c3.53-5.7,9-9.36,15.17-9.36s11.57,3.61,15.11,9.25a11.63,11.63,0,0,0,10,5.51h.15C573.86,169,578,172.85,580.05,178.47Z"
              transform="translate(-6 -52.33)"
              fill="#056162"
              opacity="0.1"
            />
            <path
              d="M600.1,170.28c-1.83,6.29-6.25,10.74-11.4,10.74a9.21,9.21,0,0,1-4.24-1.05,17.76,17.76,0,0,0-14.76-.29,15.68,15.68,0,0,1-6.3,1.34,15.48,15.48,0,0,1-4.84-.79c-.26-.07-.53-.18-.79-.27s-.49-.19-.73-.3a.49.49,0,0,0-.19-.07,7.52,7.52,0,0,0-.78-.32c-.25-.1-.5-.18-.75-.27a17.68,17.68,0,0,0-13.17.94,9.27,9.27,0,0,1-4.28,1.08,8.39,8.39,0,0,1-2.4-.35c-.11,0-.21-.06-.32-.08s-.24-.07-.36-.12c-4.65-1.67-8.23-7.06-9-13.75a23.08,23.08,0,0,1-.18-2.91c0-9.51,5.5-17.21,12.3-17.21h.33a11.35,11.35,0,0,0,10-5.4,18,18,0,0,1,1.29-1.86A374.17,374.17,0,0,1,600.1,170.28Z"
              transform="translate(-6 -52.33)"
              fill="#056162"
              opacity="0.1"
            />
            <path
              d="M77.05,315.82a17.64,17.64,0,0,0-3.49-.32A17.89,17.89,0,0,0,66.5,317c-.22.09-.44.19-.67.27a15.46,15.46,0,0,1-5.62,1.06,15.74,15.74,0,0,1-4.65-.71c-.26-.09-.53-.18-.79-.29s-.62-.23-.92-.37l-.78-.32-.75-.26a17.86,17.86,0,0,0-12,.27q5-10.86,10.68-21.32a21.78,21.78,0,0,1,4.9,5.55,11.66,11.66,0,0,0,10,5.5h.15a8.85,8.85,0,0,1,1.71.17,9.86,9.86,0,0,1,3,1.11s0,0,0,0A15.21,15.21,0,0,1,77.05,315.82Z"
              transform="translate(-6 -52.33)"
              fill="#056162"
              opacity="0.1"
            />
            <path
              d="M98,301.16c0,9.5-5.51,17.2-12.3,17.2a9.21,9.21,0,0,1-4.24-1.05,16.76,16.76,0,0,0-7.85-1.74A18,18,0,0,0,66.7,317c-.31.13-.61.26-.93.37a15.38,15.38,0,0,1-5.37,1,15.65,15.65,0,0,1-4.26-.59l-.58-.18c-.26-.09-.53-.18-.79-.29A7.49,7.49,0,0,1,54,317l-.19-.07c-.26-.12-.51-.21-.78-.32l-.75-.26-.69-.2a17.71,17.71,0,0,0-11.42.65,1.42,1.42,0,0,1,.08-.18q5-10.86,10.68-21.32,5.34-9.87,11.26-19.39c1.2-1.92,2.41-3.82,3.64-5.72a18.8,18.8,0,0,1,7.79,5.71l-3.73,6.78,5.91-3.75a11.69,11.69,0,0,0,5.79,4.39l-1.42,2.59,3.31-2.11a11.31,11.31,0,0,0,2,.16h.16a9.64,9.64,0,0,1,5.9,2.1l-4,7.35-1.88,3.43,8-5.06,1.78-1.13a9,9,0,0,1,.45.88A22.07,22.07,0,0,1,98,301.16Z"
              transform="translate(-6 -52.33)"
              fill="#056162"
              opacity="0.1"
            />
            <ellipse
              cx="988.81"
              cy="549.5"
              rx="35.79"
              ry="46.85"
              fill="#2f2e41"
            />
            <ellipse
              cx="988.81"
              cy="492.23"
              rx="35.79"
              ry="46.85"
              fill="#2f2e41"
            />
            <ellipse
              cx="988.81"
              cy="434.97"
              rx="35.79"
              ry="46.85"
              fill="#2f2e41"
            />
            <ellipse
              cx="988.81"
              cy="377.71"
              rx="35.79"
              ry="46.85"
              fill="#2f2e41"
            />
            <ellipse
              cx="988.81"
              cy="320.44"
              rx="35.79"
              ry="46.85"
              fill="#2f2e41"
            />
            <path
              d="M962.3,295.9A58.94,58.94,0,0,0,959,315.52a56.47,56.47,0,0,0,7.46,28.63c6.54,11.08,16.8,18.22,28.33,18.22s21.78-7.14,28.33-18.22a56.29,56.29,0,0,0,7.45-27.49,273.41,273.41,0,0,0-31.27-11.92q-11.1-3.48-22.58-6Z"
              transform="translate(-6 -52.33)"
              fill="#2f2e41"
            />
            <path
              d="M976.74,298.71q11.47,2.54,22.58,6a28.1,28.1,0,0,1-4.51.37A29.5,29.5,0,0,1,976.74,298.71Z"
              transform="translate(-6 -52.33)"
              fill="#2f2e41"
            />
            <ellipse
              cx="321.81"
              cy="541.5"
              rx="35.79"
              ry="46.85"
              fill="#3f3d56"
            />
            <ellipse
              cx="321.81"
              cy="484.23"
              rx="35.79"
              ry="46.85"
              fill="#3f3d56"
            />
            <ellipse
              cx="321.81"
              cy="426.97"
              rx="35.79"
              ry="46.85"
              fill="#3f3d56"
            />
            <ellipse
              cx="321.81"
              cy="369.71"
              rx="35.79"
              ry="46.85"
              fill="#3f3d56"
            />
            <ellipse
              cx="321.81"
              cy="312.44"
              rx="35.79"
              ry="46.85"
              fill="#3f3d56"
            />
            <ellipse
              cx="321.81"
              cy="255.18"
              rx="35.79"
              ry="46.85"
              fill="#3f3d56"
            />
            <ellipse
              cx="321.81"
              cy="197.92"
              rx="35.79"
              ry="46.85"
              fill="#3f3d56"
            />
            <ellipse
              cx="321.81"
              cy="152.5"
              rx="35.79"
              ry="46.85"
              fill="#3f3d56"
            />
            <path
              d="M312.65,105.12a39.72,39.72,0,0,0-13.17,13.82,48.46,48.46,0,0,0-3.17,6.37,58.37,58.37,0,0,0-4.29,22.1v.16a56.47,56.47,0,0,0,7.46,28.63c6.54,11.08,16.8,18.22,28.33,18.22s21.78-7.14,28.33-18.22a58.67,58.67,0,0,0,0-57.26c-.7-1.18-1.44-2.32-2.21-3.41a35.93,35.93,0,0,0-16.07-12.93,25.66,25.66,0,0,0-2.69-.89h0Z"
              transform="translate(-6 -52.33)"
              fill="#3f3d56"
            />
            <path
              d="M335.16,101.71h0q2.73-.33,5.48-.62l22.27-1.67a56.16,56.16,0,0,1-3.55,13,50.7,50.7,0,0,1-3.23,6.52c-6.55,11.08-16.8,18.22-28.33,18.22a28,28,0,0,1-10.7-2.13,36.23,36.23,0,0,1-15.43-12.69c-.77-1.09-1.51-2.22-2.2-3.4a51,51,0,0,1-4.56-10.13q8.79-2.07,17.73-3.69Z"
              transform="translate(-6 -52.33)"
              fill="#3f3d56"
            />
            <ellipse
              cx="91.81"
              cy="400.5"
              rx="35.79"
              ry="46.85"
              fill="#3f3d56"
            />
            <ellipse
              cx="91.81"
              cy="343.23"
              rx="35.79"
              ry="46.85"
              fill="#3f3d56"
            />
            <ellipse
              cx="91.81"
              cy="285.97"
              rx="35.79"
              ry="46.85"
              fill="#3f3d56"
            />
            <path
              d="M133.6,281a56.5,56.5,0,0,1-7.46,28.63c-6.55,11.08-16.8,18.23-28.33,18.23-9.33,0-17.82-4.68-24.2-12.33l0-.07a43.53,43.53,0,0,1-4.08-5.83c-.61-1-1.18-2.07-1.72-3.15A57.65,57.65,0,0,1,62,281q0-2.6.21-5.13c1.2-1.92,2.41-3.82,3.64-5.72,2.55-4,5.19-7.85,7.9-11.71q8.53-12.18,18-23.63a27.27,27.27,0,0,1,6-.67c11.53,0,21.78,7.14,28.33,18.23A56.53,56.53,0,0,1,133.6,281Z"
              transform="translate(-6 -52.33)"
              fill="#3f3d56"
            />
            <path
              d="M133.6,223.78a56.58,56.58,0,0,1-7.46,28.63c-6.55,11.08-16.81,18.21-28.33,18.21-9.26,0-17.69-4.59-24-12.14q8.53-12.18,18-23.63a371.69,371.69,0,0,1,35.6-37.45A57.3,57.3,0,0,1,133.6,223.78Z"
              transform="translate(-6 -52.33)"
              fill="#3f3d56"
            />
            <path
              d="M309,840.87q17.14,3.32,34.83,5,18,1.76,36.53,1.76a376.28,376.28,0,0,0,51.33-3.51H872.05c1.19.19,2.38.38,3.58.55a278.16,278.16,0,0,0,297.89-170c-7.81-5.07-15.67-10-23.62-14.83s-16.08-9.4-24.4-13.75c-1.25-.67-2.51-1.32-3.78-2a331.31,331.31,0,0,0-47.65-20.11c-7.1-2.33-14.26-4.35-21.46-6q-5.11-1.19-10.25-2.12-6.46-1.19-13-1.94a176,176,0,0,0-34.42-.74h0q-3.16.24-6.34.63-6.11.71-12.19,1.92-7.5,1.5-14.76,3.68c-41.7,12.39-77.82,40.08-115.22,63.18l-1.43.89a569.75,569.75,0,0,1-123.52,56.65q-12.11,3.9-24.38,7.26-14,3.84-28.1,7c-1.79.4-3.59.79-5.38,1.16q-10.79,2.31-21.66,4.18a578.73,578.73,0,0,1-133.84,7.52q-10-.6-20.05-1.57-13.31-1.28-26.54-3.21h0l-1.82-.26c-7.63-1.13-15.26-2.42-22.88-3.71-9.14-1.54-18.28-3.06-27.43-4.3-3.1-.43-6.19-.81-9.29-1.16a241.73,241.73,0,0,0-29.35-1.62c-1.55,0-3.1.06-4.66.13-16.73.65-33.7,3.9-48.84,10.61l-.86.38a91.7,91.7,0,0,0-22.13,13.91q-2.86,2.44-5.52,5.18c-12.92,13.33-20.65,29.68-27,46.78a368.22,368.22,0,0,0,39,10.7Z"
              transform="translate(-6 -52.33)"
              fill="#2f2e41"
            />
            <circle cx="389" cy="249.62" r="2" fill="#fff" opacity="0.6" />
            <circle cx="186" cy="251.62" r="2" fill="#fff" opacity="0.6" />
            <circle cx="615" cy="355.62" r="2" fill="#fff" opacity="0.6" />
            <circle cx="767" cy="285.62" r="2" fill="#fff" opacity="0.6" />
            <path
              d="M309,840.87a108.41,108.41,0,0,0,3.59-27.79c0-2.42-.09-4.82-.24-7.2A108.89,108.89,0,0,0,317,774.22a111.26,111.26,0,0,0-.61-11.61c0-.21-.05-.43-.07-.64a107.37,107.37,0,0,0-11-36.77L260,739.32l-17.55,5.46L255.68,737l42-24.68a108.75,108.75,0,0,0-81.74-46.59,109.39,109.39,0,0,0-8.48-11.23l-34.89,10.85L117,682.61l47.68-28L191.1,639a108.77,108.77,0,0,0-141.54,7.93h0l-.62.61a375.93,375.93,0,0,0,119.64,134.5A372,372,0,0,0,300.7,839.18Z"
              transform="translate(-6 -52.33)"
              fill="#2f2e41"
            />
            <path
              d="M516.19,844.16H432.38c9.8-16.13,24.93-26.48,41.91-26.48S506.4,828,516.19,844.16Z"
              transform="translate(-6 -52.33)"
              fill="#3f3d56"
            />
            <path
              d="M516.19,844.16H432.38c9.8-16.13,24.93-26.48,41.91-26.48S506.4,828,516.19,844.16Z"
              transform="translate(-6 -52.33)"
              opacity="0.1"
            />
            <path
              d="M309,840.87q17.14,3.32,34.83,5,18,1.76,36.53,1.76a376.28,376.28,0,0,0,51.33-3.51H626.38a108.94,108.94,0,0,0,11.18-48.08c0-2.42-.09-4.82-.24-7.2A108.61,108.61,0,0,0,642,759.8c0-.86,0-1.72,0-2.58a108.32,108.32,0,0,0-11.65-49l-63,19.58,55.26-32.49a108.75,108.75,0,0,0-81.74-46.59q-2-3.09-4.27-6c-.41-.54-.83-1.08-1.25-1.61q-1.44-1.83-3-3.59l-2.54.79L442,665.61,514.38,623l1.72-1a108.82,108.82,0,0,0-83.51-21c-1.66.25-3.31.56-4.95.91a108.3,108.3,0,0,0-40.7,17.8A109,109,0,0,0,344.89,680l23,26.45,8.34,9.61,18.64,21.46,14.54,16.73,12.95,14.91L400.1,753.11l-31.25-22.57-30.64-22.13A109.13,109.13,0,0,0,310.47,737a108.06,108.06,0,0,0-16.21,39.53,109.41,109.41,0,0,0,6.44,62.66Z"
              transform="translate(-6 -52.33)"
              fill="#2f2e41"
            />
            <path
              d="M682.08,807.48c6.45-10.71.35-24.48-6.93-34.63s-16.22-20.79-15.44-33.25c1.13-17.92,20.66-27.62,36.31-36.41a168.85,168.85,0,0,0,32.17-23.48c3.91-3.64,7.71-7.55,10.12-12.31,3.47-6.86,3.76-14.84,3.92-22.54Q743,606.44,742,568Z"
              transform="translate(-6 -52.33)"
              fill="#2f2e41"
            />
            <path
              d="M1097.84,524.13q5.65,12.78,11.09,25.65,9.51,22.54,18.35,45.35c2.78,7.17,5.55,14.66,5,22.33-.42,5.33-2.44,10.39-4.68,15.24l-.21.46q-2.61,5.61-5.62,11a167.39,167.39,0,0,1-11.13,17.38q-1.87,2.58-3.85,5.08c-5.14,6.51-11,13.52-15.19,20.85-3.38,5.86-5.72,11.93-5.84,18.12a24.69,24.69,0,0,0,1.31,8.52c4,11.83,16.34,18.25,26.94,24.87a57.09,57.09,0,0,1,13.46,11.29"
              transform="translate(-6 -52.33)"
              fill="none"
              stroke="#2f2e41"
              strokeMiterlimit="10"
              strokeWidth="4"
            />
            <circle cx="1092.72" cy="471.38" r="28" fill="#2f2e41" />
            <circle cx="1142.21" cy="518.05" r="28" fill="#2f2e41" />
            <circle cx="1093.46" cy="583.54" r="28" fill="#2f2e41" />
            <circle cx="1107.7" cy="652.29" r="28" fill="#2f2e41" />
            <path
              d="M866.55,712.39c1.88-12.35-9-22.76-19.59-29.38S824,670,820,658.13c-5.77-17,8.59-33.39,19.72-47.48a168.43,168.43,0,0,0,20.81-34c2.24-4.85,4.26-9.91,4.68-15.23.6-7.67-2.17-15.16-5-22.33q-13.87-35.85-29.44-71"
              transform="translate(-6 -52.33)"
              fill="none"
              stroke="#2f2e41"
              strokeMiterlimit="10"
              strokeWidth="4"
            />
            <circle cx="825.72" cy="415.38" r="28" fill="#2f2e41" />
            <circle cx="875.21" cy="462.05" r="28" fill="#2f2e41" />
            <circle cx="826.46" cy="527.54" r="28" fill="#2f2e41" />
            <circle cx="840.7" cy="596.29" r="28" fill="#2f2e41" />
            <path
              d="M376.86,618.17c2.92-4.39.62-10.31-2.25-14.73s-6.44-9.06-5.87-14.3c.81-7.53,9.23-11.24,16-14.65a71,71,0,0,0,14-9.27,19.29,19.29,0,0,0,4.51-5c1.59-2.83,1.86-6.19,2.08-9.42q1.08-16.18,1.38-32.39"
              transform="translate(-6 -52.33)"
              fill="none"
              stroke="#3f3d56"
              strokeMiterlimit="10"
              strokeWidth="4"
            />
            <circle cx="401.12" cy="466.08" r="11.81" fill="#3f3d56" />
            <circle cx="411.73" cy="492.74" r="11.81" fill="#3f3d56" />
            <circle cx="381.43" cy="509.1" r="11.81" fill="#3f3d56" />
            <circle cx="374.63" cy="537.92" r="11.81" fill="#3f3d56" />
            <path
              d="M924,420.72c-1.53-8.49-.77-17.64-4.66-25.31a5.61,5.61,0,0,0-1.77-2.27,6.12,6.12,0,0,0-3.17-.72q-5.26-.23-10.55-.1c-1,0-2.14.15-2.65,1a2,2,0,0,0-.14.3c-4-4.5-7.08-10.1-11.42-14.26.62-.2,1.24-.4,1.87-.57-.06-.42-.14-.84-.23-1.25l-.1-.37c-.07-.29-.15-.57-.23-.85s-.1-.27-.14-.41-.17-.53-.27-.79l-.17-.41c-.1-.26-.2-.52-.32-.77s-.11-.25-.17-.38l-.38-.8c0-.11-.11-.21-.16-.32-.15-.29-.29-.57-.44-.84l-.15-.27-.51-.9-.1-.17c-.2-.34-.4-.68-.61-1h0c-1.7-2.78-3.58-5.5-4.95-8.33-2.43-5-3.23-10.64-4.84-16s-4.41-10.74-9.3-13.27c-2.32-1.2-5.45-2.25-5.66-4.89a5.64,5.64,0,0,1,.51-2.45,31.57,31.57,0,0,1,2.43-4.91c.34-.58.72-1.15,1.1-1.7.09-.14.19-.27.29-.41.3-.42.61-.82.92-1.22l.39-.49c.32-.38.64-.75,1-1.11l.39-.44c.46-.49.93-1,1.42-1.43a3.33,3.33,0,0,0,1-1.32,4,4,0,0,0,.08-1.57c-.24-4.25,2-8.22,4.49-11.64s5.38-6.67,6.79-10.67c.16-.46.3-.93.42-1.39,0-.16.07-.31.1-.47s.14-.63.2-.94.05-.37.08-.55.08-.59.11-.88,0-.39,0-.58,0-.58,0-.87,0-.38,0-.58,0-.58,0-.88,0-.37,0-.56,0-.63-.08-.94,0-.34-.05-.51q-.06-.54-.15-1.08c0-.12,0-.24,0-.36-.08-.5-.17-1-.27-1.48h0a75.63,75.63,0,0,0-2.73-9.29,33.12,33.12,0,0,0-2.26-5.42c.55-.1,1.1-.23,1.66-.38-.35-.64-.9-1.39-1.21-2.11,3.29-5.16,6.16-10.56,7.6-16.49a73.68,73.68,0,0,0,1.56-12.75c.83-12.87,1.65-25.81.59-38.66,0-.17,0-.34,0-.51a31.81,31.81,0,0,0,.08-8.33c-.53-5.38-1.79-10.81-4.67-15.36s-7.65-8.56-12.94-9.1a19.19,19.19,0,0,1-2.89,2.67,11.34,11.34,0,0,1-3.36-5.24,28.56,28.56,0,0,0,23.95-25c.06-.47.1-.94.13-1.41,0-.2,0-.39,0-.58s0-.54,0-.81v-.75c0-.2,0-.4,0-.61s0-.57,0-.86l0-.47c0-.32,0-.64-.08-1,0-.11,0-.22,0-.34,0-.35-.08-.69-.14-1l0-.22c-.06-.38-.13-.75-.2-1.12a.5.5,0,0,1,0-.12c-.08-.4-.17-.79-.27-1.19h0a29,29,0,0,0-3.14-7.7,29,29,0,0,0,2.26-8.27c.06-.52.11-1,.14-1.54,0-.33,0-.66,0-1,0-.17,0-.33,0-.49,0-.43,0-.85,0-1.28v-.13a29,29,0,0,0-8-19.12,17.78,17.78,0,0,0,1.42-3.06h0c.11-.31.21-.62.31-.94h0c.09-.3.17-.6.24-.91,0,0,0,0,0-.08.07-.28.12-.56.18-.85l0-.15c.06-.33.11-.66.15-1s.07-.7.09-1c0-.11,0-.22,0-.33s0-.48,0-.72v-.36l0-.72c0-.11,0-.21,0-.32a17.59,17.59,0,0,0-35.06-.8,18.15,18.15,0,0,0,.16,5.42A28.69,28.69,0,0,0,831.52,96a29.09,29.09,0,0,0-.17,4.83,29,29,0,0,0-4.5,13.36h0l0,.54c0,.6-.07,1.2-.07,1.81a28.88,28.88,0,0,0,11.12,22.85,20.22,20.22,0,0,0,5.62,5.92,23.1,23.1,0,0,1,.9,3.72c.17,3.4-.84,7-3.41,9.23-.65.54-1.37,1-2,1.51a3.65,3.65,0,0,0-2.07.05c-7.67,2.41-15,7.18-18.55,14.5a27.65,27.65,0,0,0-1.84,5.17c-.14.21-.29.42-.42.64A74.6,74.6,0,0,0,806.16,204c-1,4.33-1.57,8.83-3.59,12.77a12.55,12.55,0,0,0-1.17,2.59,26.51,26.51,0,0,0-.18,4.19c-.21,2.53-1.68,4.77-2.17,7.26-.3,1.48-.24,3-.5,4.5-.46,2.61-1.87,4.93-2.77,7.41-1.59,4.37-1.57,9.17-2.74,13.68a4.71,4.71,0,0,1-.92,2c-.8.89-2.06,1.1-3.1,1.67a6.83,6.83,0,0,0-3.11,4.66,20.78,20.78,0,0,0-.1,5.79l.58,7.55c-2.82.84-5.63,1.7-8.44,2.56l-13.87,4.24c-4,1.22-8.06,2.48-11.51,4.86a21,21,0,0,0-7.25,8.8c-1.58,3.61-2.13,7.58-2.69,11.5-1.59,11-3.52,22-7.13,32.41-.28.81-.58,1.62-.88,2.43h0c-.3.8-.62,1.59-.94,2.38l-.21.48c-.26.64-.52,1.27-.8,1.89-.36.8-.72,1.6-1.11,2.38L764,362.87c0,.39.08.8.14,1.27,1.12,8,.58,16.06,1.62,24a15.61,15.61,0,0,0,.9,3.89,5.52,5.52,0,0,0-1.7,2.71,14.46,14.46,0,0,0-.17,5.17q.56,6.1,1.1,12.23a18.74,18.74,0,0,1,.05,4.49c-.41,2.69-1.94,5.05-2.8,7.63s-.8,5.87,1.33,7.51a5.28,5.28,0,0,0,5.11.46,11.89,11.89,0,0,0,4.23-3.27c6.54-7.24,9.46-17.05,14.55-25.42a49.15,49.15,0,0,0,3.47-6.06c.7-1.62,1.14-3.34,1.71-5a48.79,48.79,0,0,1,2.8-6.53c.6-1.2,2.92-4.1,2.43-5.45-.83-2.29-9.74-4.33-11.94-5-1.42-.46-3-.87-4.36-.2a2.87,2.87,0,0,0-.59.39c-.25-3.28-.51-6.56-.76-9.83,1.32-.12,2.63-.29,3.93-.5-.05-1.85-.09-3.71-.13-5.58l-.12-5.13c-.09-4.15-.18-8.31-.29-12.41a66.59,66.59,0,0,0-.46-7.2c-.51-3.66-1.62-7.22-2-10.89a4.12,4.12,0,0,1,1.84-.84h0a12.67,12.67,0,0,1,3.15-.11l.83,0c4.58.14,9.06-1.48,13.14-3.62s7.87-4.8,11.93-7c.5-.27,1-.53,1.53-.79l.56-.28.95-.47.79-.38.18-.09c2.37-1.13,4.76-2.23,7-3.46a7.11,7.11,0,0,0,.5.72,4.7,4.7,0,0,0,5,1.8c-2.8,6.77-6.1,13.32-6.94,20.64-1.22,10.56,3,20.9,7.15,30.66l13.23,31.19c1.46,3.45,3.41,7.32,7,8.14,2.24.51,4.56-.34,6.64-1.33,6-2.88,11.5-7,17-10.88a1.84,1.84,0,0,1,.22.17c5,3.95,8.15,9.48,11.61,14.75l9.28,15.23a4.43,4.43,0,0,0,.37,2.24,13,13,0,0,0,2.6,3.37,43.91,43.91,0,0,1,11.15,22.82c.34,2.16.57,4.46,1.84,6.23,2.49,3.45,7.78,3.23,11.52,1.26a7.51,7.51,0,0,0,2.88-2.38,9.53,9.53,0,0,0,1.17-3.61,50.6,50.6,0,0,0,1.11-9.57C927.31,432.51,925.06,426.7,924,420.72ZM870.8,140.5c.64-.43,1.26-.9,1.87-1.39a28.73,28.73,0,0,1-6,10.2h0c-.63.69-1.3,1.34-2,2,0-.16,0-.32,0-.47-.08-1.53,0-3.14.05-4.72A20.22,20.22,0,0,0,870.8,140.5ZM818.28,257.85c0-.09.07-.19.11-.29a6.17,6.17,0,0,1,1.35,1.4,5.57,5.57,0,0,0,.2,5c.78,1.32,2.18,2.54,1.87,4s-2.2,2.09-3.75,2.34c-2,.32-4,.7-6,1.11,0,0,0-.07,0-.11a15.46,15.46,0,0,0-.68-4.95C814.8,264.94,816.94,261.4,818.28,257.85Z"
              transform="translate(-6 -52.33)"
              fill="url(#a09f8209-a7b7-4999-9a81-8afbf160c3ae)"
            />
            <path
              d="M880.18,84.71a17.65,17.65,0,1,0-32.7-11.14,17.94,17.94,0,0,0,.16,5.34,28.36,28.36,0,0,0-15.95,22.2,29.31,29.31,0,0,0-.17,4.76,28.37,28.37,0,1,0,52.15,15.48q0-.67,0-1.35a28.38,28.38,0,0,0-3.46-35.29Z"
              transform="translate(-6 -52.33)"
              fill="#2f2e41"
            />
            <g opacity="0.1">
              <path
                d="M847.41,74.43l.23-.12c0-.31-.09-.62-.13-.93l0,.19C847.44,73.86,847.43,74.14,847.41,74.43Z"
                transform="translate(-6 -52.33)"
              />
              <path
                d="M888,103.31a28.24,28.24,0,0,1-4.39,12.09q0,.67,0,1.35A28.37,28.37,0,0,1,827,119c-.06.76-.1,1.53-.1,2.31a28.38,28.38,0,1,0,56.75,0q0-.67,0-1.35A28.24,28.24,0,0,0,888,107.92a27.53,27.53,0,0,0,.1-5.73C888.1,102.56,888.08,102.94,888,103.31Z"
                transform="translate(-6 -52.33)"
              />
              <path
                d="M882.51,73.36a17.71,17.71,0,0,1-2.33,6.75c.49.51,1,1,1.42,1.59a17.68,17.68,0,0,0,.93-3.89A17.9,17.9,0,0,0,882.51,73.36Z"
                transform="translate(-6 -52.33)"
              />
            </g>
            <path
              d="M765.84,389.13a12.85,12.85,0,0,0,1.29,4.65,5.11,5.11,0,0,0,3.76,2.75,7.65,7.65,0,0,0,4.15-1.2c2.52-1.32,5.15-2.85,6.46-5.38s1.1-5.37.88-8.12l-1.69-21.63c-4.09-.12-8.2-.11-12.28.11s-4.75,1.17-4.19,5.12C765.34,373.29,764.79,381.27,765.84,389.13Z"
              transform="translate(-6 -52.33)"
              fill="#fbbebe"
            />
            <path
              d="M885.73,403.76l9.72,15.71a3.92,3.92,0,0,0,2.12,2,3.37,3.37,0,0,0,2-.36c3.24-1.41,5.72-4.11,8.11-6.72,1.61-1.78,3.28-3.65,3.89-6a7.62,7.62,0,0,0-1.94-7.16,24.65,24.65,0,0,0-3.67-2.62c-7.69-5.18-11.16-15-18.74-20.36a3,3,0,0,0-1.54-.66,3.17,3.17,0,0,0-1.58.53l-10.37,5.69c-4.49,2.45-3.07,2.74.34,5.39C879.13,393.11,882.26,398.56,885.73,403.76Z"
              transform="translate(-6 -52.33)"
              fill="#fbbebe"
            />
            <path
              d="M786.94,376.62c-1.42-.45-3-.85-4.36-.2a4.8,4.8,0,0,0-2.27,3.59c-.27,1.44-.24,2.94-.64,4.35-.68,2.39-2.49,4.25-4.24,6a6.27,6.27,0,0,1-2.67,1.85c-1.4.36-2.89-.29-4.32,0a4.67,4.67,0,0,0-3.4,3.47,13.59,13.59,0,0,0-.17,5.09l1.1,12.06a18.25,18.25,0,0,1,0,4.43c-.41,2.65-1.95,5-2.8,7.52s-.81,5.79,1.33,7.41a5.37,5.37,0,0,0,5.12.45,12,12,0,0,0,4.24-3.22c6.55-7.14,9.47-16.82,14.56-25.06a49,49,0,0,0,3.49-6c.69-1.61,1.14-3.3,1.7-5a49.66,49.66,0,0,1,2.81-6.43c.61-1.19,2.92-4,2.44-5.38C798.08,379.32,789.15,377.32,786.94,376.62Z"
              transform="translate(-6 -52.33)"
              fill="#2f2e41"
            />
            <path
              d="M905,409.88a12.46,12.46,0,0,1-6.88,5.91A6.26,6.26,0,0,0,895.8,417a3.64,3.64,0,0,0-.41,4A12.86,12.86,0,0,0,898,424.3a43,43,0,0,1,11.17,22.5c.34,2.13.57,4.39,1.85,6.14,2.49,3.4,7.79,3.18,11.53,1.24a7.46,7.46,0,0,0,2.89-2.34,9.35,9.35,0,0,0,1.17-3.56,49.35,49.35,0,0,0,1.11-9.44c-.07-6-2.32-11.73-3.4-17.63-1.53-8.37-.76-17.39-4.66-24.95a5.54,5.54,0,0,0-1.78-2.24,6.21,6.21,0,0,0-3.17-.71c-3.52-.15-7.05-.18-10.57-.09-1,0-2.15.14-2.66,1s-.06,2,.4,2.87C904.06,401.35,907.6,404.76,905,409.88Z"
              transform="translate(-6 -52.33)"
              fill="#2f2e41"
            />
            <path
              d="M821.37,259.84a5.42,5.42,0,0,0-1.27,6.86c.78,1.3,2.18,2.5,1.87,4s-2.21,2.06-3.76,2.31c-13.65,2.17-26.94,6.17-40.18,10.15l-13.89,4.18c-4,1.21-8.08,2.45-11.54,4.8a20.75,20.75,0,0,0-7.26,8.67c-1.58,3.56-2.13,7.48-2.7,11.33-2.08,14.2-4.74,28.53-11.08,41.4l33.69,11a48.45,48.45,0,0,0,10.09,2.54,37.7,37.7,0,0,0,9.83-.47c-.21-7.52-.34-15.27-.55-22.79a62.4,62.4,0,0,0-.46-7.11c-.5-3.6-1.62-7.11-2-10.73,1.55-1.28,3.81-1,5.82-.91,4.6.14,9.09-1.46,13.17-3.57s7.89-4.73,12-6.87c6.77-3.58,14.47-6,19.64-11.65-2.63,10-8.85,18.78-10,29.08s3,20.6,7.16,30.23l13.26,30.75c1.46,3.4,3.41,7.21,7,8,2.25.51,4.57-.34,6.66-1.31,12.19-5.72,22-16.45,35-19.89-1-6.45-6.06-11.78-8.95-17.63-2.43-4.93-3.23-10.48-4.85-15.74s-4.41-10.58-9.31-13.08c-2.32-1.18-5.46-2.21-5.68-4.82a5.56,5.56,0,0,1,.52-2.42,31.72,31.72,0,0,1,7.93-11.54,3.53,3.53,0,0,0,1-1.3,3.84,3.84,0,0,0,.08-1.55c-.25-4.19,2-8.11,4.5-11.47s5.39-6.57,6.8-10.52c2.42-6.8,0-14.26-2.38-21.06-1-2.75-2-5.59-4-7.72-3.12-3.34-8-4.3-12.53-4.8C850.28,254.62,833,250.77,821.37,259.84Z"
              transform="translate(-6 -52.33)"
              fill="#2f2e41"
            />
            <g opacity="0.1">
              <path
                d="M877.06,289.59c-2.51,3.37-4.75,7.28-4.5,11.47a3.84,3.84,0,0,1-.08,1.55,3.56,3.56,0,0,1-1,1.31,31.64,31.64,0,0,0-7.93,11.54,5.53,5.53,0,0,0-.52,2.42c.14,1.63,1.43,2.65,3,3.47a31.6,31.6,0,0,1,5.5-6.7,3.53,3.53,0,0,0,1-1.3,3.84,3.84,0,0,0,.08-1.55c-.25-4.19,2-8.11,4.5-11.47s5.39-6.57,6.8-10.52a21.94,21.94,0,0,0,.36-11.9c-.11.39-.23.78-.36,1.16C882.45,283,879.56,286.22,877.06,289.59Z"
                transform="translate(-6 -52.33)"
              />
              <path
                d="M819.84,261.87A2.83,2.83,0,0,0,822,260a1.9,1.9,0,0,0,0-.58c-.21.16-.42.3-.63.47A5,5,0,0,0,819.84,261.87Z"
                transform="translate(-6 -52.33)"
              />
              <path
                d="M775.34,356.37a49.73,49.73,0,0,1-10.09-2.54l-29.74-9.75a88.36,88.36,0,0,1-4,9.44l33.69,11a48.45,48.45,0,0,0,10.09,2.54,37.7,37.7,0,0,0,9.83-.47c-.1-3.53-.18-7.12-.26-10.7A37,37,0,0,1,775.34,356.37Z"
                transform="translate(-6 -52.33)"
              />
              <path
                d="M856.81,389c-2.09,1-4.41,1.82-6.66,1.32-3.6-.81-5.55-4.63-7-8l-13.26-30.75c-2.91-6.76-5.86-13.8-6.94-21-.08.51-.16,1-.22,1.52-1.22,10.41,3,20.6,7.16,30.23l13.26,30.75c1.46,3.4,3.41,7.21,7,8,2.25.51,4.57-.34,6.66-1.31,12.19-5.72,22-16.45,35-19.89-.5-3.36-2.14-6.42-4-9.41C876.69,374.79,867.72,383.92,856.81,389Z"
                transform="translate(-6 -52.33)"
              />
              <path
                d="M832.77,292.27c-5.17,5.65-12.87,8.06-19.64,11.64-4.06,2.15-7.86,4.77-12,6.88s-8.57,3.7-13.17,3.57c-2-.06-4.27-.38-5.82.9.32,3.35,1.29,6.59,1.84,9.91a17.61,17.61,0,0,1,4-.08c4.6.14,9.09-1.46,13.17-3.57s7.89-4.73,12-6.87c4.46-2.36,9.32-4.22,13.6-6.82C828.89,302.72,831.35,297.68,832.77,292.27Z"
                transform="translate(-6 -52.33)"
              />
            </g>
            <path
              d="M844.59,153.39c.17,3.35-.84,6.94-3.42,9.09-.83.69-1.79,1.22-2.59,1.94a7,7,0,0,0,1,10.61c2.67,1.64,6.08,1.2,9.17.66a53.89,53.89,0,0,0,12-3.14,20,20,0,0,0,9.5-7.78c-3.37-1.87-5.2-5.82-5.41-9.66s.85-8.23-1.59-11.22S856.55,141,853,142c-1.8.5-3.54,1.18-5.34,1.67-.91.24-3.93.25-4.52.92C842,145.83,844.48,151.44,844.59,153.39Z"
              transform="translate(-6 -52.33)"
              fill="#fbbebe"
            />
            <path
              d="M844.59,153.39c.17,3.35-.84,6.94-3.42,9.09-.83.69-1.79,1.22-2.59,1.94a7,7,0,0,0,1,10.61c2.67,1.64,6.08,1.2,9.17.66a53.89,53.89,0,0,0,12-3.14,20,20,0,0,0,9.5-7.78c-3.37-1.87-5.2-5.82-5.41-9.66s.85-8.23-1.59-11.22S856.55,141,853,142c-1.8.5-3.54,1.18-5.34,1.67-.91.24-3.93.25-4.52.92C842,145.83,844.48,151.44,844.59,153.39Z"
              transform="translate(-6 -52.33)"
              opacity="0.1"
            />
            <circle cx="848.91" cy="80.9" r="19.94" fill="#fbbebe" />
            <path
              d="M792,286.21a13.5,13.5,0,0,1-1.88,4.43,20.83,20.83,0,0,0-2.38,13.61,14.39,14.39,0,0,0,8.39,10.59c1.86.74,4.17.93,5.71-.36-2.66-3.46-2.8-8.19-2.64-12.56a4.14,4.14,0,0,1,.56-2.33,1.46,1.46,0,0,1,2.1-.38,19,19,0,0,0,1.56,8c.42,1,1.14,2,2.2,2,1.52,0,1.93-2.1,1.87-3.62-.23-6.18-.54-12.62-3.52-18.05-1.09-2-2.54-3.84-3-6.07a3.6,3.6,0,0,0-.76-2.13,2.68,2.68,0,0,0-1.12-.52c-1.72-.49-5.78-2-7.2-.39S792.23,284.15,792,286.21Z"
              transform="translate(-6 -52.33)"
              fill="#fbbebe"
            />
            <path
              d="M821.56,180.27c-2.28-.25-4.09,1.84-5.34,3.77a72.87,72.87,0,0,0-9.93,23.53c-1,4.27-1.57,8.7-3.6,12.58a13.12,13.12,0,0,0-1.17,2.56,25.75,25.75,0,0,0-.18,4.13c-.21,2.49-1.68,4.7-2.18,7.16-.29,1.46-.23,3-.49,4.44-.46,2.57-1.87,4.85-2.78,7.3-1.59,4.31-1.57,9-2.74,13.49a4.66,4.66,0,0,1-.93,2c-.79.87-2.06,1.09-3.1,1.64a6.73,6.73,0,0,0-3.11,4.6,20.21,20.21,0,0,0-.11,5.71l.92,11.79c.94-.39,1.56-1.46,2.35-2.12,1.44-1.2,3.56-.93,5.4-.59l2.69.48c2.75.5,5.74,1.14,7.5,3.3,1.4-2.19.6-5.42,2.75-6.88.71-.47,1.57-.63,2.31-1a5.18,5.18,0,0,0,2.35-4.14,15.14,15.14,0,0,0-.68-4.89c3.45-1.45,5.6-4.95,7-8.44a70.68,70.68,0,0,0,3.21-13c3.11-17.53,6-35.18,6.25-53a25.43,25.43,0,0,0-1-8.83C825.94,183,824.52,180.61,821.56,180.27Z"
              transform="translate(-6 -52.33)"
              fill="#ff6f61"
            />
            <path
              d="M821.56,180.27c-2.28-.25-4.09,1.84-5.34,3.77a72.87,72.87,0,0,0-9.93,23.53c-1,4.27-1.57,8.7-3.6,12.58a13.12,13.12,0,0,0-1.17,2.56,25.75,25.75,0,0,0-.18,4.13c-.21,2.49-1.68,4.7-2.18,7.16-.29,1.46-.23,3-.49,4.44-.46,2.57-1.87,4.85-2.78,7.3-1.59,4.31-1.57,9-2.74,13.49a4.66,4.66,0,0,1-.93,2c-.79.87-2.06,1.09-3.1,1.64a6.73,6.73,0,0,0-3.11,4.6,20.21,20.21,0,0,0-.11,5.71l.92,11.79c.94-.39,1.56-1.46,2.35-2.12,1.44-1.2,3.56-.93,5.4-.59l2.69.48c2.75.5,5.74,1.14,7.5,3.3,1.4-2.19.6-5.42,2.75-6.88.71-.47,1.57-.63,2.31-1a5.18,5.18,0,0,0,2.35-4.14,15.14,15.14,0,0,0-.68-4.89c3.45-1.45,5.6-4.95,7-8.44a70.68,70.68,0,0,0,3.21-13c3.11-17.53,6-35.18,6.25-53a25.43,25.43,0,0,0-1-8.83C825.94,183,824.52,180.61,821.56,180.27Z"
              transform="translate(-6 -52.33)"
              opacity="0.1"
            />
            <path
              d="M871.83,161.19a25.08,25.08,0,0,1-12.13,7,74.45,74.45,0,0,1-14,2.07,8.71,8.71,0,0,1-4.34-.38c-1.34-.6-2.36-2.19-1.81-3.55A3.93,3.93,0,0,0,840,165c0-1.21-1.81-1.31-3-.95-7.68,2.37-15,7.07-18.58,14.28-2,4.08-2.66,8.66-3.3,13.15-1.66,11.82-3.33,23.9-1.09,35.62,1.19,6.25,3.49,12.35,3.63,18.71.08,3.57-.52,7.12-.49,10.69a5.36,5.36,0,0,0,.94,3.52c.55.64,1.39,1.05,1.77,1.8.64,1.26-.22,3,.63,4.13,1,1.39,3.23.39,4.66-.59a37.11,37.11,0,0,1,24.68-6.22c10.45,1.13,20.83,6.69,31,3.91a14,14,0,0,1-1.35-2.41c-5-16.61-4.71-35.17,2.85-50.79,2.59-5.34,6-10.43,7-16.27a30.87,30.87,0,0,0,.1-8.26c-.53-5.31-1.8-10.66-4.68-15.15S877.14,161.71,871.83,161.19Z"
              transform="translate(-6 -52.33)"
              fill="#ff6f61"
            />
            <path
              d="M823.59,291.34a18.37,18.37,0,0,0-1.15,6.79,39.71,39.71,0,0,0,.33,6.63,10.53,10.53,0,0,0,1.94,5.2,4.75,4.75,0,0,0,5,1.77,5.21,5.21,0,0,0,3-3.34,30.23,30.23,0,0,0,.94-4.54c.88-4.53,3.25-8.78,3.3-13.39a3.8,3.8,0,0,0-.26-1.6c-.86-1.9-5.1-4-7.17-3.7C826.92,285.56,824.53,289.16,823.59,291.34Z"
              transform="translate(-6 -52.33)"
              fill="#fbbebe"
            />
            <path
              d="M881.13,178c-.39,4,3.44,6.95,5,10.64a17.89,17.89,0,0,1,1,5.35c1.07,12.67.24,25.42-.59,38.12A71.53,71.53,0,0,1,885,244.69c-2.14,8.68-7.41,16.19-12.57,23.49a20.33,20.33,0,0,1-2.69,3.29,20.12,20.12,0,0,1-5,3L847,283.1a34.12,34.12,0,0,0-6.29,3.62,17.16,17.16,0,0,0-5.21,6.77c-3.43-1.75-7-3.33-10.43-5.08-.81-.41-1.71-1-1.84-1.84-.19-1.2,1.06-2,1.92-2.9,1.61-1.59,2.11-3.95,3-6,2.85-6.84,10-11.21,12.6-18.15,1-2.66,1.3-5.67,3.06-7.91a19.66,19.66,0,0,1,3.38-3,57.09,57.09,0,0,0,7.48-7.67,13,13,0,0,0,2.45-3.58c.78-2,.55-4.17.59-6.28.13-6.92,3.26-13.38,5.18-20,1.8-6.26,2.55-12.84,4.92-18.91S874.82,179.65,881.13,178Z"
              transform="translate(-6 -52.33)"
              opacity="0.1"
            />
            <path
              d="M883.43,178c-.39,4,3.44,6.95,5,10.64a17.89,17.89,0,0,1,1,5.35c1.07,12.67.24,25.42-.59,38.12a71.53,71.53,0,0,1-1.56,12.56c-2.14,8.68-7.41,16.19-12.57,23.49a20.33,20.33,0,0,1-2.69,3.29,20.12,20.12,0,0,1-5,3l-17.7,8.58a34.12,34.12,0,0,0-6.29,3.62,17.16,17.16,0,0,0-5.21,6.77c-3.43-1.75-7-3.33-10.43-5.08-.81-.41-1.71-1-1.84-1.84-.19-1.2,1.06-2,1.92-2.9,1.61-1.59,2.11-3.95,3-6,2.85-6.84,10-11.21,12.6-18.15,1-2.66,1.3-5.67,3.06-7.91a19.66,19.66,0,0,1,3.38-3,57.78,57.78,0,0,0,7.49-7.67,12.92,12.92,0,0,0,2.44-3.58c.78-2,.55-4.17.59-6.28.13-6.92,3.26-13.38,5.18-20,1.8-6.26,2.55-12.84,4.92-18.91S877.12,179.65,883.43,178Z"
              transform="translate(-6 -52.33)"
              fill="#ff6f61"
            />
            <path
              d="M864.8,102.42a28.16,28.16,0,0,0-17.7,3.66c.78,0,1.57.08,2.37.18a28.37,28.37,0,0,1,10.9,52.67,28.37,28.37,0,0,0,4.43-56.51Z"
              transform="translate(-6 -52.33)"
              fill="#2f2e41"
            />
            <path
              d="M873.53,118.19a13,13,0,0,1,.22,9.94,11.12,11.12,0,0,0-.46-1.21c-3.51-7.81-14.31-11-24.13-7.22-5.79,2.25-9.94,6.45-11.66,11.11-2.5-7.54,2.58-16.21,11.9-19.83C859.22,107.16,870,110.39,873.53,118.19Z"
              transform="translate(-6 -52.33)"
              fill="#2f2e41"
            />
            <g opacity="0.1">
              <path
                d="M873.58,127.51a28.41,28.41,0,0,0-19-24.48,28.55,28.55,0,0,0-7.52,3c.78,0,1.57.08,2.37.18A28.37,28.37,0,0,1,873.58,127.51Z"
                transform="translate(-6 -52.33)"
              />
              <path
                d="M878.18,106.8a28.38,28.38,0,0,0-19-24.47,27.89,27.89,0,0,0-7.52,3c.78,0,1.57.08,2.37.18A28.36,28.36,0,0,1,878.18,106.8Z"
                transform="translate(-6 -52.33)"
              />
              <path
                d="M878.3,75.88A17.14,17.14,0,0,0,866.86,61.1,16.87,16.87,0,0,0,862.32,63c.47,0,.95,0,1.43.1A17.13,17.13,0,0,1,878.3,75.88Z"
                transform="translate(-6 -52.33)"
              />
              <path
                d="M888.91,123.66a28.36,28.36,0,0,1-22,30,28.33,28.33,0,0,1-6.56,5.29,28.35,28.35,0,0,0,28.54-35.27Z"
                transform="translate(-6 -52.33)"
              />
            </g>
            <path
              d="M963,119.35a20.32,20.32,0,0,0-11.74,1.28,17.27,17.27,0,0,1-14.1,0,19.8,19.8,0,0,0-16.58.32,10.29,10.29,0,0,1-4.77,1.2c-6.72,0-12.31-6.77-13.47-15.71a12.94,12.94,0,0,0,3.36-3.62c3.94-6.35,10-10.42,16.89-10.42s12.89,4,16.83,10.31a13,13,0,0,0,11.16,6.13h.18C956.06,108.81,960.69,113.1,963,119.35Z"
              transform="translate(-6 -52.33)"
              fill="#056162"
              opacity="0.1"
            />
            <path
              d="M983.42,91.32l-10.86,6.89,6.59-12a10.69,10.69,0,0,0-6.57-2.35h-.17a12,12,0,0,1-2.25-.16L966.47,86l1.58-2.87a13.13,13.13,0,0,1-6.44-4.89L955,82.46l4.16-7.57c-3.85-4.62-9-7.46-14.76-7.46-6.85,0-13,4.07-16.9,10.43a12.64,12.64,0,0,1-11.17,6H916c-7.56,0-13.7,8.58-13.7,19.16s6.14,19.16,13.7,19.16a10.17,10.17,0,0,0,4.77-1.2,19.8,19.8,0,0,1,16.58-.32,17.5,17.5,0,0,0,7.09,1.52,17.29,17.29,0,0,0,7-1.49,19.79,19.79,0,0,1,16.43.32,10.24,10.24,0,0,0,4.72,1.17c7.57,0,13.7-8.58,13.7-19.16A24.35,24.35,0,0,0,983.42,91.32Z"
              transform="translate(-6 -52.33)"
              fill="#056162"
              opacity="0.1"
            />
            <path
              d="M1046,247.87a28.9,28.9,0,0,0-16.77,1.83,24.71,24.71,0,0,1-20.14,0,28.26,28.26,0,0,0-23.68.46,14.64,14.64,0,0,1-6.82,1.71c-9.6,0-17.59-9.67-19.25-22.43a18.58,18.58,0,0,0,4.8-5.18c5.63-9.07,14.35-14.89,24.14-14.89s18.4,5.75,24,14.73a18.53,18.53,0,0,0,16,8.76h.25C1036.11,232.81,1042.73,238.94,1046,247.87Z"
              transform="translate(-6 -52.33)"
              fill="#056162"
              opacity="0.1"
            />
            <path
              d="M1075.2,207.82l-15.52,9.85,9.42-17.14a15.4,15.4,0,0,0-9.39-3.35h-.25a19.16,19.16,0,0,1-3.22-.24l-5.26,3.33,2.26-4.1a18.68,18.68,0,0,1-9.2-7l-9.42,6,6-10.81c-5.51-6.61-12.93-10.67-21.09-10.67-9.79,0-18.51,5.83-24.14,14.9a18,18,0,0,1-16,8.6h-.53c-10.81,0-19.57,12.26-19.57,27.37s8.76,27.37,19.57,27.37a14.72,14.72,0,0,0,6.82-1.7,28.22,28.22,0,0,1,23.68-.47,24.71,24.71,0,0,0,20.14.05,28.29,28.29,0,0,1,23.48.45,14.65,14.65,0,0,0,6.74,1.67c10.81,0,19.57-12.25,19.57-27.37A34.76,34.76,0,0,0,1075.2,207.82Z"
              transform="translate(-6 -52.33)"
              fill="#056162"
              opacity="0.1"
            />
            <path
              d="M698.62,192.35a20.32,20.32,0,0,1,11.74,1.28,17.24,17.24,0,0,0,14.09,0,19.8,19.8,0,0,1,16.58.32,10.32,10.32,0,0,0,4.77,1.2c6.72,0,12.32-6.77,13.48-15.71a12.79,12.79,0,0,1-3.36-3.62c-3.94-6.35-10-10.42-16.9-10.42s-12.88,4-16.82,10.31A13,13,0,0,1,711,181.81h-.17C705.51,181.81,700.87,186.1,698.62,192.35Z"
              transform="translate(-6 -52.33)"
              fill="#056162"
              opacity="0.1"
            />
            <path
              d="M678.14,164.32,689,171.21l-6.6-12a10.71,10.71,0,0,1,6.57-2.35h.18a12,12,0,0,0,2.25-.16l3.68,2.33-1.58-2.87a13.15,13.15,0,0,0,6.45-4.89l6.59,4.18-4.17-7.57c3.86-4.62,9-7.46,14.77-7.46,6.85,0,13,4.07,16.9,10.43a12.63,12.63,0,0,0,11.17,6h.36c7.57,0,13.7,8.58,13.7,19.16s-6.13,19.16-13.7,19.16a10.23,10.23,0,0,1-4.77-1.2,19.8,19.8,0,0,0-16.58-.32,17.45,17.45,0,0,1-7.08,1.52,17.22,17.22,0,0,1-7-1.49,19.81,19.81,0,0,0-16.44.32,10.21,10.21,0,0,1-4.72,1.17c-7.56,0-13.7-8.58-13.7-19.16A24.35,24.35,0,0,1,678.14,164.32Z"
              transform="translate(-6 -52.33)"
              fill="#056162"
              opacity="0.1"
            />
          </svg>
          <div>Welcome to Whatsapp on staroids</div>
        </div>
      )}
    </div>
  );
}
